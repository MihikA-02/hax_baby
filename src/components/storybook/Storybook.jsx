import { useEffect, useRef, useState } from "react";
import "./storybook.css";
import { OpenBook } from "./OpenBook";
import { StoryCover } from "./StoryCover";
import { useMedia } from "./useMedia";
import { useStorySound } from "./useStorySound";

const OPEN_MS = 1000;
const CLOSE_MS = 1150;

/** Interactive storybook: closed cover -> open book -> back to the cover. */
export default function Storybook() {
  const sound = useStorySound();
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const narrow = useMedia("(max-width: 719px)");
  const [view, setView] = useState("closed"); // closed | opening | open | closing
  const [coverOpen, setCoverOpen] = useState(false);
  const [instant, setInstant] = useState(false);
  const coverBtn = useRef(null);
  const refocus = useRef(false);

  const openBook = () => {
    if (view !== "closed") return;
    sound.unlock();
    sound.thud(true);
    setView("opening");
    setCoverOpen(true);
  };
  const closeBook = () => {
    sound.thud(false);
    refocus.current = true;
    setInstant(true); // start from the open pose, then swing shut
    setCoverOpen(true);
    setView("closing");
  };

  useEffect(() => {
    if (view !== "opening") return undefined;
    const t = setTimeout(() => setView("open"), reduced ? 0 : OPEN_MS);
    return () => clearTimeout(t);
  }, [view, reduced]);

  useEffect(() => {
    if (view !== "closing") return undefined;
    let r2;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => {
        setInstant(false);
        setCoverOpen(false);
      });
    });
    const t = setTimeout(() => setView("closed"), reduced ? 0 : CLOSE_MS);
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
      clearTimeout(t);
    };
  }, [view, reduced]);

  useEffect(() => {
    if (view === "closed" && refocus.current) {
      refocus.current = false;
      coverBtn.current?.focus({ preventScroll: true });
    }
  }, [view]);

  return (
    <div className="sb">
      {view === "open" ? (
        <OpenBook sound={sound} reduced={reduced} narrow={narrow} onClose={closeBook} />
      ) : (
        <StoryCover
          open={coverOpen}
          instant={instant}
          onOpen={openBook}
          buttonRef={coverBtn}
          disabled={view !== "closed"}
        />
      )}
    </div>
  );
}
