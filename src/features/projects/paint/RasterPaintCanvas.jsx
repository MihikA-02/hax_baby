import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { prefersReducedMotion } from '../shared/useReducedMotion';

/**
 * RasterPaintCanvas — plays Zoobi's colouring of a hand-drawn page (line art + region map).
 *
 *   artwork.lines  transparent PNG/WebP of the ink lines
 *   artwork.map    8-bit region map (red channel = region id, 0 = unpainted)
 *   artwork.meta   { w, h, total, regions: [{ i, x0,y0,x1,y1, c1,c2, gy, start, dur }] }
 *
 * Same imperative API and onState() phases as PaintCanvas, so the viewer and AnimationControls work unchanged:
 *   mode="animate"  outline first, then every region is painted with zig-zag brush strokes
 *   mode="outline"  static black-and-white page
 *   mode="colour"   static finished page
 *
 * How it stays smooth: every pixel gets a reveal time once (bucketed into 16 ms slots with a counting sort);
 * each frame just writes the pixels whose slot has arrived and uploads the dirty rectangle.
 */

const LEAD = 1100; // ms of plain outline before the first stroke
const TICK = 16;
const engines = new Map();

function hexRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function buildEngine(art) {
  const { meta } = art;
  const { w, h } = meta;
  const img = await loadImage(art.map);
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  cx.drawImage(img, 0, 0, w, h);
  const px = cx.getImageData(0, 0, w, h).data;
  const n = w * h;
  const labels = new Uint8Array(n);
  for (let p = 0; p < n; p += 1) labels[p] = px[p * 4];

  const regs = new Array(256).fill(null);
  meta.regions.forEach((r) => {
    const c1 = hexRgb(r.c1);
    const c2 = hexRgb(r.c2 || r.c1);
    const bh = Math.max(1, r.y1 - r.y0 + 1);
    const bw = Math.max(1, r.x1 - r.x0 + 1);
    const small = r.area < 1400; // tiny details bloom outwards instead of sweeping
    const band = Math.max(18, Math.min(60, Math.round(bh / 9)));
    regs[r.i] = { ...r, c1, c2, flat: r.c1 === (r.c2 || r.c1), bh, bw, small, band, nb: Math.ceil(bh / band), cxm: r.x0 + bw / 2, cym: r.y0 + bh / 2, rad: Math.hypot(bw, bh) / 2 };
  });

  const slots = Math.ceil(meta.total / TICK) + 3;
  const slotOf = new Int32Array(n).fill(-1);
  const counts = new Uint32Array(slots + 1);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const p = y * w + x;
      const r = regs[labels[p]];
      if (!r) continue;
      let pos;
      if (r.small) {
        pos = Math.min(1, Math.hypot(x - r.cxm, y - r.cym) / r.rad);
      } else {
        const b = Math.floor((y - r.y0) / r.band);
        const u = (x - r.x0) / r.bw;
        pos = (b + (b % 2 ? 1 - u : u)) / r.nb;
      }
      pos = Math.min(1, pos + (((x * 7 + y * 13) & 15) / 15) * 0.012); // ragged brush edge
      const s = Math.min(slots - 1, Math.floor((r.start + r.dur * pos) / TICK));
      slotOf[p] = s;
      counts[s + 1] += 1;
    }
  }
  for (let s = 0; s < slots; s += 1) counts[s + 1] += counts[s];
  const startAt = counts.slice();
  const order = new Uint32Array(counts[slots]);
  const fill = counts.slice(0, slots);
  for (let p = 0; p < n; p += 1) {
    const s = slotOf[p];
    if (s >= 0) order[fill[s]++] = p;
  }
  return { w, h, labels, regs, order, startAt, slots };
}

function getEngine(art) {
  if (!engines.has(art.id)) engines.set(art.id, buildEngine(art));
  return engines.get(art.id);
}

/** Writes every pixel in slots [from, to) and returns the dirty rect + last painted pixel. */
function paintSlots(eng, data, from, to) {
  const { w, h, labels, regs, order, startAt, slots } = eng;
  const a = Math.max(0, from);
  const b = Math.min(slots, to);
  const lo = startAt[a];
  const hi = startAt[b];
  let minX = w, minY = h, maxX = -1, maxY = -1, last = -1;
  for (let k = lo; k < hi; k += 1) {
    const p = order[k];
    const x = p % w;
    const y = (p / w) | 0;
    const r = regs[labels[p]];
    const o = p * 4;
    if (r.flat) {
      data[o] = r.c1[0]; data[o + 1] = r.c1[1]; data[o + 2] = r.c1[2];
    } else {
      const t = r.gy === 'page' ? y / h : (y - r.y0) / r.bh;
      data[o] = r.c1[0] + (r.c2[0] - r.c1[0]) * t;
      data[o + 1] = r.c1[1] + (r.c2[1] - r.c1[1]) * t;
      data[o + 2] = r.c1[2] + (r.c2[2] - r.c1[2]) * t;
    }
    data[o + 3] = 255;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    last = p;
  }
  return { minX, minY, maxX, maxY, last, any: hi > lo };
}

