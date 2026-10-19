import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Shuffle } from 'lucide-react';
import PaintCanvas from '../projects/paint/PaintCanvas';
import RasterPaintCanvas from '../projects/paint/RasterPaintCanvas';
import AnimationControls from '../projects/shared/AnimationControls';
import ZoobiImage from '../projects/shared/ZoobiImage';

const MESSAGES = {
  outline: 'Let\u2019s see what happens when Zoobi adds a little colour\u2026',
  painting: 'Zoobi is painting\u2026 watch the colour travel.',
  paused: 'Paused. Zoobi will wait right here.',
  done: 'Ta-da! Every colour has a little story.',
};

/** One drawing, one colouring performance: outline → brush → finished masterpiece. */
export default function ArtworkViewer({ artwork, onBack, onSeeAnother }) {
  const canvasRef = useRef(null);
  const headingRef = useRef(null);
  const [state, setState] = useState({ phase: 'outline', paused: false });

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [artwork.id]);

  const Canvas = artwork.kind === 'raster' ? RasterPaintCanvas : PaintCanvas;
  const message = state.paused && state.phase !== 'done' ? MESSAGES.paused : MESSAGES[state.phase];

  return (
    <section className="zp-viewer" aria-labelledby="zp-viewer-title">
      <div className={`zp-viewer-stage${artwork.kind === 'raster' ? ' is-raster' : ''}`} data-phase={state.phase}>
        <Canvas key={artwork.id} ref={canvasRef} artwork={artwork} onState={setState} />
      </div>
      <aside className="zp-viewer-side">
        <ZoobiImage pose="easel" className="zp-viewer-zoobi" eager />
        <p className="zp-bubble" aria-live="polite">
          {message}
        </p>
        <h2 id="zp-viewer-title" ref={headingRef} tabIndex={-1} className="zp-viewer-title">
          {artwork.title}
        </h2>
        <p className="zp-viewer-blurb">{artwork.blurb}</p>
        <AnimationControls canvasRef={canvasRef} state={state} />
        <div className="zp-viewer-actions">
          <button type="button" className="zp-btn zp-btn-primary" onClick={onSeeAnother}>
            <Shuffle aria-hidden="true" size={16} />
            <span>See Another Drawing</span>
          </button>
          <button type="button" className="zp-btn" onClick={onBack}>
            <ArrowLeft aria-hidden="true" size={16} />
            <span>Back to Gallery</span>
          </button>
        </div>
      </aside>
    </section>
  );
}
