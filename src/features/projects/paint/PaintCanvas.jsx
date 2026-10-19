import { forwardRef, memo, useCallback, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../shared/useReducedMotion';

/* ──────────────────────────────────────────────────────────────────────────
 * PaintCanvas — renders a region-based artwork and plays Zoobi's colouring
 * choreography with the Web Animations API (no per-frame React state).
 *
 *   mode="animate"  outline first, then regions are painted in order
 *   mode="outline"  static black-and-white
 *   mode="colour"   static finished artwork
 *
 * Each region is revealed by a brush stroke (a zig-zag mask that follows the
 * region's own bounding box) or, for small details, a gentle "bloom".
 * ────────────────────────────────────────────────────────────────────────── */

const fillOf = (f, uid) => (f && f.startsWith('g:') ? `url(#${uid}-g-${f.slice(2)})` : f);

function Shape({ s, ...rest }) {
  // eslint-disable-next-line no-unused-vars
  const { t, line, ...attrs } = s;
  const Tag = t;
  return <Tag {...attrs} {...rest} />;
}

function Defs({ artwork, uid, animate, size }) {
  return (
    <defs>
      {Object.entries(artwork.gradients || {}).map(([id, g]) =>
        g.type === 'radial' ? (
          <radialGradient key={id} id={`${uid}-g-${id}`} cx={g.cx ?? 0.5} cy={g.cy ?? 0.5} r={g.r ?? 0.5}>
            {g.stops.map(([o, c, op], i) => (
              <stop key={i} offset={o} stopColor={c} stopOpacity={op ?? 1} />
            ))}
          </radialGradient>
        ) : (
          <linearGradient key={id} id={`${uid}-g-${id}`} x1={g.x1 ?? 0} y1={g.y1 ?? 0} x2={g.x2 ?? 0} y2={g.y2 ?? 1}>
            {g.stops.map(([o, c, op], i) => (
              <stop key={i} offset={o} stopColor={c} stopOpacity={op ?? 1} />
            ))}
          </linearGradient>
        ),
      )}
      {Object.entries(artwork.clips || {}).map(([id, s]) => (
        <clipPath key={id} id={`${uid}-c-${id}`}>
          <Shape s={s} />
        </clipPath>
      ))}
      {animate &&
        artwork.regions
          .filter((r) => r.kind !== 'pop' && r.fill !== 'none')
          .map((r) => (
            <mask key={r.id} id={`${uid}-m-${r.id}`} maskUnits="userSpaceOnUse" x="0" y="0" width={size.w} height={size.h}>
              <path className="zp-stroke-path" d="" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
            </mask>
          ))}
    </defs>
  );
}

const Region = memo(function Region({ r, mode, uid }) {
  const fill = fillOf(r.fill, uid);
  const animate = mode === 'animate';
  const pop = r.kind === 'pop';
  const body = r.shapes.map((s, i) => {
    if (s.line) return <Shape key={i} s={s} className="zp-line" />;
    return (
      <g key={i} className="zp-sh" style={{ '--i': i }}>
        {!r.overlay && <Shape s={s} className="zp-paper" />}
        {mode !== 'outline' && (
          <g className={animate && pop ? 'zp-col zp-pop' : 'zp-col'} mask={animate && !pop ? `url(#${uid}-m-${r.id})` : undefined}>
            <Shape s={s} fill={fill} className="zp-fill" />
          </g>
        )}
        {!r.overlay && <Shape s={s} className="zp-ink" />}
      </g>
    );
  });
  const style = {};
  if (r.opacity != null) style.opacity = r.opacity;
  if (r.ambX != null) style['--amb-x'] = `${r.ambX}px`;
  if (r.ambDur != null) style['--amb-dur'] = `${r.ambDur}s`;
  const inner = (
    <g className="zp-region" data-region={r.id} data-amb={r.amb || undefined} style={style}>
      {body}
    </g>
  );
  return r.clip ? <g clipPath={`url(#${uid}-c-${r.clip})`}>{inner}</g> : inner;
});

function Brush({ brushRef }) {
  return (
    <g ref={brushRef} className="zp-brush" aria-hidden="true">
      <g className="zp-brush-wobble" transform="rotate(34) scale(.95)">
        <path d="M0,0 C-9,-7 -10,-22 -6,-34 L6,-34 C10,-22 9,-7 0,0Z" fill="#ff7fc4" stroke="#34283f" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M-5,-14 C-3,-20 3,-20 5,-14 C3,-8 -3,-8 -5,-14Z" fill="#ffd45e" />
        <rect x="-7" y="-50" width="14" height="17" rx="2" fill="#cfd5de" stroke="#34283f" strokeWidth="2.5" />
        <path d="M-5,-50 L-3.5,-128 Q0,-132 3.5,-128 L5,-50Z" fill="#9a6a42" stroke="#34283f" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
    </g>
  );
}

/** Build the zig-zag brush path that covers a bounding box. */
function sweepPath(b) {
  const vertical = b.height > b.width * 1.8;
  const long = vertical ? b.height : b.width;
  const across = vertical ? b.width : b.height;
  const brush = Math.max(16, Math.min(64, across / 3 || 40));
  const lanes = Math.max(1, Math.ceil(across / brush));
  const step = across / lanes;
  const pad = brush * 0.7;
  const a0 = (vertical ? b.y : b.x) - pad;
  const a1 = (vertical ? b.y + b.height : b.x + b.width) + pad;
  const o0 = vertical ? b.x : b.y;
  let d = '';
  for (let i = 0; i < lanes; i++) {
    const o = o0 + step * (i + 0.5);
    const [s, e] = i % 2 === 0 ? [a0, a1] : [a1, a0];
    const p = (a, c) => (vertical ? `${c.toFixed(1)},${a.toFixed(1)}` : `${a.toFixed(1)},${c.toFixed(1)}`);
    d += `${i === 0 ? 'M' : 'L'}${p(s, o)} L${p(e, o)} `;
  }
  void long;
  return { d: d.trim(), width: step * 1.3 + 6 };
}

const POP = [
  { opacity: 0, transform: 'scale(0.15)' },
  { opacity: 1, transform: 'scale(1.16)', offset: 0.62 },
  { opacity: 1, transform: 'scale(1)' },
];

const PaintCanvas = forwardRef(function PaintCanvas(
  { artwork, mode = 'animate', autoplay = true, speed = 1, instant = false, showBrush = true, onState, className = '', label },
  ref,
) {
  const uid = `zp${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const svgRef = useRef(null);
  const clockRef = useRef(null);
  const brushRef = useRef(null);
  const animsRef = useRef([]);
  const stateRef = useRef({ phase: mode === 'animate' ? 'outline' : 'done', paused: false });
  const skippedRef = useRef(false);
  const [state, setState] = useState(stateRef.current);
  const onStateRef = useRef(onState);
  onStateRef.current = onState;

  const [vw, vh] = artwork.viewBox.split(' ').slice(2).map(Number);

  const commit = useCallback((patch) => {
    stateRef.current = { ...stateRef.current, ...patch };
    setState(stateRef.current);
    onStateRef.current?.(stateRef.current);
  }, []);

  const teardown = useCallback(() => {
    animsRef.current.forEach((a) => {
      a.onfinish = null;
      try {
        a.cancel();
      } catch {
        /* already gone */
      }
    });
    animsRef.current = [];
  }, []);

  const build = useCallback(
    (play) => {
      const svg = svgRef.current;
      if (!svg) return;
      teardown();
      skippedRef.current = false;
      const lead = artwork.lead ?? 1500;
      const anims = [];
      const stops = [];
      let total = 0;

      artwork.regions.forEach((r) => {
        const g = svg.querySelector(`[data-region="${r.id}"]`);
        if (!g || r.fill === 'none') return;
        let bb = { x: 0, y: 0, width: vw, height: vh };
        try {
          const b = g.getBBox();
          if (b.width > 0 && b.height > 0) bb = b;
        } catch {
          /* detached or unsupported — fall back to the whole canvas */
        }
        const start = (lead + r.at) / speed;
        if (r.kind === 'pop') {
          const els = g.querySelectorAll('.zp-pop');
          const n = els.length;
          const gap = r.stagger ?? (n > 1 ? Math.max(0, (r.dur - 450) / (n - 1)) : 0);
          els.forEach((el, k) => {
            anims.push(el.animate(POP, { duration: 520 / speed, delay: start + (k * gap) / speed, easing: 'cubic-bezier(.3,.7,.3,1)', fill: 'both' }));
          });
          total = Math.max(total, r.at + (n - 1) * gap + 520);
        } else {
          const path = svg.querySelector(`#${uid}-m-${r.id} path`);
          if (!path) return;
          const sw = sweepPath(bb);
          path.setAttribute('d', sw.d);
          path.setAttribute('stroke-width', sw.width.toFixed(1));
          path.style.strokeDasharray = '1 2';
          anims.push(path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: r.dur / speed, delay: start, easing: 'cubic-bezier(.45,.05,.3,1)', fill: 'both' }));
          total = Math.max(total, r.at + r.dur);
        }
        stops.push({ t: r.at + r.dur / 2, x: bb.x + bb.width / 2, y: bb.y + bb.height / 2 });
      });

      const D = lead + total + 700;
      // Brush glides between the regions it is colouring.
      if (brushRef.current && showBrush && stops.length) {
        stops.sort((a, b) => a.t - b.t);
        const T = (p) => `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
        const frames = [{ offset: 0, opacity: 0, transform: T(stops[0]) }];
        let last = 0;
        const push = (t, p, opacity = 1) => {
          const off = Math.min(0.9999, Math.max(last + 0.0005, t / D));
          last = off;
          frames.push({ offset: off, opacity, transform: T(p), easing: 'ease-in-out' });
        };
        push(Math.max(1, lead - 250), stops[0]);
        stops.forEach((p) => push(lead + p.t, p));
        push(lead + total + 250, stops[stops.length - 1], 1);
        frames.push({ offset: 1, opacity: 0, transform: T(stops[stops.length - 1]) });
        anims.push(brushRef.current.animate(frames, { duration: D / speed, fill: 'both' }));
      }

      const leadClock = clockRef.current.animate([{ opacity: 0 }, { opacity: 0 }], { duration: lead / speed });
      const endClock = clockRef.current.animate([{ opacity: 0 }, { opacity: 0 }], { duration: D / speed });
      leadClock.onfinish = () => {
        if (!skippedRef.current) commit({ phase: 'painting' });
      };
      endClock.onfinish = () => commit({ phase: 'done', paused: false });
      anims.push(leadClock, endClock);
      animsRef.current = anims;

      if (!play) anims.forEach((a) => a.pause());
      commit({ phase: 'outline', paused: !play });
    },
    [artwork, speed, showBrush, teardown, commit, uid, vw, vh],
  );

  const finishAll = useCallback(() => {
    skippedRef.current = true;
    animsRef.current.forEach((a) => {
      try {
        a.finish();
      } catch {
        /* ignore */
      }
    });
    commit({ phase: 'done', paused: false });
  }, [commit]);

  useLayoutEffect(() => {
    if (mode !== 'animate') return undefined;
    build(autoplay);
    if (instant || prefersReducedMotion()) finishAll();
    return teardown;
    // Rebuild only when the artwork or mode changes (the parent re-keys on replay).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artwork, mode]);

  // Pause CSS ambient motion while off-screen.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => {
      svg.dataset.visible = e.isIntersecting ? 'true' : 'false';
    });
    io.observe(svg);
    return () => io.disconnect();
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      play() {
        animsRef.current.forEach((a) => a.playState === 'paused' && a.play());
        commit({ paused: false });
      },
      pause() {
        if (stateRef.current.phase === 'done') return;
        animsRef.current.forEach((a) => a.playState === 'running' && a.pause());
        commit({ paused: true });
      },
      toggle() {
        if (stateRef.current.paused) this.play();
        else this.pause();
      },
      skip: finishAll,
      replay() {
        build(true);
      },
    }),
    [build, commit, finishAll],
  );

  const animate = mode === 'animate';
  const showExtras = mode !== 'outline';
  return (
    <svg
      ref={svgRef}
      className={`zp-svg ${className}`}
      viewBox={artwork.viewBox}
      role="img"
      aria-label={label || artwork.alt || artwork.title}
      data-phase={state.phase}
      data-paused={state.paused ? 'true' : 'false'}
      data-static={animate ? undefined : 'true'}
      data-mode={mode}
      style={{ '--ink': artwork.ink, '--paper': artwork.paper, '--ink-done': artwork.inkDone ?? 1 }}
      preserveAspectRatio="xMidYMid slice"
    >
      <Defs artwork={artwork} uid={uid} animate={animate} size={{ w: vw, h: vh }} />
      <rect className="zp-bg" width={vw} height={vh} fill={artwork.paper} />
      {artwork.regions.map((r) => (
        <Region key={r.id} r={r} mode={mode} uid={uid} />
      ))}
      {showExtras && (
        <g className="zp-extras" aria-hidden="true">
          {(artwork.extras || []).map((x) => (
            <g key={x.id} className="zp-extra" data-amb={x.amb} style={x.style}>
              {x.shapes.map((s, i) => (
                <Shape key={i} s={s} fill={s.line ? 'none' : x.fill || 'none'} stroke={x.stroke} strokeWidth={x.strokeWidth} opacity={x.opacity} strokeLinecap="round" />
              ))}
            </g>
          ))}
        </g>
      )}
      {animate && showBrush && <Brush brushRef={brushRef} />}
      <g ref={clockRef} aria-hidden="true" />
    </svg>
  );
});

export default PaintCanvas;
