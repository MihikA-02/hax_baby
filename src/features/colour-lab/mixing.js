import { EXPERIMENTS, SHADE_LIBRARY } from './data';

/* Deterministic colour mixing for the visitor mixer.
 *
 * Paint is subtractive, screens are additive, so neither plain RGB averaging nor pure multiplication
 * looks right. Zoobi's pigment model blends them in linear light:
 *     result = 0.45 · (weighted average)  +  0.55 · (weighted geometric mean)
 * which keeps yellow + blue green, red + yellow orange, and white lightening instead of greying.
 * It is an artistic approximation of pigments — not a physical simulation. */

const clamp = (n, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));

export function normaliseHex(hex) {
  let h = String(hex || '').trim().replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return /^[0-9a-fA-F]{6}$/.test(h) ? `#${h.toUpperCase()}` : null;
}
export function hexToRgb(hex) {
  const h = normaliseHex(hex);
  if (!h) return [0, 0, 0];
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
}
export const rgbToHex = (rgb) => `#${rgb.map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('').toUpperCase()}`;

const toLinear = (v) => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const toSrgb = (l) => 255 * (l <= 0.0031308 ? 12.92 * l : 1.055 * l ** (1 / 2.4) - 0.055);

export function mixHex(hexA, hexB, t = 0.5) {
  const w = clamp(t);
  const a = hexToRgb(hexA).map(toLinear);
  const b = hexToRgb(hexB).map(toLinear);
  const out = a.map((la, i) => {
    const lb = b[i];
    const arith = (1 - w) * la + w * lb;
    const geo = Math.max(la, 0.004) ** (1 - w) * Math.max(lb, 0.004) ** w;
    return toSrgb(0.45 * arith + 0.55 * geo);
  });
  return rgbToHex(out);
}

/** OKLab, for perceptual nearest-name lookup. */
function oklab(hex) {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
const LIB = SHADE_LIBRARY.map((s) => ({ ...s, lab: oklab(s.hex) }));

export function nameFor(hex) {
  const lab = oklab(hex);
  let best = LIB[0];
  let bestD = Infinity;
  for (const s of LIB) {
    const d = (s.lab[0] - lab[0]) ** 2 + (s.lab[1] - lab[1]) ** 2 + (s.lab[2] - lab[2]) ** 2;
    if (d < bestD) {
      bestD = d;
      best = s;
    }
  }
  return best.name;
}

/** Zoobi's own recipe for this pair (either order, 50/50), if one exists. */
export function findRecipe(hexA, hexB) {
  const a = normaliseHex(hexA);
  const b = normaliseHex(hexB);
  return EXPERIMENTS.find((e) => (normaliseHex(e.a.hex) === a && normaliseHex(e.b.hex) === b) || (normaliseHex(e.a.hex) === b && normaliseHex(e.b.hex) === a));
}

/**
 * The visitor mixer's single entry point. `share` is how much of colour B goes in (0–1).
 * Same inputs → same output, always.
 */
export function mixColours(hexA, hexB, share = 0.5) {
  const recipe = Math.abs(share - 0.5) < 0.0001 ? findRecipe(hexA, hexB) : undefined;
  if (recipe) return { hex: recipe.result.hex, name: recipe.result.name, line: recipe.result.line, recipe: true };
  const hex = mixHex(hexA, hexB, share);
  const name = nameFor(hex);
  return { hex, name, line: `Zoobi would call this ${name}.`, recipe: false };
}
