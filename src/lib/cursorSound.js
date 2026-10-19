/**
 * Cursor Click Sound Engine
 * Synthesizes crisp, responsive tactile cursor click sounds using Web Audio API.
 * Zero external audio assets needed. Zero network latency.
 */

export const SOUND_TYPES = {
  TACTILE: "tactile", // Crisp tactile mouse/switch click
  POP: "pop",         // Playful bubbly pop
  TICK: "tick",       // Minimalist acoustic wood tick
  MAGIC: "magic",     // Subtle celestial sparkle click
};

const STORAGE_MUTED_KEY = "zoobi_cursor_sound_muted";
const STORAGE_TYPE_KEY = "zoobi_cursor_sound_type";
const STORAGE_VOLUME_KEY = "zoobi_cursor_sound_volume";

class CursorSoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.soundType = SOUND_TYPES.TACTILE;
    this.volume = 0.7; // 0 to 1 scale
    this.lastClickTime = 0;
    this.listeners = new Set();
    this.initialized = false;
  }

  init() {
    if (this.initialized || typeof window === "undefined") return;
    this.initialized = true;

    // Load persisted preferences
    try {
      const savedMuted = window.localStorage.getItem(STORAGE_MUTED_KEY);
      if (savedMuted !== null) {
        this.muted = savedMuted === "1";
      }

      const savedType = window.localStorage.getItem(STORAGE_TYPE_KEY);
      if (savedType && Object.values(SOUND_TYPES).includes(savedType)) {
        this.soundType = savedType;
      }

      const savedVol = window.localStorage.getItem(STORAGE_VOLUME_KEY);
      if (savedVol !== null) {
        const parsed = parseFloat(savedVol);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.volume = parsed;
        }
      }
    } catch {
      // localStorage unavailable or restricted
    }
  }

  getAudioContext() {
    if (typeof window === "undefined") return null;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!this.ctx) {
      try {
        this.ctx = new AudioContextClass();
      } catch {
        return null;
      }
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    try {
      window.localStorage.setItem(STORAGE_MUTED_KEY, this.muted ? "1" : "0");
    } catch {}
    this.notify();
  }

  toggleMute() {
    this.setMuted(!this.muted);
    if (!this.muted) {
      this.play({ force: true, isInteractive: true });
    }
    return this.muted;
  }

  setSoundType(type) {
    if (!Object.values(SOUND_TYPES).includes(type)) return;
    this.soundType = type;
    try {
      window.localStorage.setItem(STORAGE_TYPE_KEY, type);
    } catch {}
    this.notify();
    this.play({ force: true, isInteractive: true });
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      window.localStorage.setItem(STORAGE_VOLUME_KEY, this.volume.toString());
    } catch {}
    this.notify();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    const state = this.getState();
    for (const listener of this.listeners) {
      try {
        listener(state);
      } catch {}
    }
  }

  getState() {
    return {
      muted: this.muted,
      soundType: this.soundType,
      volume: this.volume,
    };
  }

  /**
   * Synthesize click sound
   * @param {Object} options
   * @param {boolean} [options.isInteractive=false] Whether the clicked element is an interactive control
   * @param {boolean} [options.force=false] Play even if muted (e.g. preview when selecting sound)
   */
  play(options = {}) {
    const { isInteractive = false, force = false } = options;
    if (this.muted && !force) return;

    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    // Throttle clicks within 35ms to avoid clipping
    if (!force && now - this.lastClickTime < 35) return;
    this.lastClickTime = now;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    const baseVol = this.volume;
    if (baseVol <= 0) return;

    // Organic micro-pitch jitter (±3.5%) so rapid clicks sound natural
    const pitchJitter = 0.965 + Math.random() * 0.07;

    switch (this.soundType) {
      case SOUND_TYPES.POP:
        this._playPopSound(ctx, baseVol, pitchJitter, isInteractive);
        break;
      case SOUND_TYPES.TICK:
        this._playTickSound(ctx, baseVol, pitchJitter, isInteractive);
        break;
      case SOUND_TYPES.MAGIC:
        this._playMagicSound(ctx, baseVol, pitchJitter, isInteractive);
        break;
      case SOUND_TYPES.TACTILE:
      default:
        this._playTactileSound(ctx, baseVol, pitchJitter, isInteractive);
        break;
    }
  }

  /**
   * Crisp tactile switch/mouse click:
   * Layer 1: High frequency micro-transient (filtered snap)
   * Layer 2: Fast pitch drop body resonance (triangle oscillator)
   */
  _playTactileSound(ctx, baseVol, jitter, isInteractive) {
    const t = ctx.currentTime;
    const peakVol = (isInteractive ? 0.24 : 0.17) * baseVol;

    // Layer 1: Micro-transient snap (bandpassed noise burst)
    const noiseDuration = 0.005; // 5ms
    const sampleCount = Math.floor(ctx.sampleRate * noiseDuration);
    const noiseBuffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleCount * 0.35));
    }

    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime((isInteractive ? 4200 : 3400) * jitter, t);
    noiseFilter.Q.setValueAtTime(3.2, t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(peakVol * 1.3, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + noiseDuration);

    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSrc.start(t);

    // Layer 2: Body tone with fast pitch sweep (switch resonance)
    const bodyOsc = ctx.createOscillator();
    bodyOsc.type = "triangle";

    const startFreq = (isInteractive ? 1020 : 860) * jitter;
    const endFreq = 160 * jitter;
    const bodyDuration = 0.028; // 28ms

    bodyOsc.frequency.setValueAtTime(startFreq, t);
    bodyOsc.frequency.exponentialRampToValueAtTime(endFreq, t + bodyDuration);

    const bodyGain = ctx.createGain();
    bodyGain.gain.setValueAtTime(peakVol, t);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + bodyDuration);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(ctx.destination);

    bodyOsc.start(t);
    bodyOsc.stop(t + bodyDuration + 0.01);
  }

  /**
   * Playful bubble pop
   */
  _playPopSound(ctx, baseVol, jitter, isInteractive) {
    const t = ctx.currentTime;
    const peakVol = (isInteractive ? 0.25 : 0.18) * baseVol;
    const dur = 0.038;

    const osc = ctx.createOscillator();
    osc.type = "sine";

    const baseFreq = (isInteractive ? 480 : 420) * jitter;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.8, t + dur * 0.3);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.2, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peakVol, t + dur * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + dur + 0.01);
  }

  /**
   * Minimalist organic wood tick
   */
  _playTickSound(ctx, baseVol, jitter, isInteractive) {
    const t = ctx.currentTime;
    const peakVol = (isInteractive ? 0.22 : 0.15) * baseVol;
    const dur = 0.02;

    const osc = ctx.createOscillator();
    osc.type = "sine";

    const freq = (isInteractive ? 1750 : 1450) * jitter;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(peakVol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + dur + 0.01);
  }

  /**
   * Subtle celestial sparkle chime
   */
  _playMagicSound(ctx, baseVol, jitter, isInteractive) {
    const t = ctx.currentTime;
    const peakVol = (isInteractive ? 0.16 : 0.11) * baseVol;

    const tones = isInteractive ? [1568, 2093] : [1318, 1760];
    tones.forEach((freq, idx) => {
      const startTime = t + idx * 0.012;
      const dur = 0.07;

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * jitter, startTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(peakVol, startTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + dur + 0.01);
    });
  }
}

// Global singleton instance
export const cursorSound = new CursorSoundEngine();
if (typeof window !== "undefined") {
  cursorSound.init();
  window.cursorSound = cursorSound;
}
