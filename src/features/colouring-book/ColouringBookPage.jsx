import { useMemo } from 'react';
import ProjectLayout from '../projects/shared/ProjectLayout';
import WannaTryButton from '../projects/shared/WannaTryButton';
import ZoobiImage from '../projects/shared/ZoobiImage';
import LazyMount from '../projects/shared/LazyMount';
import PaintCanvas from '../projects/paint/PaintCanvas';
import RasterPaintCanvas from '../projects/paint/RasterPaintCanvas';
import ColouringStudio from '../projects/paint/ColouringStudio';
import ArtworkViewer from './ArtworkViewer';
import { artworks } from './artworks';
import { drawings } from './drawings';

// Zoobi's five new hand-drawn pages come first, then the original sketchbook.
const everything = [...drawings, ...artworks];
const getAny = (id) => everything.find((a) => a.id === id);

export const BOOK_INTRO =
  'Welcome to my little art shelf! Every drawing begins with a little imagination, and every colour brings it closer to life.';

/**
 * Router-agnostic page. The route file owns navigation:
 *   artId   → which drawing is open (undefined = gallery)
 *   tryMode → the visitor's own colouring mode
 */
export default function ColouringBookPage({ artId, tryMode, onOpenArt, onCloseArt, onTry, onExitTry }) {
  const current = artId ? getAny(artId) : undefined;
  const next = useMemo(() => {
    if (!current) return undefined;
    const i = everything.findIndex((a) => a.id === current.id);
    return everything[(i + 1) % everything.length];
  }, [current]);
  const compact = Boolean(tryMode || current);

  return (
    <ProjectLayout
      theme="book"
      compact={compact}
      title="Zoobi's Colouring Book"
      intro={BOOK_INTRO}
      cta={!compact ? <WannaTryButton onClick={onTry} hint="— colour your own drawing" /> : null}
      hero={
        <div className="zp-hero-art">
          <figure className="zp-framed">
            <PaintCanvas artwork={artworks[0]} mode="colour" label="Butterfly Dreams, finished by Zoobi" />
          </figure>
          <ZoobiImage pose="easel" eager />
        </div>
      }
    >
      {tryMode ? (
        <ColouringStudio artworks={artworks} title="Zoobi's Colouring Book" initialId={artId} onExit={onExitTry} />
      ) : current ? (
        <ArtworkViewer artwork={current} onBack={onCloseArt} onSeeAnother={() => onOpenArt(next.id)} />
      ) : (
        <>
          <section className="zp-section" aria-labelledby="zp-shelf">
            <h2 id="zp-shelf" className="zp-h2">
              Zoobi&apos;s art shelf
            </h2>
            <p className="zp-section-lede">Five fresh drawings, each one coloured stroke by stroke. Open one to watch the colour arrive.</p>
            <ul className="zp-gallery zp-gallery-portrait">
              {drawings.map((a) => (
                <li key={a.id}>
                  <button type="button" className="zp-art-card" onClick={() => onOpenArt(a.id)}>
                    <LazyMount className="zp-art-thumb is-portrait">
                      <RasterPaintCanvas artwork={a} mode="outline" fill />
                    </LazyMount>
                    <span className="zp-art-title">{a.title}</span>
                    <span className="zp-art-desc">{a.blurb}</span>
                    <span className="zp-art-cta">Click to see how creatively Zoobi drew it</span>
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
