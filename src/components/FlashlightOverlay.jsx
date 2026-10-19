import { useEffect, useRef } from "react";

/**
 * FlashlightOverlay
 * Creates an atmospheric night-mode spotlight that follows the pointer across the viewport.
 * Uses CSS custom properties and requestAnimationFrame for 60/120fps smooth performance
 * without triggering React re-renders.
 */
export default function FlashlightOverlay() {
  const overlayRef = useRef(null);
  const rafId = useRef(null);
  const pointerPos = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    // Check for touch / coarse pointer
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) {
      // Touch fallback: smooth ambient centered illumination
      el.style.setProperty("--flashlight-x", "50vw");
      el.style.setProperty("--flashlight-y", "45vh");
      el.style.setProperty("--flashlight-opacity", "1");
      return;
    }

    function update() {
      if (!el) return;
      if (pointerPos.current.active) {
        el.style.setProperty("--flashlight-x", `${pointerPos.current.x}px`);
        el.style.setProperty("--flashlight-y", `${pointerPos.current.y}px`);
        el.style.setProperty("--flashlight-opacity", "1");
      } else {
        // Pointer left the window or tab lost focus: smoothly hide the spotlight
        el.style.setProperty("--flashlight-x", "-1000px");
        el.style.setProperty("--flashlight-y", "-1000px");
        el.style.setProperty("--flashlight-opacity", "0.95");
      }
      rafId.current = null;
    }

    function onPointerMove(e) {
      pointerPos.current.x = e.clientX;
      pointerPos.current.y = e.clientY;
      pointerPos.current.active = true;
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(update);
      }
    }

    function onPointerLeave() {
      pointerPos.current.active = false;
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(update);
      }
    }

    function onBlur() {
      pointerPos.current.active = false;
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(update);
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("blur", onBlur);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="zoobi-flashlight-overlay"
      aria-hidden="true"
    />
  );
}
