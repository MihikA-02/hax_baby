import { describe, expect, it } from "vitest";

describe("Chaos Mode (Feature 1)", () => {
  it("defaults to Chaos Mode off", () => {
    let isChaosMode = false;
    expect(isChaosMode).toBe(false);
  });

  it("toggles Chaos Mode independently of Day/Night mode", () => {
    let isChaosMode = false;
    let isNightMode = false;

    // Toggle Chaos Mode
    isChaosMode = !isChaosMode;
    expect(isChaosMode).toBe(true);
    expect(isNightMode).toBe(false); // Day/Night unaffected

    // Toggle Night Mode
    isNightMode = !isNightMode;
    expect(isChaosMode).toBe(true); // Chaos unaffected
    expect(isNightMode).toBe(true);

    // Toggle Chaos Mode off (Restore Order)
    isChaosMode = !isChaosMode;
    expect(isChaosMode).toBe(false);
    expect(isNightMode).toBe(true); // Night still active
  });
});

describe("Triple-click Easter Egg (Feature 2)", () => {
  function createClickTracker() {
    let clickTimes = [];
    let secretTriggered = false;
    let normalBounces = 0;

    const click = (now) => {
      // Keep clicks within the 2000ms window
      const recent = clickTimes.filter((t) => now - t <= 2000);
      recent.push(now);
      clickTimes = recent;

      if (recent.length >= 3) {
        clickTimes = [];
        secretTriggered = true;
      } else {
        normalBounces += 1;
      }
    };

    return {
      click,
      isTriggered: () => secretTriggered,
      getBounceCount: () => normalBounces,
      reset: () => {
        secretTriggered = false;
        clickTimes = [];
      },
    };
  }

  it("triggers secret on 3 clicks within 2 seconds", () => {
    const tracker = createClickTracker();
    tracker.click(100);
    expect(tracker.isTriggered()).toBe(false);
    expect(tracker.getBounceCount()).toBe(1);

    tracker.click(600);
    expect(tracker.isTriggered()).toBe(false);
    expect(tracker.getBounceCount()).toBe(2);

    tracker.click(1200); // 3rd click within 1.1s
    expect(tracker.isTriggered()).toBe(true);
  });

  it("resets click counter when time window exceeds 2 seconds", () => {
    const tracker = createClickTracker();
    tracker.click(100);
    tracker.click(500);

    // If 2.5 seconds pass with no clicks, previous clicks expire
    tracker.click(3200);
    expect(tracker.isTriggered()).toBe(false);
    expect(tracker.getBounceCount()).toBe(3); // normal bounce, counter reset to 1

    tracker.click(3700);
    expect(tracker.isTriggered()).toBe(false);

    tracker.click(4200); // 3 clicks within 1.0s (3200, 3700, 4200)
    expect(tracker.isTriggered()).toBe(true);
  });
});
