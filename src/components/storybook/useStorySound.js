import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const KEY = "zoobi-story-muted";

/**
 * Synthesised storybook sounds (Web Audio, no audio files needed).
 * Audio only starts after a user gesture; call `unlock()` from a click.
 */
export function useStorySound() {
  const ctxRef = useRef(null);
  const mutedRef = useRef(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY) === "1";
      mutedRef.current = saved;
      setMuted(saved);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const ctx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try {
        ctxRef.current = new AC();
      } catch {
        return null;
      }
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const noise = useCallback(
    (dur, f0, f1, vol, q = 1) => {
      const c = ctx();
      if (!c || mutedRef.current) return;
      const t = c.currentTime;
      const len = Math.floor(c.sampleRate * dur);
      const buf = c.createBuffer(1, len, c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
      const src = c.createBufferSource();
      src.buffer = buf;
      const filter = c.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = q;
      filter.frequency.setValueAtTime(f0, t);
      filter.frequency.exponentialRampToValueAtTime(f1, t + dur);
      const gain = c.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(vol, t + dur * 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(c.destination);
      src.start(t);
    },
    [ctx],
  );

  const tone = useCallback(
    (freq, type, dur, vol) => {
      const c = ctx();
      if (!c || mutedRef.current) return;
      const t = c.currentTime;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    },
    [ctx],
  );

  const click = useCallback(() => {
    noise(0.03, 2600 + Math.random() * 1600, 1400, 0.45, 2.5);
    tone(140 + Math.random() * 40, "square", 0.03, 0.03);
  }, [noise, tone]);
  const ding = useCallback(() => tone(1760, "sine", 0.7, 0.07), [tone]);
  const swish = useCallback(
    (ms) => {
      noise((ms / 1000) * 0.9, 350, 2800, 0.5, 0.6);
      setTimeout(() => tone(110, "sine", 0.12, 0.05), ms * 0.8);
    },
    [noise, tone],
  );
  const thud = useCallback(
    (opening) => {
      noise(0.7, opening ? 240 : 800, opening ? 900 : 240, 0.45, 0.7);
      if (!opening) setTimeout(() => tone(85, "sine", 0.3, 0.18), 950);
    },
    [noise, tone],
  );
  const unlock = useCallback(() => {
    ctx();
  }, [ctx]);

  const toggle = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    try {
      window.localStorage.setItem(KEY, next ? "1" : "0");
    } catch {
      /* storage unavailable */
    }
    if (!next) click();
  }, [click]);

  return useMemo(
    () => ({ muted, toggle, unlock, click, ding, swish, thud }),
    [muted, toggle, unlock, click, ding, swish, thud],
  );
}
