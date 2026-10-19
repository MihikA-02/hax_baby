import { useEffect, useRef, useState } from 'react';
import PaintCanvas from './paint/PaintCanvas';
import ZoobiImage from './shared/ZoobiImage';
import { artworks } from '../colouring-book/artworks';
import { scenes } from '../universe-colouring/scenes';

/** Reveals once, the first time the card scrolls into view. */
function useInView() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

function Reveal({ artwork, pose }) {
  const [ref, seen] = useInView();
  return (
    <div ref={ref} className={`zp-prev zp-prev-reveal${seen ? ' is-in' : ''}`}>
      <div className="zp-prev-art">
        <PaintCanvas artwork={artwork} mode="outline" label="" />
        <div className="zp-prev-colour" aria-hidden="true">
          <PaintCanvas artwork={artwork} mode="colour" label="" />
        </div>
        <span className="zp-prev-brushline" aria-hidden="true" />
      </div>
      <ZoobiImage pose={pose} className="zp-prev-zoobi" />
    </div>
  );
}

export const BookPreview = () => <Reveal artwork={artworks[0]} pose="easel" />;
export const UniversePreview = () => <Reveal artwork={scenes[0]} pose="cloud" />;

export function LabPreview() {
  const [ref, seen] = useInView();
  return (
    <div ref={ref} className={`zp-prev zp-prev-lab${seen ? ' is-in' : ''}`}>
      <div className="zp-prev-art zp-prev-labart">
        <svg viewBox="0 0 320 200" role="presentation" aria-hidden="true">
          <defs>
            <filter id="zp-goo-mini" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
              <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
            </filter>
          </defs>
          <g filter="url(#zp-goo-mini)">
            <circle className="zp-pl-a" cx="95" cy="100" r="40" fill="#FF86C1" />
            <circle className="zp-pl-b" cx="225" cy="100" r="40" fill="#4DA3FF" />
            <circle className="zp-pl-m" cx="160" cy="100" r="52" fill="#9670C7" />
          </g>
        </svg>
        <span className="zp-prev-hex">#9670C7 · Dreamberry</span>
      </div>
      <ZoobiImage pose="lab" className="zp-prev-zoobi" />
    </div>
  );
}
