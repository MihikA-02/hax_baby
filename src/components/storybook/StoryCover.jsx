import zoobi from "@/assets/zoobi.png";

const STARS = [
  { top: "5%", right: "9%", ch: "✦", delay: "0s" },
  { top: "38%", left: "9%", ch: "✧", delay: ".8s" },
  { top: "46%", right: "7%", ch: "✦", delay: "1.5s" },
  { bottom: "10%", left: "10%", ch: "❀", delay: "2s" },
];

/** Closed 3D book. The cover swings open around the spine when `open` is true. */
export function StoryCover({ open, instant, onOpen, buttonRef, disabled }) {
  return (
    <div className="sb-closed">
      <button
        ref={buttonRef}
        type="button"
        className="sb-bk"
        onClick={onOpen}
        disabled={disabled}
        aria-label="Open Zoobi’s Origin Story"
      >
        <span className="sb-blk" />
        <span className={`sb-cover ${open ? "is-open" : ""} ${instant ? "instant" : ""}`}>
          <span className="sb-cf">
            <span className="sb-title">
              Zoobi’s<small>ORIGIN STORY</small>
            </span>
            <img src={zoobi} alt="Zoobi holding a rainbow paintbrush" draggable="false" />
            <span className="sb-sub">Every colour has a beginning.</span>
            {STARS.map(({ ch, delay, ...pos }, i) => (
              <i key={i} className="sb-star" aria-hidden="true" style={{ ...pos, animationDelay: delay }}>
                {ch}
              </i>
            ))}
          </span>
          <span className="sb-ci" />
        </span>
      </button>
      <p className="sb-hint">Open the book to begin your adventure.</p>
    </div>
  );
}
