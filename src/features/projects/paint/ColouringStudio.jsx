import { useCallback, useMemo, useReducer, useRef, useState } from 'react';
import { ArrowLeft, Check, Download, Eraser, PaintBucket, Paintbrush, RotateCcw, Undo2 } from 'lucide-react';

/* The visitor's own colouring mode ("Wanna Try?"). Works on the same region-based artwork
 * data as Zoobi's showcase: tap a region to fill it, or drag the brush across regions.
 * Strokes are grouped so Undo removes a whole drag at once. */

const PALETTE = [
  ['Bubblegum', '#ff8fbf'], ['Poppy', '#ff6f7a'], ['Tangerine', '#ff9b54'], ['Sunbeam', '#ffd45e'],
  ['Lime', '#c8e66a'], ['Meadow', '#78c37b'], ['Lagoon', '#35b6ae'], ['Sky', '#7fd0f5'],
  ['Cloud blue', '#4da3ff'], ['Twilight', '#5e6fe0'], ['Lilac', '#b794f4'], ['Plum', '#8e5bd6'],
  ['Sand', '#e9c9a0'], ['Cocoa', '#8a5a36'], ['Pearl', '#fffdf4'], ['Ink', '#3b2a40'],
];

function reducer(state, action) {
  switch (action.type) {
    case 'commit': {
      const { artId, changes } = action;
      if (!changes.length) return state;
      const fills = { ...state.fills, [artId]: { ...(state.fills[artId] || {}) } };
      changes.forEach(({ rid, next }) => {
        if (next == null) delete fills[artId][rid];
        else fills[artId][rid] = next;
      });
      return { fills, history: [...state.history, { artId, changes }] };
    }
    case 'undo': {
      const last = state.history[state.history.length - 1];
      if (!last) return state;
      const fills = { ...state.fills, [last.artId]: { ...(state.fills[last.artId] || {}) } };
      last.changes.forEach(({ rid, prev }) => {
        if (prev == null) delete fills[last.artId][rid];
        else fills[last.artId][rid] = prev;
      });
      return { fills, history: state.history.slice(0, -1) };
    }
    case 'reset': {
      const fills = { ...state.fills };
      delete fills[action.artId];
      return { fills, history: state.history.filter((h) => h.artId !== action.artId) };
    }
    default:
      return state;
  }
}

function Shape({ s, ...rest }) {
  // eslint-disable-next-line no-unused-vars
  const { t, line, ...attrs } = s;
  const Tag = t;
  return <Tag {...attrs} {...rest} />;
}

