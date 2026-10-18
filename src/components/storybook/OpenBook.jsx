import { useCallback, useEffect, useRef, useState } from "react";
import { STORY } from "./storyData";
import { ArtPage, TextPage } from "./StoryPage";

const TURN_MS = 750;
const LAST = STORY.length - 1;

/**
 * The open two-page book. Desktop turns a real 3D leaf (front = illustration,
 * back = next text page). Mobile / reduced motion use a quick single-page flip.
 */
export function OpenBook({ sound, reduced, narrow, onClose }) {
  const [page, setPage] = useState(0);
  const [turn, setTurn] = useState(null); // { dir, to } while a leaf is turning
  const [go, setGo] = useState(false); // leaf has started moving
  const [flip, setFlip] = useState(null); // { dir, phase } for the simple flip
  const timers = useRef([]);
  const busy = Boolean(turn || flip);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const goTo = useCallback(
    (to, dir, forceFlip = false) => {
      if (busy || to < 0 || to > LAST) return;
      sound.swish(reduced ? 300 : TURN_MS);
      if (!narrow && !reduced && !forceFlip) {
        setGo(false);
        setTurn({ dir, to });
        return;
      }
      const h = reduced ? 0 : 300;
      setFlip({ dir, phase: "out" });
      later(() => {
        setPage(to);
        setFlip({ dir, phase: "pre" });
        later(() => {
          setFlip({ dir, phase: "in" });
          later(() => setFlip(null), h + 30);
        }, 30);
      }, h + 30);
    },
    [busy, narrow, reduced, sound],
  );

  // Leaf: paint the start position, then animate; commit the new page when done.
  useEffect(() => {
    if (!turn) return undefined;
    let r1;
    let r2;
    const raf = typeof requestAnimationFrame === "function";
    if (raf) {
      r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setGo(true));
      });
    } else {
      setGo(true);
    }
    const done = setTimeout(() => {
      setPage(turn.to);
      setTurn(null);
      setGo(false);
    }, TURN_MS + 60);
    return () => {
      if (raf) {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      }
      clearTimeout(done);
    };
  }, [turn]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" && page < LAST) goTo(page + 1, 1);
      else if (e.key === "ArrowLeft") goTo(page - 1, -1);
      else if (e.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [page, busy, goTo, onClose]);

  const forward = turn?.dir > 0;
  const leftIndex = turn && !forward ? turn.to : page;
  const leftMode = !turn ? "type" : forward ? "full" : "blank";
  const rightIndex = turn ? (forward ? turn.to : page) : page;

  let spreadStyle;
  if (flip) {
    const { dir, phase } = flip;
    const h = reduced ? 0 : 300;
    spreadStyle = {
      transformOrigin: narrow ? "left center" : "center",
      transform: `rotateY(${phase === "out" ? -dir * 80 : phase === "pre" ? dir * 80 : 0}deg)`,
      opacity: phase === "in" ? 1 : 0.2,
      transition: phase === "pre" ? "none" : `transform ${h}ms ease, opacity ${h}ms`,
    };
  }
  const leafStyle = turn && {
    "--d": `${TURN_MS}ms`,
    transform: `rotateY(${(forward ? go : !go) ? -180 : 0}deg)`,
    transition: go ? `transform ${TURN_MS}ms cubic-bezier(.45,.05,.3,1)` : "none",
  };

  return (
    <section className="sb-open" aria-label="Zoobi’s Origin Story">
      <div className="sb-book sb-appear">
        <div className="sb-spread" style={spreadStyle}>
          <TextPage
            key={`L-${leftIndex}`}
            index={leftIndex}
            mode={leftMode}
            reduced={reduced}
            onChar={sound.click}
            onDone={sound.ding}
          />
          <ArtPage key={`R-${rightIndex}`} index={rightIndex} />
          <div className="sb-spine" aria-hidden="true" />
          {turn && (
            <div className={`sb-leaf ${go ? "go" : ""}`} style={leafStyle} aria-hidden="true">
              <ArtPage index={forward ? page : turn.to} />
              <TextPage
                index={forward ? turn.to : page}
                mode={forward ? "blank" : "full"}
                className="sb-back"
              />
            </div>
          )}
        </div>
      </div>

      <p className="sb-sr" aria-live="polite">
        Page {page + 1} of {STORY.length}: {STORY[page].title}
      </p>

      <div className="sb-ctl">
        <button type="button" onClick={() => goTo(page - 1, -1)} disabled={busy || page === 0}>
          ← Previous
        </button>
        <span className="sb-cnt">
          Page {page + 1} of {STORY.length}
        </span>
        <button
          type="button"
          disabled={busy}
          onClick={() => (page === LAST ? goTo(0, -1, true) : goTo(page + 1, 1))}
        >
          {page === LAST ? "↻ Read Again" : "Next →"}
        </button>
        <button type="button" onClick={onClose} disabled={busy}>
          ✦ Close Book
        </button>
        <button
          type="button"
          onClick={sound.toggle}
          aria-pressed={sound.muted}
          aria-label="Mute sound"
        >
          {sound.muted ? "🔇 Sound off" : "🔊 Sound on"}
        </button>
      </div>
    </section>
  );
}
