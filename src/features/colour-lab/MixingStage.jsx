import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from '../projects/shared/useReducedMotion';
import { sparkle } from '../projects/paint/art-helpers';

/* The signature animation: two paint drops appear, Zoobi's brush draws them together,
 * the pigments marble, and one new shade settles. Phases are driven by a tiny timer chain
 * (5 state changes per experiment) and everything visual is CSS/SVG. */

const PHASES = ['appear', 'approach', 'blend', 'reveal'];
const DURATION = { appear: 1500, approach: 1700, blend: 2000 };
const SPARKS = Array.from({ length: 10 }, (_, i) => {
  const a = (i / 10) * Math.PI * 2;
  return { dx: Math.round(Math.cos(a) * 120), dy: Math.round(Math.sin(a) * 90), d: sparkle(0, 0, 9 + (i % 3) * 3).points };
});

export default function MixingStage({ exp, paused = false, hold = 3800, onComplete, label }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(reduced ? 'reveal' : 'appear');

  useEffect(() => {
    if (reduced) {
      setPhase('reveal');
      return undefined;
    }
    if (paused) return undefined;
    const i = PHASES.indexOf(phase);
    const ms = phase === 'reveal' ? hold : DURATION[phase];
    if (phase === 'reveal' && !onComplete) return undefined;
    const id = setTimeout(() => {
      if (phase === 'reveal') onComplete?.();
      else setPhase(PHASES[i + 1]);
    }, ms);
    return () => clearTimeout(id);
  }, [phase, paused, reduced, hold, onComplete]);

  const style = useMemo(() => ({ '--a': exp.a.hex, '--b': exp.b.hex, '--m': exp.result.hex }), [exp]);
  const revealed = phase === 'reveal';

  return (
    <figure className="zp-mix" data-phase={phase} data-paused={paused ? 'true' : 'false'} style={style}>
      <svg viewBox="0 0 640 340" role="img" aria-label={label || `${exp.a.name} and ${exp.b.name} mixing into ${exp.result.name}`}>
        <defs>
          <filter id="zp-goo" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b" />
            <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
          </filter>
          <radialGradient id="zp-sheen" cx="35%" cy="30%" r="70%">
            <stop offset="0" stopColor="#fff" stopOpacity=".55" />
            <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse className="zp-mix-shadow" cx="320" cy="268" rx="190" ry="15" />
        <g filter="url(#zp-goo)">
          <g className="zp-in" style={{ transformOrigin: '150px 170px' }}>
            <circle className="zp-blob zp-blob-a" cx="150" cy="170" r="66" />
          </g>
          <g className="zp-in zp-in-b" style={{ transformOrigin: '490px 170px' }}>
            <circle className="zp-blob zp-blob-b" cx="490" cy="170" r="66" />
          </g>
          <circle className="zp-blob-m" cx="320" cy="170" r="92" />
          <g className="zp-orbit" style={{ transformOrigin: '320px 170px' }}>
            <circle className="zp-orbit-a" cx="285" cy="170" r="34" />
            <circle className="zp-orbit-b" cx="355" cy="170" r="34" />
          </g>
        </g>
        <circle className="zp-sheen" cx="320" cy="170" r="92" fill="url(#zp-sheen)" />
        <g className="zp-stir" aria-hidden="true">
          <g transform="translate(320 132) rotate(30)">
            <path d="M0,0 C-9,-7 -10,-22 -6,-34 L6,-34 C10,-22 9,-7 0,0Z" fill="#ff7fc4" stroke="#34283f" strokeWidth="2.5" strokeLinejoin="round" />
            <rect x="-7" y="-50" width="14" height="17" rx="2" fill="#cfd5de" stroke="#34283f" strokeWidth="2.5" />
            <path d="M-5,-50 L-3.5,-140 Q0,-144 3.5,-140 L5,-50Z" fill="#9a6a42" stroke="#34283f" strokeWidth="2.5" strokeLinejoin="round" />
          </g>
        </g>
        <g className="zp-sparks" transform="translate(320 170)" aria-hidden="true">
          {SPARKS.map((s, i) => (
            <polygon key={i} points={s.d} style={{ '--dx': `${s.dx}px`, '--dy': `${s.dy}px`, animationDelay: `${i * 40}ms` }} />
          ))}
        </g>
      </svg>

      <figcaption className="zp-mix-caption" aria-live="polite">
        <div className="zp-mix-chip">
          <span className="zp-dot" style={{ background: exp.a.hex }} />
          <span className="zp-mix-name">{exp.a.name}</span>
          <code>{exp.a.hex}</code>
        </div>
        <span className="zp-op" aria-hidden="true">+</span>
        <div className="zp-mix-chip">
          <span className="zp-dot" style={{ background: exp.b.hex }} />
          <span className="zp-mix-name">{exp.b.name}</span>
          <code>{exp.b.hex}</code>
        </div>
        <span className="zp-op" aria-hidden="true">=</span>
        <div className={`zp-mix-result${revealed ? ' is-on' : ''}`}>
          {revealed ? (
            <>
              <span className="zp-dot zp-dot-lg" style={{ background: exp.result.hex }} />
              <span className="zp-mix-rname">{exp.result.name}</span>
              <code>{exp.result.hex}</code>
              <em>{exp.result.line}</em>
            </>
          ) : (
            <span className="zp-mix-wait">Mixing…</span>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
