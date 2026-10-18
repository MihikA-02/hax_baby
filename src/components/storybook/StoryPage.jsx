import { STORY } from "./storyData";
import { useTypewriter } from "./useTypewriter";

/**
 * Left page: heading + story text printed on the paper.
 * mode: "type" (typewriter), "full" (all text) or "blank" (text reserved but hidden).
 */
export function TextPage({ index, mode, reduced, onChar, onDone, className = "" }) {
  const s = STORY[index];
  const { count, done } = useTypewriter(s.text, mode === "type", {
    reduced,
    onChar,
    onDone,
  });
  const showAll = mode === "full" || (mode === "type" && done);
  return (
    <div className={`sb-pg sb-L ${showAll ? "is-done" : ""} ${className}`}>
      <i className="sb-c tl" aria-hidden="true">❀</i>
      <span className="sb-num" aria-hidden="true">✦ {index + 1}</span>
      <h3>{s.title}</h3>
      <div className="sb-div" aria-hidden="true">✦ ✧ ✦</div>
      <p>
        {mode === "full" && s.text}
        {mode === "blank" && <span className="sb-hid">{s.text}</span>}
        {mode === "type" && (
          <>
            <span className={done ? "" : "sb-tyc"}>{s.text.slice(0, count)}</span>
            <span className="sb-hid">{s.text.slice(count)}</span>
          </>
        )}
      </p>
      {s.final && <div className="sb-fin">{s.final}</div>}
      <i className="sb-c br" aria-hidden="true">✿</i>
    </div>
  );
}

const SPARKS = [
  [8, 6], [45, 59], [82, 12], [20, 65], [66, 35], [90, 70], [35, 22], [55, 82], [75, 50],
];
const DOTS = ["#f9a8d4", "#93c5fd", "#fde68a", "#c4b5fd"];

/** Right page: framed illustration with this page's subtle magic effect. */
export function ArtPage({ index, className = "" }) {
  const s = STORY[index];
  const sparkCount = s.fx === "stars" ? 9 : 4;
  return (
    <div className={`sb-pg sb-R ${className}`}>
      <i className="sb-c tl" aria-hidden="true">✿</i>
      <span className="sb-num" aria-hidden="true">{index + 1} ✦</span>
      <figure className={`sb-fr ${s.fx === "bloom" ? "sb-bloom" : ""}`}>
        <img
          src={s.image}
          alt={s.alt}
          draggable="false"
          style={{ objectPosition: s.position }}
        />
        {(s.fx === "glow" || s.fx === "halo") && (
          <span className={`sb-glow ${s.fx}`} aria-hidden="true" />
        )}
        {SPARKS.slice(0, sparkCount).map(([x, y], j) => (
          <span
            key={j}
            className="sb-sp"
            aria-hidden="true"
            style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${j * 0.5}s` }}
          >
            {j % 2 ? "✧" : "✦"}
          </span>
        ))}
        {s.fx === "particles" &&
          DOTS.concat(DOTS).slice(0, 7).map((c, j) => (
            <span
              key={j}
              className="sb-part"
              aria-hidden="true"
              style={{ left: `${30 + j * 9}%`, background: c, animationDelay: `${j * 0.7}s` }}
            />
          ))}
      </figure>
      <p className="sb-cap" aria-hidden="true">✦ {s.caption} ✦</p>
      <i className="sb-c br" aria-hidden="true">❀</i>
    </div>
  );
}
