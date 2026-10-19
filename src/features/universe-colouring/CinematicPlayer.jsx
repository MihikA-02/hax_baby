import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Shuffle } from 'lucide-react';
import PaintCanvas from '../projects/paint/PaintCanvas';
import AnimationControls from '../projects/shared/AnimationControls';
import ZoobiImage from '../projects/shared/ZoobiImage';
import { readJSON, writeJSON } from '../projects/shared/storage';

const SEEN = 'zoobi:seen-scenes';
const wasSeen = (id) => readJSON(SEEN, [], 'session').includes(id);
const markSeen = (id) => {
  const s = readJSON(SEEN, [], 'session');
  if (!s.includes(id)) writeJSON(SEEN, [...s, id], 'session');
};

/** A cinematic colouring performance for one world. Remembers (per session) which worlds you've already watched. */
export default function CinematicPlayer({ scene, variant = 'full', onSeeAnother, onBack, onOpen }) {
  const hero = variant === 'hero';
  const canvasRef = useRef(null);
  const [run, setRun] = useState(0);
  const [state, setState] = useState({ phase: 'outline', paused: false });
  const [mid, setMid] = useState(false);
  const stageRef = useRef(null);
  const instant = useMemo(() => wasSeen(scene.id), [scene.id]);
  const total = useMemo(() => Math.max(...scene.regions.map((r) => r.at + r.dur)), [scene]);

  useEffect(() => {
    setMid(false);
  }, [scene.id, run]);
  // The featured (hero) performance waits until it is actually on screen.
  useEffect(() => {
    if (variant !== 'hero') return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      canvasRef.current?.play();
      return undefined;
    }
    const el = stageRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          canvasRef.current?.play();
          io.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [variant, run, scene.id]);
  useEffect(() => {
    if (state.phase === 'done') markSeen(scene.id);
  }, [state.phase, scene.id]);
  useEffect(() => {
    if (state.phase !== 'painting' || state.paused) return undefined;
    const id = setTimeout(() => setMid(true), total * 0.5);
    return () => clearTimeout(id);
  }, [state.phase, state.paused, total]);

  const [c0, c1, c2, c3] = scene.captions;
  const caption = state.phase === 'outline' ? c0 : state.phase === 'painting' ? (mid ? c2 : c1) : c3;

  const replay = () => {
    setRun((r) => r + 1);
  };

  return (
    <section className={`zp-cine zp-cine-${variant}`} aria-label={`${scene.title}: cinematic colouring`}>
      <div ref={stageRef} className="zp-cine-stage" data-phase={state.phase}>
        <div className="zp-cine-frame" key={run}>
          <PaintCanvas ref={canvasRef} key={`${scene.id}-${run}`} artwork={scene} autoplay={!hero} instant={instant && run === 0} onState={setState} />
        </div>
        <div className="zp-cine-bar zp-cine-bar-top" aria-hidden="true" />
        <div className="zp-cine-bar zp-cine-bar-bottom" aria-hidden="true" />
        <p className="zp-cine-caption" aria-live="polite">
          {caption}
        </p>
        <ZoobiImage pose="cloud" className="zp-cine-zoobi" />
      </div>
      <div className="zp-cine-meta">
        <h2 className="zp-viewer-title">{scene.title}</h2>
        <p className="zp-viewer-blurb">{scene.blurb}</p>
        <div className="zp-cine-actions">
          <div className="zp-controls" role="group" aria-label="Animation controls">
            <AnimationControlsProxy canvasRef={canvasRef} state={state} onReplay={replay} />
          </div>
          {hero ? (
            <button type="button" className="zp-btn zp-btn-primary" onClick={() => onOpen?.(scene.id)}>
              <span>Watch it full screen</span>
            </button>
          ) : (
            <>
              <button type="button" className="zp-btn zp-btn-primary" onClick={onSeeAnother}>
                <Shuffle aria-hidden="true" size={16} />
                <span>See Another World</span>
              </button>
              <button type="button" className="zp-btn" onClick={onBack}>
                <ArrowLeft aria-hidden="true" size={16} />
                <span>Back to the Universe Gallery</span>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/** Same controls as the colouring book, but Replay remounts the scene so the camera move restarts too. */
function AnimationControlsProxy({ canvasRef, state, onReplay }) {
  const wrapped = useMemo(
    () => ({
      get current() {
        const c = canvasRef.current;
        return c ? { ...c, toggle: () => c.toggle(), skip: () => c.skip(), replay: onReplay } : null;
      },
    }),
    [canvasRef, onReplay],
  );
  return <AnimationControls canvasRef={wrapped} state={state} />;
}
