import { useMemo, useState } from 'react';
import { ArrowLeft, Check, Copy, Save, Trash2 } from 'lucide-react';
import MixingStage from './MixingStage';
import { BASE_COLOURS } from './data';
import { mixColours, nameFor, normaliseHex } from './mixing';
import { readJSON, writeJSON } from '../projects/shared/storage';

const KEY = 'zoobi:saved-mixes';

function Picker({ legend, value, onChange }) {
  return (
    <fieldset className="zp-picker">
      <legend>{legend}</legend>
      <div className="zp-picker-grid">
        {BASE_COLOURS.map((c) => (
          <button key={c.id} type="button" className="zp-swatch-btn" style={{ '--c': c.hex }} aria-pressed={normaliseHex(value) === normaliseHex(c.hex)} aria-label={`${c.name} ${c.hex}`} title={`${c.name} ${c.hex}`} onClick={() => onChange(c.hex)}>
            {normaliseHex(value) === normaliseHex(c.hex) ? <Check aria-hidden="true" size={16} /> : null}
          </button>
        ))}
        <label className="zp-custom">
          <span className="zp-sr">Custom colour for {legend}</span>
          <input type="color" value={normaliseHex(value) || '#FFFFFF'} onChange={(e) => onChange(e.target.value.toUpperCase())} />
        </label>
      </div>
      <p className="zp-picker-now">
        <span className="zp-dot" style={{ background: value }} />
        {BASE_COLOURS.find((c) => normaliseHex(c.hex) === normaliseHex(value))?.name || nameFor(value)} <code>{normaliseHex(value)}</code>
      </p>
    </fieldset>
  );
}

/** Visitor mixer: choose two colours, set the balance, watch them mix, keep what you discover. */
export default function MixerStudio({ onExit }) {
  const [a, setA] = useState(BASE_COLOURS[0].hex);
  const [b, setB] = useState(BASE_COLOURS[1].hex);
  const [share, setShare] = useState(50);
  const [run, setRun] = useState(0);
  const [saved, setSaved] = useState(() => readJSON(KEY, []));
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => mixColours(a, b, share / 100), [a, b, share]);
  const exp = useMemo(
    () => ({
      a: { name: BASE_COLOURS.find((c) => normaliseHex(c.hex) === normaliseHex(a))?.name || nameFor(a), hex: normaliseHex(a) },
      b: { name: BASE_COLOURS.find((c) => normaliseHex(c.hex) === normaliseHex(b))?.name || nameFor(b), hex: normaliseHex(b) },
      result: { name: result.name, hex: result.hex, line: result.recipe ? `${result.line} (One of Zoobi\u2019s own recipes.)` : result.line },
    }),
    [a, b, result],
  );
  const isSaved = saved.some((s) => s.hex === result.hex && s.a === exp.a.hex && s.b === exp.b.hex && s.share === share);

  const save = () => {
    if (isSaved) return;
    const next = [{ id: `${Date.now()}`, name: result.name, hex: result.hex, a: exp.a.hex, b: exp.b.hex, share }, ...saved].slice(0, 24);
    setSaved(next);
    writeJSON(KEY, next);
  };
  const remove = (id) => {
    const next = saved.filter((s) => s.id !== id);
    setSaved(next);
    writeJSON(KEY, next);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section className="zp-studio zp-mixer" aria-label="Colour mixer">
      <div className="zp-studio-bar">
        <button type="button" className="zp-btn" onClick={onExit}>
          <ArrowLeft aria-hidden="true" size={16} />
          <span>Back to Zoobi&apos;s showcase</span>
        </button>
        <p className="zp-studio-hint">Pick two colours, set the balance, then press Mix. The same colours always make the same shade.</p>
      </div>

      <div className="zp-mixer-grid">
        <div className="zp-mixer-controls">
          <Picker legend="First colour" value={a} onChange={(v) => { setA(v); setRun((r) => r + 1); }} />
          <Picker legend="Second colour" value={b} onChange={(v) => { setB(v); setRun((r) => r + 1); }} />
          <label className="zp-range">
            <span>
              Balance: {100 - share}% first · {share}% second
            </span>
            <input type="range" min="0" max="100" step="5" value={share} onChange={(e) => setShare(Number(e.target.value))} aria-label="Balance between the first and second colour" />
          </label>
          <div className="zp-toolrow">
            <button type="button" className="zp-btn zp-btn-primary" onClick={() => setRun((r) => r + 1)}>
              Mix!
            </button>
          </div>
        </div>

        <div className="zp-mixer-out">
          <MixingStage key={`${a}-${b}-${share}-${run}`} exp={exp} hold={0} label={`${exp.a.name} and ${exp.b.name} mixing into ${exp.result.name}`} />
          <div className="zp-toolrow">
            <button type="button" className="zp-btn" onClick={save} disabled={isSaved}>
              <Save aria-hidden="true" size={16} />
              <span>{isSaved ? 'Saved to my palette' : 'Save to my palette'}</span>
            </button>
            <button type="button" className="zp-btn" onClick={copy}>
              {copied ? <Check aria-hidden="true" size={16} /> : <Copy aria-hidden="true" size={16} />}
              <span>{copied ? 'Copied' : `Copy ${result.hex}`}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="zp-saved">
        <h3 className="zp-h3">My palette</h3>
        {saved.length === 0 ? (
          <p className="zp-muted">Nothing saved yet. Shades you keep stay in this browser.</p>
        ) : (
          <ul className="zp-saved-list">
            {saved.map((s) => (
              <li key={s.id} className="zp-saved-item">
                <span className="zp-dot zp-dot-lg" style={{ background: s.hex }} />
                <span className="zp-saved-name">{s.name}</span>
                <code>{s.hex}</code>
                <button type="button" className="zp-icon-btn" onClick={() => remove(s.id)} aria-label={`Remove ${s.name} ${s.hex}`}>
                  <Trash2 aria-hidden="true" size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
