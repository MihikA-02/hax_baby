
import { useEffect } from "react";
import "./SparkleCursor.css";

const STAR_SHAPES = ["✦", "✧", "★", "✴", "✵"];
const STAR_COLORS = [
    "#f4a6cf", // pink
    "#b9a5f7", // lavender
    "#91d9f2", // sky blue
    "#a9dfb0", // mint
    "#f8d875", // butter yellow
];

export default function SparkleCursor() {
    useEffect(() => {
        // Keep the effect off for touch devices and reduced-motion users.
        if (
            window.matchMedia("(pointer: coarse)").matches ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return;
        }

        let lastX = 0;
        let lastY = 0;
        let lastTime = 0;
        let active = true;

        function createSparkle(x, y, burst = false) {
            if (!active) return;

            const sparkle = document.createElement("span");
            sparkle.className = "zoobi-sparkle";
            sparkle.textContent =
                STAR_SHAPES[Math.floor(Math.random() * STAR_SHAPES.length)];

            const size = burst
                ? 10 + Math.random() * 17
                : 8 + Math.random() * 13;

            const angle = Math.random() * Math.PI * 2;
            const distance = burst ? 18 + Math.random() * 45 : 8 + Math.random() * 22;

            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;
            sparkle.style.setProperty(
                "--sparkle-color",
                STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
            );
            sparkle.style.setProperty("--sparkle-size", `${size}px`);
            sparkle.style.setProperty("--drift-x", `${Math.cos(angle) * distance}px`);
            sparkle.style.setProperty("--drift-y", `${Math.sin(angle) * distance}px`);
            sparkle.style.setProperty(
                "--spin",
                `${Math.random() * 180 - 90}deg`
            );

            document.body.appendChild(sparkle);
            sparkle.addEventListener("animationend", () => sparkle.remove(), {
                once: true,
            });
        }

        function handleMove(event) {
            const now = performance.now();
            const dx = event.clientX - lastX;
            const dy = event.clientY - lastY;

            // Avoid making too many stars when the mouse moves slowly.
            if (Math.hypot(dx, dy) >= 12 && now - lastTime >= 18) {
                createSparkle(event.clientX, event.clientY);
                lastX = event.clientX;
                lastY = event.clientY;
                lastTime = now;
            }
        }

        function handleClick(event) {
            // A small burst of extra stars on click.
            for (let i = 0; i < 5; i++) {
                createSparkle(event.clientX, event.clientY, true);
            }
        }

        document.addEventListener("pointermove", handleMove);
        document.addEventListener("click", handleClick);

        return () => {
            active = false;
            document.removeEventListener("pointermove", handleMove);
            document.removeEventListener("click", handleClick);
            document.querySelectorAll(".zoobi-sparkle").forEach((star) => star.remove());
        };
    }, []);

    return null;
}
