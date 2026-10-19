import { describe, expect, it, vi, beforeEach } from "vitest";
import { cursorSound, SOUND_TYPES } from "../lib/cursorSound";

describe("cursorSound engine", () => {
  beforeEach(() => {
    cursorSound.init();
    cursorSound.setMuted(false);
    cursorSound.setSoundType(SOUND_TYPES.TACTILE);
    cursorSound.setVolume(0.7);
  });

  it("initializes with default settings", () => {
    const state = cursorSound.getState();
    expect(state.muted).toBe(false);
    expect(state.soundType).toBe(SOUND_TYPES.TACTILE);
    expect(state.volume).toBe(0.7);
  });

  it("toggles mute state correctly", () => {
    const isMutedNow = cursorSound.toggleMute();
    expect(isMutedNow).toBe(true);
    expect(cursorSound.getState().muted).toBe(true);

    const isUnmutedNow = cursorSound.toggleMute();
    expect(isUnmutedNow).toBe(false);
    expect(cursorSound.getState().muted).toBe(false);
  });

  it("updates sound type and persists", () => {
    cursorSound.setSoundType(SOUND_TYPES.POP);
    expect(cursorSound.getState().soundType).toBe(SOUND_TYPES.POP);

    cursorSound.setSoundType(SOUND_TYPES.MAGIC);
    expect(cursorSound.getState().soundType).toBe(SOUND_TYPES.MAGIC);
  });

  it("clamps volume between 0 and 1", () => {
    cursorSound.setVolume(1.5);
    expect(cursorSound.getState().volume).toBe(1);

    cursorSound.setVolume(-0.2);
    expect(cursorSound.getState().volume).toBe(0);

    cursorSound.setVolume(0.5);
    expect(cursorSound.getState().volume).toBe(0.5);
  });

  it("notifies subscribers when state changes", () => {
    const listener = vi.fn();
    const unsubscribe = cursorSound.subscribe(listener);

    cursorSound.setMuted(true);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ muted: true }));

    unsubscribe();
    cursorSound.setMuted(false);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
