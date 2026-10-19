import { describe, expect, it } from 'vitest';
import { BASE_COLOURS, EXPERIMENTS, SHADE_LIBRARY } from '../colour-lab/data';
import { hexToRgb, mixColours, mixHex, nameFor, normaliseHex, rgbToHex } from '../colour-lab/mixing';

describe('colour mixing', () => {
  it('is deterministic: same inputs, same output', () => {
    for (const a of BASE_COLOURS) {
      for (const b of BASE_COLOURS) {
        expect(mixColours(a.hex, b.hex, 0.35)).toEqual(mixColours(a.hex, b.hex, 0.35));
      }
    }
  });
  it('is symmetric at an even balance', () => {
    expect(mixHex('#FF86C1', '#4DA3FF', 0.5)).toBe(mixHex('#4DA3FF', '#FF86C1', 0.5));
  });
  it('returns the endpoints at share 0 and 1', () => {
    expect(mixHex('#FF86C1', '#4DA3FF', 0)).toBe('#FF86C1');
    expect(mixHex('#FF86C1', '#4DA3FF', 1)).toBe('#4DA3FF');
  });
  it('returns Zoobi\u2019s own recipe for curated pairs in either order', () => {
    for (const e of EXPERIMENTS) {
      expect(mixColours(e.a.hex, e.b.hex, 0.5).hex).toBe(e.result.hex);
      expect(mixColours(e.b.hex, e.a.hex, 0.5).name).toBe(e.result.name);
    }
  });
  it('white lightens and yellow + blue leans green', () => {
    const light = hexToRgb(mixHex('#4DA3FF', '#FFFDF6', 0.5));
    expect(light[0]).toBeGreaterThan(0x4d);
    const [r, g, b] = hexToRgb(mixHex('#FFD93D', '#4DA3FF', 0.5));
    expect(g).toBeGreaterThanOrEqual(r);
    expect(g).toBeGreaterThan(b - 10);
  });
  it('names every blend from the library and keeps names stable', () => {
    const names = new Set(SHADE_LIBRARY.map((s) => s.name));
    const n = nameFor(mixHex('#EF4B4B', '#FFFDF6', 0.5));
    expect(names.has(n)).toBe(true);
    expect(nameFor('#9670C7')).toBe('Dreamberry');
  });
  it('has unique experiment ids, valid hex codes and unique shade names', () => {
    expect(new Set(EXPERIMENTS.map((e) => e.id)).size).toBe(EXPERIMENTS.length);
    expect(new Set(EXPERIMENTS.map((e) => e.result.name)).size).toBe(EXPERIMENTS.length);
    EXPERIMENTS.forEach((e) => [e.a.hex, e.b.hex, e.result.hex].forEach((h) => expect(normaliseHex(h)).toBe(h.toUpperCase())));
  });
  it('round-trips hex', () => {
    expect(rgbToHex(hexToRgb('#12AB9F'))).toBe('#12AB9F');
    expect(normaliseHex('#abc')).toBe('#AABBCC');
    expect(normaliseHex('nope')).toBeNull();
  });
});