const RasterPaintCanvas = forwardRef(function RasterPaintCanvas(
  { artwork, mode = 'animate', autoplay = true, speed = 1, onState, className = '', label, fill = false },
  ref,
) {
  const { meta } = artwork;
  const canvasRef = useRef(null);
  const brushRef = useRef(null);
  const onStateRef = useRef(onState);
  onStateRef.current = onState;
  const stateRef = useRef({ phase: mode === 'animate' ? 'outline' : 'done', paused: false });
  const [state, setState] = useState(stateRef.current);
  const sim = useRef({ eng: null, img: null, t: -LEAD, slot: 0, raf: 0, last: 0, running: false });

  const commit = useCallback((patch) => {
    stateRef.current = { ...stateRef.current, ...patch };
    setState(stateRef.current);
    onStateRef.current?.(stateRef.current);
  }, []);

  const flush = useCallback((from, to) => {
    const s = sim.current;
    const cv = canvasRef.current;
    if (!s.eng || !cv) return;
    const d = paintSlots(s.eng, s.img.data, from, to);
    if (d.any) {
      cv.getContext('2d').putImageData(s.img, 0, 0, d.minX, d.minY, d.maxX - d.minX + 1, d.maxY - d.minY + 1);
      const br = brushRef.current;
      if (br && d.last >= 0) {
        const x = d.last % s.eng.w;
        const y = (d.last / s.eng.w) | 0;
        const reg = s.eng.regs[s.eng.labels[d.last]];
        br.style.left = `${(x / s.eng.w) * 100}%`;
        br.style.top = `${(y / s.eng.h) * 100}%`;
        br.style.setProperty('--brush', `rgb(${reg.c1.join(',')})`);
      }
    }
  }, []);

  const stop = useCallback(() => {
    const s = sim.current;
    s.running = false;
    cancelAnimationFrame(s.raf);
  }, []);

  const finishAll = useCallback(() => {
    const s = sim.current;
    stop();
    if (s.eng) {
      flush(s.slot, s.eng.slots);
      s.slot = s.eng.slots;
    }
    commit({ phase: 'done', paused: false });
  }, [commit, flush, stop]);

  const tick = useCallback(
    (now) => {
      const s = sim.current;
      if (!s.running) return;
      const dt = Math.min(48, now - s.last);
      s.last = now;
      s.t += dt * speed;
      if (s.t >= 0 && stateRef.current.phase === 'outline') commit({ phase: 'painting' });
      if (s.t >= 0) {
        const target = Math.floor(s.t / TICK) + 1;
        flush(s.slot, target);
        s.slot = Math.max(s.slot, target);
      }
      if (s.t >= meta.total + 200) {
        finishAll();
        return;
      }
      s.raf = requestAnimationFrame(tick);
    },
    [commit, finishAll, flush, meta.total, speed],
  );

  const resume = useCallback(() => {
    const s = sim.current;
    if (s.running || !s.eng) return;
    s.running = true;
    s.last = performance.now();
    s.raf = requestAnimationFrame(tick);
  }, [tick]);

  const start = useCallback(
    (play) => {
      const s = sim.current;
      stop();
      const cv = canvasRef.current;
      if (!cv || !s.eng) return;
      s.img = new ImageData(meta.w, meta.h);
      cv.getContext('2d').clearRect(0, 0, meta.w, meta.h);
      s.t = -LEAD;
      s.slot = 0;
      commit({ phase: 'outline', paused: !play });
      if (play) resume();
    },
    [commit, meta.h, meta.w, resume, stop],
  );

  // Build (or reuse) the pixel schedule, then start / paint-all depending on the mode.
  useEffect(() => {
    if (mode === 'outline') return undefined;
    let dead = false;
    getEngine(artwork).then((eng) => {
      if (dead) return;
      sim.current.eng = eng;
      sim.current.img = new ImageData(meta.w, meta.h);
      if (mode === 'colour' || prefersReducedMotion()) {
        sim.current.slot = 0;
        flush(0, eng.slots);
        sim.current.slot = eng.slots;
        commit({ phase: 'done', paused: false });
      } else {
        start(autoplay);
      }
    });
    return () => {
      dead = true;
      stop();
    };
    // Rebuild only when the artwork or mode changes (the parent re-keys on replay).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artwork, mode]);

  useImperativeHandle(
    ref,
    () => ({
      play() {
        if (stateRef.current.phase === 'done') return;
        commit({ paused: false });
        resume();
      },
      pause() {
        if (stateRef.current.phase === 'done') return;
        stop();
        commit({ paused: true });
      },
      toggle() {
        if (stateRef.current.paused) this.play();
        else this.pause();
      },
      skip: finishAll,
      replay() {
        start(true);
      },
    }),
    [commit, finishAll, resume, start, stop],
  );

  const ar = meta.w / meta.h;
  return (
    <div
      className={`zp-raster${fill ? ' is-fill' : ''} ${className}`}
      style={{ '--ar': ar, background: artwork.paper }}
      role="img"
      aria-label={label || artwork.alt || artwork.title}
      data-phase={state.phase}
      data-paused={state.paused ? 'true' : 'false'}
      data-mode={mode}
    >
      {mode !== 'outline' && <canvas ref={canvasRef} className="zp-raster-colour" width={meta.w} height={meta.h} aria-hidden="true" />}
      <img className="zp-raster-lines" src={artwork.lines} alt="" width={meta.w} height={meta.h} draggable="false" decoding="async" />
      {mode === 'animate' && state.phase === 'painting' && (
        <span ref={brushRef} className={`zp-rbrush${state.paused ? ' is-paused' : ''}`} aria-hidden="true" />
      )}
    </div>
  );
});

export default RasterPaintCanvas;
