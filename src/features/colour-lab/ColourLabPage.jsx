import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import ProjectLayout from '../projects/shared/ProjectLayout';
import WannaTryButton from '../projects/shared/WannaTryButton';
import ZoobiImage from '../projects/shared/ZoobiImage';
import { prefersReducedMotion } from '../projects/shared/useReducedMotion';
import MixingStage from './MixingStage';
import MixerStudio from './MixerStudio';
import { EXPERIMENTS } from './data';

export const LAB_INTRO = 'Every colour has a story. Zoobi discovers the shades that bring new stories to life.';

export default function ColourLabPage({ tryMode, onTry, onExitTry }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef(null);
  const exp = EXPERIMENTS[index];

  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [tryMode]);

  const go = useCallback((i) => {
    setIndex((i + EXPERIMENTS.length) % EXPERIMENTS.length);
    setRun((r) => r + 1);
  }, []);
  const advance = useCallback(() => setIndex((i) => (i + 1) % EXPERIMENTS.length), []);
  const onComplete = useCallback(() => {
    advance();
    setRun((r) => r + 1);
  }, [advance]);

  const pick = (i) => {
    go(i);
    stageRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
  };

  return (
    <ProjectLayout
      theme="lab"
      compact={tryMode}
      title="Zoobi's Colour Lab"
      intro={LAB_INTRO}
      cta={<WannaTryButton onClick={onTry} hint="— mix your own colours" />}
      hero={<ZoobiImage pose="lab" eager />}
    >
      {tryMode ? (
        <MixerStudio onExit={onExitTry} />
      ) : (
        <>
          <section className="zp-section" aria-labelledby="zp-experiment">
            <h2 id="zp-experiment" className="zp-h2">
              Look what Zoobi discovered
            </h2>
            <p className="zp-section-lede">
              Nine little experiments, mixed by hand. Pigments don&apos;t behave exactly like screen light, so these shades are Zoobi&apos;s own painted approximations.
            </p>
            <div ref={stageRef} className="zp-lab-stage">
              <MixingStage key={`${exp.id}-${run}`} exp={exp} paused={paused || offscreen} onComplete={onComplete} />
              <div className="zp-lab-controls" role="group" aria-label="Experiment controls">
                <button type="button" className="zp-btn" onClick={() => go(index - 1)} aria-label="Previous experiment">
                  <ChevronLeft aria-hidden="true" size={16} />
                  <span>Previous</span>
                </button>
                <button type="button" className="zp-btn" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
                  {paused ? <Play aria-hidden="true" size={16} /> : <Pause aria-hidden="true" size={16} />}
                  <span>{paused ? 'Resume' : 'Pause'}</span>
                </button>
                <button type="button" className="zp-btn" onClick={() => go(index + 1)} aria-label="Next experiment">
                  <span>Next</span>
                  <ChevronRight aria-hidden="true" size={16} />
                </button>
                <p className="zp-lab-count" aria-live="off">
                  Experiment {index + 1} of {EXPERIMENTS.length}
                </p>
              </div>
            </div>
          </section>

          <section className="zp-section" aria-labelledby="zp-shades">
            <h2 id="zp-shades" className="zp-h2">
              Zoobi&apos;s shade collection
            </h2>
            <p className="zp-section-lede">Tap any shade to watch it being made.</p>
            <ul className="zp-shades">
              {EXPERIMENTS.map((e, i) => (
                <li key={e.id}>
                  <button type="button" className="zp-shade" aria-pressed={i === index} onClick={() => pick(i)}>
                    <span className="zp-shade-swatch" style={{ '--c': e.result.hex, '--a': e.a.hex, '--b': e.b.hex }} aria-hidden="true" />
                    <span className="zp-shade-name">{e.result.name}</span>
                    <code className="zp-shade-hex">{e.result.hex}</code>
                    <span className="zp-shade-src">
                      {e.a.name} + {e.b.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="zp-try-band">
            <p>Wanna try creating your own?</p>
            <WannaTryButton onClick={onTry} />
          </section>
        </>
      )}
    </ProjectLayout>
  );
}
