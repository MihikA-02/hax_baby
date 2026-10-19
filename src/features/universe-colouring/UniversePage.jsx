import { useMemo } from 'react';
import ProjectLayout from '../projects/shared/ProjectLayout';
import WannaTryButton from '../projects/shared/WannaTryButton';
import ZoobiImage from '../projects/shared/ZoobiImage';
import LazyMount from '../projects/shared/LazyMount';
import PaintCanvas from '../projects/paint/PaintCanvas';
import ColouringStudio from '../projects/paint/ColouringStudio';
import CinematicPlayer from './CinematicPlayer';
import { scenes, getScene } from './scenes';

export const UNIVERSE_INTRO = 'The universe is Zoobi\u2019s canvas. Every brushstroke brings a world to life.';

export default function UniversePage({ sceneId, tryMode, onOpenScene, onCloseScene, onTry, onExitTry }) {
  const current = sceneId ? getScene(sceneId) : undefined;
  const next = useMemo(() => {
    if (!current) return undefined;
    const i = scenes.findIndex((s) => s.id === current.id);
    return scenes[(i + 1) % scenes.length];
  }, [current]);
  const compact = Boolean(tryMode || current);

  return (
    <ProjectLayout
      theme="universe"
      compact={compact}
      title="Zoobi Colours the Universe"
      intro={UNIVERSE_INTRO}
      cta={<WannaTryButton onClick={onTry} hint="— colour a world yourself" />}
      hero={<ZoobiImage pose="cloud" eager />}
    >
      {tryMode ? (
        <ColouringStudio artworks={scenes} title="Zoobi Colours the Universe" initialId={sceneId} onExit={onExitTry} />
      ) : current ? (
        <CinematicPlayer key={current.id} scene={current} onSeeAnother={() => onOpenScene(next.id)} onBack={onCloseScene} />
      ) : (
        <>
          <section className="zp-section" aria-labelledby="zp-featured">
            <h2 id="zp-featured" className="zp-h2">
              Now colouring
            </h2>
            <CinematicPlayer scene={scenes[0]} variant="hero" onOpen={onOpenScene} />
          </section>
          <section className="zp-section" aria-labelledby="zp-worlds">
            <h2 id="zp-worlds" className="zp-h2">
              Worlds Zoobi has finished
            </h2>
            <p className="zp-section-lede">Six worlds, each painted in its own order. Open one to watch it come to life.</p>
            <ul className="zp-gallery zp-gallery-worlds">
              {scenes.map((s) => (
                <li key={s.id}>
                  <button type="button" className="zp-art-card" onClick={() => onOpenScene(s.id)}>
                    <LazyMount className="zp-art-thumb">
                      <PaintCanvas artwork={s} mode="colour" />
                    </LazyMount>
                    <span className="zp-art-title">{s.title}</span>
                    <span className="zp-art-desc">{s.blurb}</span>
                    <span className="zp-art-cta">Watch Zoobi colour it</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section className="zp-try-band">
            <p>Wanna colour a world of your own?</p>
            <WannaTryButton onClick={onTry} />
          </section>
        </>
      )}
    </ProjectLayout>
  );
}
