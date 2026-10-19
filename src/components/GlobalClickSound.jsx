import { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX, Sparkles, Check, ChevronUp } from "lucide-react";
import { cursorSound, SOUND_TYPES } from "../lib/cursorSound";

const SOUND_LABELS = [
  { id: SOUND_TYPES.TACTILE, name: "Tactile Click", icon: "✨", desc: "Crisp mouse switch" },
  { id: SOUND_TYPES.POP, name: "Bubble Pop", icon: "🫧", desc: "Playful colorful pop" },
  { id: SOUND_TYPES.TICK, name: "Wood Tick", icon: "🪵", desc: "Minimal acoustic tap" },
  { id: SOUND_TYPES.MAGIC, name: "Magic Chime", icon: "⭐", desc: "Sparkly celestial chime" },
];

export default function GlobalClickSound() {
  const [state, setState] = useState(() => cursorSound.getState());
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);

  // Initialize and attach global pointer event listener across the entire website
  useEffect(() => {
    cursorSound.init();
    const unsubscribe = cursorSound.subscribe((newState) => {
      setState({ ...newState });
    });

    function handlePointerDown(e) {
      // Check for primary button (left click) or touch/pen
      if (e.button !== undefined && e.button !== 0) return;

      // Allow elements to opt-out
      if (e.target && e.target.closest && e.target.closest("[data-no-click-sound]")) {
        return;
      }

      // Detect if user clicked an interactive control vs background
      const isInteractive = Boolean(
        e.target &&
        e.target.closest &&
        e.target.closest(
          'a, button, input, select, textarea, [role="button"], [role="tab"], [role="link"], label, summary, [data-clickable="true"]'
        )
      );

      cursorSound.play({ isInteractive });
    }

    // Capture phase guarantees we hear clicks even if a component stops propagation
    window.addEventListener("pointerdown", handlePointerDown, {
      capture: true,
      passive: true,
    });

    return () => {
      unsubscribe();
      window.removeEventListener("pointerdown", handlePointerDown, {
        capture: true,
      });
    };
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    if (!panelOpen) return;
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    }
    window.addEventListener("pointerdown", handleClickOutside);
    return () => window.removeEventListener("pointerdown", handleClickOutside);
  }, [panelOpen]);

  const handleToggleMute = (e) => {
    e.stopPropagation();
    cursorSound.toggleMute();
  };

  const handleSelectSound = (type, e) => {
    e.stopPropagation();
    cursorSound.setSoundType(type);
  };

  const handleVolumeChange = (vol, e) => {
    e.stopPropagation();
    cursorSound.setVolume(vol);
    cursorSound.play({ force: true, isInteractive: true });
  };

  return (
    <div
      ref={panelRef}
      className="fixed bottom-4 left-4 z-[9999] select-none"
      data-no-click-sound="true"
    >
      {/* Options Panel Popup */}
      {panelOpen && (
        <div
          role="dialog"
          aria-label="Cursor click sound settings"
          className="mb-2.5 w-64 rounded-2xl border-2 border-[#edc5d9] bg-[#fffaf3]/95 p-3.5 shadow-xl backdrop-blur-md transition-all duration-200 text-[#433878]"
          style={{
            boxShadow: "0 10px 25px -5px rgba(220, 76, 155, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#edc5d9]/60 pb-2 mb-2.5">
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#dc4c9b]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cursor Click Sound</span>
            </div>
            <button
              onClick={() => setPanelOpen(false)}
              className="rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-60 hover:opacity-100 hover:bg-[#ffe2ee] transition-colors"
              aria-label="Close settings"
            >
              ✕
            </button>
          </div>

          {/* Sound Types */}
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-gray-500 mb-1">Click Sound Style</p>
            {SOUND_LABELS.map((item) => {
              const active = state.soundType === item.id;
              return (
                <button
                  key={item.id}
                  onClick={(e) => handleSelectSound(item.id, e)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs font-medium transition-all ${active
                      ? "bg-[#ffe2ee] text-[#dc4c9b] font-bold shadow-sm"
                      : "hover:bg-[#fff0bf]/60 text-[#514582]"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <div>
                      <div>{item.name}</div>
                      <div className="text-[10px] opacity-70 font-normal">{item.desc}</div>
                    </div>
                  </div>
                  {active && <Check className="w-3.5 h-3.5 text-[#dc4c9b]" />}
                </button>
              );
            })}
          </div>

          {/* Volume Presets */}
          <div className="mt-3 pt-2.5 border-t border-[#edc5d9]/60">
            <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 mb-1.5">
              <span>Volume</span>
              <span className="text-[#dc4c9b] font-bold">{Math.round(state.volume * 100)}%</span>
            </div>
            <div className="flex gap-1.5">
              {[
                { label: "Soft", val: 0.35 },
                { label: "Medium", val: 0.7 },
                { label: "Crisp", val: 1.0 },
              ].map((lvl) => (
                <button
                  key={lvl.label}
                  onClick={(e) => handleVolumeChange(lvl.val, e)}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-semibold transition-all ${Math.abs(state.volume - lvl.val) < 0.1
                      ? "bg-[#514582] text-white shadow-sm"
                      : "bg-[#fff0bf]/60 text-[#514582] hover:bg-[#ffe2ee]"
                    }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Pill */}
      <div
        className="flex items-center gap-1 rounded-full border-2 border-[#edc5d9] bg-[#fffaf3]/90 p-1 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-[#fffaf3]"
        style={{
          boxShadow: "0 6px 18px rgba(220, 76, 155, 0.18)",
        }}
      >
        {/* Toggle Mute Button */}
        <button
          onClick={handleToggleMute}
          aria-label={state.muted ? "Unmute cursor click sound" : "Mute cursor click sound"}
          title={state.muted ? "Click to unmute cursor clicks" : "Click to mute cursor clicks"}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${state.muted
              ? "bg-gray-200/80 text-gray-500 hover:bg-gray-300/80"
              : "bg-[#ffe2ee] text-[#dc4c9b] hover:bg-[#ffd1e3]"
            }`}
        >
          {state.muted ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Clicks Muted</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>Click Sound</span>
            </>
          )}
        </button>

        {/* Settings Dropdown Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPanelOpen((prev) => !prev);
          }}
          aria-label="Cursor sound options"
          title="Customize click sound & volume"
          className={`rounded-full p-1.5 transition-colors ${panelOpen
              ? "bg-[#514582] text-white"
              : "text-[#514582] hover:bg-[#fff0bf] hover:text-[#dc4c9b]"
            }`}
        >
          <ChevronUp
            className={`w-3.5 h-3.5 transition-transform duration-200 ${panelOpen ? "rotate-180" : ""
              }`}
          />
        </button>
      </div>
    </div>
  );
}
