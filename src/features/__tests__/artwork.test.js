import { describe, expect, it } from 'vitest';
import { artworks } from '../colouring-book/artworks';
import { scenes } from '../universe-colouring/scenes';

const SHAPES = new Set(['path', 'circle', 'ellipse', 'rect', 'polygon']);

describe.each([
  ['colouring book', artworks, 6],
  ['universe scenes', scenes, 6],
])('%s data', (_name, list, count) => {
  it(`has at least ${count} distinct pieces with unique ids`, () => {
    expect(list.length).toBeGreaterThanOrEqual(count);
    expect(new Set(list.map((a) => a.id)).size).toBe(list.length);
  });
  it.each(list.map((a) => [a.id, a]))('%s is well formed', (_id, a) => {
    expect(a.title && a.blurb && a.alt).toBeTruthy();
    expect(a.viewBox).toBe('0 0 800 600');
    const ids = a.regions.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    a.regions.forEach((r) => {
      expect(r.shapes.length).toBeGreaterThan(0);
      expect(Number.isFinite(r.at) && r.at >= 0).toBe(true);
      expect(Number.isFinite(r.dur) && r.dur > 0).toBe(true);
      expect(['sweep', 'pop']).toContain(r.kind);
      r.shapes.forEach((s) => expect(SHAPES.has(s.t)).toBe(true));
      if (typeof r.fill === 'string' && r.fill.startsWith('g:')) expect(a.gradients?.[r.fill.slice(2)]).toBeDefined();
      if (r.clip) expect(a.clips?.[r.clip]).toBeDefined();
    });
  });
  it('has a different reveal length for different pieces (no copy-paste timing)', () => {
    const lengths = list.map((a) => Math.max(...a.regions.map((r) => r.at + r.dur)));
    expect(new Set(lengths).size).toBeGreaterThan(Math.floor(list.length / 2));
  });
});

describe('scene choreography', () => {
  it('every scene has four narration captions and finishes within ~15s', () => {
    scenes.forEach((s) => {
      expect(s.captions).toHaveLength(4);
      expect(Math.max(...s.regions.map((r) => r.at + r.dur))).toBeLessThan(15000);
    });
  });
  it('book drawings reveal in roughly 4–10 seconds', () => {
    artworks.forEach((a) => {
      const t = Math.max(...a.regions.map((r) => r.at + r.dur)) / 1000;
      expect(t).toBeGreaterThanOrEqual(4);
      expect(t).toBeLessThanOrEqual(10);
    });
  });
});
