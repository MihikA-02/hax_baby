import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';

/** Pause / resume, skip and replay for a PaintCanvas (pass its ref as `canvasRef`). */
export default function AnimationControls({ canvasRef, state }) {
  const running = state.phase !== 'done';
  return (
    <div className="zp-controls" role="group" aria-label="Animation controls">
      {running && (
        <>
          <button type="button" className="zp-btn" onClick={() => canvasRef.current?.toggle()}>
            {state.paused ? <Play aria-hidden="true" size={16} /> : <Pause aria-hidden="true" size={16} />}
            <span>{state.paused ? 'Resume' : 'Pause'}</span>
          </button>
          <button type="button" className="zp-btn" onClick={() => canvasRef.current?.skip()}>
            <SkipForward aria-hidden="true" size={16} />
            <span>See finished artwork</span>
          </button>
        </>
      )}
      <button type="button" className="zp-btn" onClick={() => canvasRef.current?.replay()}>
        <RotateCcw aria-hidden="true" size={16} />
        <span>Replay Animation</span>
      </button>
    </div>
  );
}
