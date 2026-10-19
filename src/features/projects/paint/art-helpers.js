// Tiny geometry kit used to author Zoobi's artwork as data.
// Every shape is a plain object: { t: 'path'|'circle'|'ellipse'|'rect'|'polygon', ...svgAttrs, transform?, line? }
// `line: true` shapes are drawn as ink only (antennae, rays, whiskers) and are never filled.

const f = (n) => Math.round(n * 10) / 10;

export const C = (cx, cy, r) => ({ t: 'circle', cx, cy, r });
export const E = (cx, cy, rx, ry, rot = 0) => ({
  t: 'ellipse',
  cx,
  cy,
  rx,
  ry,
  ...(rot ? { transform: `rotate(${rot} ${cx} ${cy})` } : {}),
});
export const P = (d) => ({ t: 'path', d });
export const RC = (x, y, width, height, rx = 0) => ({ t: 'rect', x, y, width, height, rx });
export const G = (pts) => ({ t: 'polygon', points: pts.map((p) => `${f(p[0])},${f(p[1])}`).join(' ') });
export const L = (d) => ({ t: 'path', d, line: true });

/** Prepend a transform to a shape (applied after the shape's own transform). */
export const at = (shape, transform) => ({
  ...shape,
  transform: shape.transform ? `${transform} ${shape.transform}` : transform,
});
export const mirror = (shape, cx) => at(shape, `translate(${2 * cx} 0) scale(-1 1)`);
export const place = (shapes, transform) => shapes.map((s) => at(s, transform));

/** Deterministic pseudo-random numbers so artwork never changes between renders. */
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const star = (cx, cy, R, r = R * 0.45, n = 5, rot = -90) => {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = ((rot + (i * 180) / n) * Math.PI) / 180;
    const rad = i % 2 === 0 ? R : r;
    pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
  }
  return G(pts);
};

export const sparkle = (cx, cy, R) => star(cx, cy, R, R * 0.28, 4, -90);

/** Fluffy cloud as ONE outline (so no internal stroke lines). */
export const cloud = (cx, cy, w) => {
  const x = cx - w / 2;
  const p = (a, b) => `${f(x + a * w)},${f(cy + b * w)}`;
  const r = (k) => f(k * w);
  return P(
    `M${p(0, 0)} A${r(0.14)},${r(0.14)} 0 0 1 ${p(0.08, -0.2)} A${r(0.17)},${r(0.17)} 0 0 1 ${p(0.34, -0.3)} ` +
      `A${r(0.2)},${r(0.2)} 0 0 1 ${p(0.66, -0.28)} A${r(0.15)},${r(0.15)} 0 0 1 ${p(0.92, -0.16)} ` +
      `A${r(0.12)},${r(0.12)} 0 0 1 ${p(1, 0)} Z`,
  );
};

/** Smooth open curve through points (quadratic midpoint smoothing). */
export function smooth(pts) {
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    d += ` Q${f(x)},${f(y)} ${f((x + nx) / 2)},${f((y + ny) / 2)}`;
  }
  const l = pts[pts.length - 1];
  return `${d} L${f(l[0])},${f(l[1])}`;
}
/** Filled landscape band: smooth ridge line, closed down to `bottom`. */
export const land = (pts, bottom = 600) =>
  P(`${smooth(pts)} L${pts[pts.length - 1][0]},${bottom} L${pts[0][0]},${bottom} Z`);

export const hill = (x0, x1, yEdge, peak, bottom = 610) => {
  const cy = 2 * peak - yEdge;
  return P(`M${x0},${bottom} L${x0},${yEdge} Q${(x0 + x1) / 2},${f(cy)} ${x1},${yEdge} L${x1},${bottom} Z`);
};

export const leaf = (x, y, len, w, rot = 0) =>
  at(P(`M0,0 Q${f(len * 0.5)},${-w} ${len},0 Q${f(len * 0.5)},${w} 0,0 Z`), `translate(${x} ${y}) rotate(${rot})`);

/** Tapered stem along a quadratic curve. */
export const stem = (x1, y1, cx, cy, x2, y2, w = 7) =>
  P(`M${x1 - w / 2},${y1} Q${cx - w / 2},${cy} ${x2 - w / 4},${y2} L${x2 + w / 4},${y2} Q${cx + w / 2},${cy} ${x1 + w / 2},${y1} Z`);

/** Round-petal flower head: n petals around (cx,cy). */
export const petals = (cx, cy, R, n, pw = R * 0.3, rot = 0) => {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = rot + (360 / n) * i;
    const rad = (a * Math.PI) / 180;
    const px = cx + Math.cos(rad) * R * 0.62;
    const py = cy + Math.sin(rad) * R * 0.62;
    out.push(E(px, py, R * 0.42, pw, a));
  }
  return out;
};

export const tulip = (cx, cy, s = 1) =>
  at(P('M-22,-6 C-24,-38 -10,-52 0,-60 C10,-52 24,-38 22,-6 C14,10 -14,10 -22,-6 Z'), `translate(${cx} ${cy}) scale(${s})`);

export const mushroom = (cx, cy, s = 1) => {
  const T = `translate(${cx} ${cy}) scale(${s})`;
  return {
    cap: at(P('M-46,0 C-46,-48 -22,-70 0,-70 C22,-70 46,-48 46,0 C20,10 -20,10 -46,0 Z'), T),
    stalk: at(P('M-14,2 C-10,18 -12,34 -16,46 L16,46 C12,34 10,18 14,2 Z'), T),
    dots: [at(E(-18, -38, 7, 5), T), at(E(14, -48, 8, 6), T), at(E(26, -22, 5, 4), T)],
  };
};

/** A butterfly in local coords centred on the body, placed with translate/rotate/scale. */
export const butterfly = (cx, cy, s = 1, rot = 0) => {
  const T = `translate(${cx} ${cy}) rotate(${rot}) scale(${s})`;
  const up = P('M0,-8 C-30,-72 -112,-84 -106,-26 C-102,6 -46,14 0,-4 Z');
  const lo = P('M0,2 C-55,6 -98,34 -78,76 C-58,102 -16,62 0,14 Z');
  const both = (sh) => [at(sh, T), at(sh, `${T} scale(-1 1)`)];
  return {
    upper: both(up),
    lower: both(lo),
    spots: [...both(C(-72, -36, 11)), ...both(C(-50, -58, 7)), ...both(C(-52, 52, 9))],
    body: [at(E(0, 12, 7, 34), T), at(C(0, -24, 8), T)],
    feelers: [at(L('M-3,-30 Q-10,-58 -24,-66'), T), at(L('M3,-30 Q10,-58 24,-66'), T)],
  };
};

export const pine = (cx, base, h, w) => {
  const top = base - h;
  const half = [
    [0.28, 0.28],
    [0.14, 0.28],
    [0.4, 0.55],
    [0.2, 0.55],
    [0.5, 0.88],
  ];
  const right = half.map(([dx, dy]) => [cx + dx * w, top + dy * h]);
  const left = half.map(([dx, dy]) => [cx - dx * w, top + dy * h]).reverse();
  return G([[cx, top], ...right, [cx, top + h * 0.88], ...left]);
};

/** Region factory. kind: 'sweep' (brush reveal) | 'pop' (appears with a little bloom). */
export const reg = (id, fill, at_, dur, shapes, opts = {}) => ({
  id,
  fill,
  at: at_,
  dur,
  kind: 'sweep',
  ...opts,
  shapes: shapes.flat(),
});