export default function ColouringStudio({ artworks, title = 'Your colouring page', initialId, onExit }) {
  const [artId, setArtId] = useState(initialId && artworks.some((a) => a.id === initialId) ? initialId : artworks[0].id);
  const [colour, setColour] = useState(PALETTE[0][1]);
  const [tool, setTool] = useState('fill');
  const [state, dispatch] = useReducer(reducer, { fills: {}, history: [] });
  const art = useMemo(() => artworks.find((a) => a.id === artId), [artworks, artId]);
  const fills = state.fills[artId] || {};
  const svgRef = useRef(null);
  const stroke = useRef(null); // { changes: Map, last }
  const canUndo = state.history.length > 0;

  const regionAt = useCallback((x, y, fallback) => {
    const el = document.elementFromPoint(x, y) || fallback;
    return el?.closest?.('[data-rid]')?.getAttribute('data-rid') ?? null;
  }, []);

  const paint = useCallback(
    (rid) => {
      if (!rid || !stroke.current || stroke.current.last === rid) return;
      stroke.current.last = rid;
      const next = tool === 'erase' ? null : colour;
      const current = stroke.current.changes.has(rid) ? stroke.current.changes.get(rid).next : fills[rid];
      if ((current ?? null) === next) return;
      const prev = stroke.current.changes.has(rid) ? stroke.current.changes.get(rid).prev : (fills[rid] ?? null);
      stroke.current.changes.set(rid, { rid, prev, next });
      // Optimistic live preview straight on the DOM keeps dragging smooth.
      const g = svgRef.current?.querySelector(`[data-rid="${rid}"]`);
      g?.querySelectorAll('.zp-try-fill').forEach((n) => n.setAttribute('fill', next ?? art.paper));
    },
    [tool, colour, fills, art.paper],
  );

  const onDown = (e) => {
    if (e.button != null && e.button !== 0) return;
    stroke.current = { changes: new Map(), last: null };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    paint(regionAt(e.clientX, e.clientY, e.target));
  };
  const onMove = (e) => {
    if (!stroke.current || tool === 'fill') return;
    paint(regionAt(e.clientX, e.clientY, e.target));
  };
  const onUp = () => {
    if (!stroke.current) return;
    dispatch({ type: 'commit', artId, changes: [...stroke.current.changes.values()] });
    stroke.current = null;
  };

  const download = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', '1600');
    clone.setAttribute('height', '1200');
    const xml = new XMLSerializer().serializeToString(clone);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = art.paper;
      ctx.fillRect(0, 0, 1600, 1200);
      ctx.drawImage(img, 0, 0, 1600, 1200);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${art.id}-coloured-by-me.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }, 'image/png');
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
  };

  return (
    <section className="zp-studio" aria-label={`${title} — colouring mode`}>
      <div className="zp-studio-bar">
        <button type="button" className="zp-btn" onClick={onExit}>
          <ArrowLeft aria-hidden="true" size={16} />
          <span>Back to Zoobi&apos;s showcase</span>
        </button>
        <p className="zp-studio-hint">Tap a space to fill it. Switch to the brush and drag across several.</p>
      </div>

      <div className="zp-studio-picker" role="group" aria-label="Choose a drawing">
        {artworks.map((a) => (
          <button key={a.id} type="button" className="zp-chip" aria-pressed={a.id === artId} onClick={() => setArtId(a.id)}>
            {a.title}
          </button>
        ))}
      </div>

      <div className="zp-studio-body">
        <div className="zp-studio-canvas">
          <svg
            ref={svgRef}
            viewBox={art.viewBox}
            role="img"
            aria-label={`${art.title}: colouring canvas. ${art.alt}`}
            className="zp-try-svg"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            preserveAspectRatio="xMidYMid slice"
          >
            <rect width="800" height="600" fill={art.paper} />
            {art.regions.map((r) => (
              <g key={r.id} data-rid={r.fill === 'none' ? undefined : r.id}>
                {r.shapes.map((s, i) =>
                  s.line ? (
                    <Shape key={i} s={s} fill="none" stroke={art.ink} strokeWidth="3" strokeLinecap="round" pointerEvents="none" />
                  ) : (
                    <g key={i}>
                      <Shape s={s} className="zp-try-fill" fill={fills[r.id] || (r.overlay ? 'none' : art.paper)} />
                      {!r.overlay && <Shape s={s} fill="none" stroke={art.ink} strokeWidth="3" strokeLinejoin="round" pointerEvents="none" />}
                    </g>
                  ),
                )}
              </g>
            ))}
          </svg>
        </div>

        <div className="zp-studio-tools">
          <div className="zp-toolrow" role="group" aria-label="Tools">
            <button type="button" className="zp-tool" aria-pressed={tool === 'fill'} onClick={() => setTool('fill')}>
              <PaintBucket aria-hidden="true" size={18} />
              <span>Fill</span>
            </button>
            <button type="button" className="zp-tool" aria-pressed={tool === 'brush'} onClick={() => setTool('brush')}>
              <Paintbrush aria-hidden="true" size={18} />
              <span>Brush</span>
            </button>
            <button type="button" className="zp-tool" aria-pressed={tool === 'erase'} onClick={() => setTool('erase')}>
              <Eraser aria-hidden="true" size={18} />
              <span>Erase</span>
            </button>
          </div>

          <div className="zp-palette" role="group" aria-label="Colours">
            {PALETTE.map(([name, hex]) => (
              <button
                key={hex}
                type="button"
                className="zp-swatch-btn"
                style={{ '--c': hex }}
                aria-label={`${name} ${hex}`}
                title={`${name} ${hex}`}
                aria-pressed={colour === hex && tool !== 'erase'}
                onClick={() => {
                  setColour(hex);
                  if (tool === 'erase') setTool('fill');
                }}
              >
                {colour === hex && tool !== 'erase' ? <Check aria-hidden="true" size={16} /> : null}
              </button>
            ))}
            <label className="zp-custom">
              <span className="zp-sr">Pick a custom colour</span>
              <input type="color" value={colour} onChange={(e) => { setColour(e.target.value); if (tool === 'erase') setTool('fill'); }} />
            </label>
          </div>

          <div className="zp-toolrow">
            <button type="button" className="zp-btn" onClick={() => dispatch({ type: 'undo' })} disabled={!canUndo}>
              <Undo2 aria-hidden="true" size={16} />
              <span>Undo</span>
            </button>
            <button type="button" className="zp-btn" onClick={() => dispatch({ type: 'reset', artId })} disabled={!Object.keys(fills).length}>
              <RotateCcw aria-hidden="true" size={16} />
              <span>Reset</span>
            </button>
            <button type="button" className="zp-btn zp-btn-primary" onClick={download}>
              <Download aria-hidden="true" size={16} />
              <span>Save PNG</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
