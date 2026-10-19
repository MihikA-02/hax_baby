import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import heroBook from "@/assets/hero-book.jpg";
import parchment from "@/assets/parchment-bg.jpg";
import night from "@/assets/night.jpg";
import meadow from "@/assets/meadow.jpg";
import gallery3 from "@/assets/gallery3.png";
import gallery4 from "@/assets/gallery4.png";
import gallery5 from "@/assets/gallery5.png";
import gallery6 from "@/assets/gallery6.png";
import zoobi from "@/assets/zoobi.png";
import heroVideo from "@/assets/hero_page.mp4";
import originVideo from "@/assets/origin_page.mp4";
import { Projects } from "@/features/projects/ProjectsSection";
import Zoobi from "@/Zoobi";
import SparkleCursor from "@/SparkleCursor";
import Storybook from "@/components/storybook/Storybook";
import InteractiveZoobi from "@/components/InteractiveZoobi";
import nightBg from "@/assets/night_bg.png";
import FlashlightOverlay from "@/components/FlashlightOverlay";
import { Sun, Moon, Sparkles } from "lucide-react";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zoobi — The Universe Color Keeper" },
      {
        name: "description",
        content:
          "Enter Zoobi's storybook world: origin story, projects, art studio and guestbook.",
      },
      { property: "og:title", content: "Zoobi — The Universe Color Keeper" },
      {
        property: "og:description",
        content: "You see the world. Zoobi sees a canvas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});
const origin = [
  {
    t: "A colorless world",
    d: "Once upon a time, the world was full of outlines and empty skies.",
    img: heroBook,
    f: "grayscale",
  },
  {
    t: "The First Palette",
    d: "A drop of rainbow paint created Zoobi.",
    img: meadow,
    f: "",
  },
  {
    t: "The First Brushstroke",
    d: "Zoobi painted the first flower, and colors began to spread.",
    img: meadow,
    f: "saturate-150 hue-rotate-15",
  },
  {
    t: "The Universe Awakens",
    d: "Zoobi traveled across worlds, bringing colors to life.",
    img: night,
    f: "",
  },
];

const traits = [
  "Curious",
  "Playful",
  "Imaginative",
  "Kind",
  "A little clumsy",
  "Always creating",
];
const palette = [
  "oklch(0.7 0.2 350)",
  "oklch(0.78 0.16 60)",
  "oklch(0.75 0.17 140)",
  "oklch(0.68 0.15 240)",
  "oklch(0.68 0.16 300)",
];
/* ─── Main Page ─────────────────────────────────────────────────────────────── */
function Index() {
  const [dark, setDark] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [isChaosMode, setIsChaosMode] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [siteUnlocked, setSiteUnlocked] = useState(() => {
    try {
      return window.sessionStorage.getItem("zoobi-site-unlocked") === "true";
    } catch {
      return false;
    }
  });
  function handlePlayClick() {
    setShowVideo(true);
    document.body.style.overflow = "hidden";
  }
  function handleDismissVideo() {
    setShowVideo(false);
    setSiteUnlocked(true);
    document.body.style.overflow = "";
  }
  // Clean up on unmount
  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    [],
  );
  return (
    <>
      {/* Full-screen video overlay */}
      {showVideo && (
        <VideoOverlay
          videoSrc={heroVideo}
          onEnd={handleDismissVideo}
          onSkip={handleDismissVideo}
        />
      )}

      {/* Post-intro control toggles: Chaos Mode & Day/Night Mode */}
      {siteUnlocked && (
        <div className="fixed top-3 right-3 sm:top-5 sm:right-6 z-50 flex items-center gap-2 select-none">
          {/* Chaos Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsChaosMode((prev) => !prev)}
            aria-pressed={isChaosMode}
            aria-label={isChaosMode ? "Restore normal layout" : "Activate Chaos Mode"}
            className={`zoobi-chaos-toggle flex items-center gap-1.5 rounded-full px-3 py-1.5 sm:px-3.5 sm:py-2 font-display text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-berry backdrop-blur-md ${isChaosMode
              ? "bg-[#ff4e88]/90 text-white border-2 border-[#ffb3d1] shadow-[0_4px_16px_rgba(255,78,136,0.4)] animate-pulse"
              : isNightMode
                ? "bg-[#1f1b40]/85 text-[#f0e8ff] border border-[#7f6bbb]/60 shadow-[0_4px_16px_rgba(10,5,28,0.5)] hover:bg-[#2d275e] hover:border-[#a08cee]"
                : "bg-[#fffaf3]/90 text-[#514582] border border-[#edc5d9] shadow-[0_4px_14px_rgba(220,76,155,0.18)] hover:bg-[#fffaf3] hover:border-[#dc4c9b]"
              }`}
          >
            {isChaosMode ? (
              <>
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                <span>✨ Restore Order</span>
              </>
            ) : (
              <>
                <span className="text-sm">🌀</span>
                <span>Chaos</span>
              </>
            )}
          </button>

          {/* Day / Night Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsNightMode((prev) => !prev)}
            aria-pressed={isNightMode}
            aria-label={isNightMode ? "Switch to Day mode" : "Switch to Night mode"}
            className={`zoobi-theme-toggle flex items-center gap-1.5 rounded-full px-3 py-1.5 sm:px-3.5 sm:py-2 font-display text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-berry backdrop-blur-md ${isNightMode
              ? "bg-[#181636]/85 text-[#f0e8ff] border border-[#7f6bbb]/60 shadow-[0_4px_16px_rgba(10,5,28,0.5)] hover:bg-[#241f4d] hover:border-[#a08cee]"
              : "bg-[#fffaf3]/90 text-[#514582] border border-[#edc5d9] shadow-[0_4px_14px_rgba(220,76,155,0.18)] hover:bg-[#fffaf3] hover:border-[#dc4c9b]"
              }`}
          >
            {isNightMode ? (
              <>
                <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#f0c24b]" aria-hidden="true" />
                <span>Night</span>
              </>
            ) : (
              <>
                <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#f59e0b]" aria-hidden="true" />
                <span>Day</span>
              </>
            )}
          </button>
        </div>
      )}

      <div
        className={`transition-colors duration-500 ${!siteUnlocked && dark ? "dark" : ""}`}
        style={
          !siteUnlocked
            ? dark
              ? { background: "var(--parchment)", minHeight: "100vh" }
              : {
                backgroundImage: `url(${parchment})`,
                backgroundSize: "100% auto",
                minHeight: "100vh",
              }
            : isNightMode
              ? {
                backgroundImage: `url(${nightBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                backgroundColor: "#070919",
                minHeight: "100vh",
              }
              : dark
                ? { background: "var(--parchment)", minHeight: "100vh" }
                : {
                  backgroundImage: `url(${parchment})`,
                  backgroundSize: "100% auto",
                  minHeight: "100vh",
                }
        }
      >
        {/* Cursor effect: In Day mode SparkleCursor, in Night mode FlashlightOverlay */}
        {!isNightMode ? <SparkleCursor /> : siteUnlocked ? <FlashlightOverlay /> : null}

        {/* Show the book landing page only before the intro is dismissed */}
        {!siteUnlocked && (
          <div style={{ height: "100vh", overflow: "hidden" }}>

            <Hero onPlay={handlePlayClick} />
          </div>
        )}

        {/* First page after intro: parchment + interactive Zoobi */}

        {/* All post-video pages */}
        {siteUnlocked && (
          <div
            className={`zoobi-pages-scroll ${isNightMode ? "zoobi-night-mode" : ""} ${isChaosMode ? "zoobi-chaos-mode" : ""}`}
            id="PortfolioPages"
          >

            {/* PAGE 1: Welcome screen */}
            <section
              id="Welcome"
              className="zoobi-page relative w-full overflow-hidden"
              style={{
                //backgroundImage: `url(${parchment})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Interactive Zoobi on the left */}
              <div className="absolute left-[2%] top-1/2 w-[min(48vw,500px)] -translate-y-1/2">
                <InteractiveZoobi />
              </div>


              {/* Welcome text and navigation on the right */}
              <div className="zoobi-welcome-copy">
                <p className="zoobi-welcome-kicker">
                  ✦ THE UNIVERSE COLOR KEEPER ✦
                </p>

                <h1 className="zoobi-welcome-title">
                  <span className="zoobi-welcome-hello">Hii, I am</span>
                  <span className="zoobi-welcome-name">ZOOBI!</span>
                </h1>

                <p className="zoobi-welcome-subtitle">
                  Welcome to my portfolio!
                </p>

                <p className="zoobi-welcome-description">
                  I'm a tiny artist with{" "}
                  <strong>BIG dreams</strong>, a magical brush
                  and endless colours to share.
                </p>

                <nav
                  className="zoobi-welcome-links"
                  aria-label="Explore Zoobi's portfolio"
                >
                  <a href="#Personality">♡ My Personality</a>
                  <a href="#Story"> My Origin</a>
                  <a href="#Projects"> My Projects</a>
                  <a href="#Gallery"> My World</a>
                  <a href="#Guestbook"> The Guestbook</a>
                </nav>

                <a
                  className="zoobi-welcome-explore"
                  href="#Personality"
                >
                  ↓ Come explore my world!
                </a>
              </div>

            </section>

            {/* PAGE 2: My Personality */}
            <section id="Personality" className="zoobi-page">
              <Meet />
            </section>

            {/* PAGE 3: My Origin */}
            <section className="zoobi-page zoobi-origin-page relative overflow-hidden">
              <Origin isNightMode={isNightMode} />
            </section>

            {/* PAGE 4: My Projects */}
            <section className="zoobi-page">
              <Projects />
            </section>

            {/* PAGE 5: Art Studio + Zoobi's World */}
            <section className="zoobi-page zoobi-canvas-world-page">
              <Studio />
              <Gallery />
            </section>

            {/* PAGE 6: Full-screen Guestbook */}
            <section
              id="Guestbook"
              className="zoobi-page zoobi-guestbook-page"
            >
              <Guestbook />
            </section>


          </div>
        )}

      </div>
    </>
  );
}


/* ─── Video Overlay ─────────────────────────────────────────────────────────── */
function VideoOverlay({ videoSrc, onEnd, onSkip }) {
  const videoRef = useRef(null);
  useEffect(() => {
    videoRef.current?.play().catch(() => { });
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        onEnded={onEnd}
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Skip Intro – bottom-right corner */}
      <button
        onClick={onSkip}
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "2rem",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.35)",
          color: "#fff",
          fontFamily: "inherit",
          fontSize: "0.9rem",
          fontWeight: 600,
          letterSpacing: "0.05em",
          padding: "0.55rem 1.4rem",
          borderRadius: "999px",
          cursor: "pointer",
          transition: "background 0.2s, transform 0.15s",
          zIndex: 10000,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.3)";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.15)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        Skip Intro ▶▶
      </button>
    </div>
  );
}
/* ─── Nav ───────────────────────────────────────────────────────────────────── */

/* ─── Hero ──────────────────────────────────────────────────────────────────── */
function Hero({ onPlay }) {
  return (
    <section
      id="Home"
      className="relative overflow-hidden"
      style={{ height: "100vh" }}
    >
      <img
        src={heroBook}
        alt="Open storybook with sketched world"
        width={1920}
        height={1088}
        className="h-full w-full object-contain"
      />
      <div className="absolute left-[24%] top-[18%] w-[30%] text-center">
        <h1 className="hero-zoobi-title">
          Zoobi
        </h1>
        <p className="tracking-[0.2em] text-sm uppercase">
          The Universe Color Keeper
        </p>
        <p className="mt-4 text-xl italic">
          "You see the world.
          <br />I see a canvas."
        </p>
        <button
          onClick={onPlay}
          aria-label="Play intro video"
          className="mx-auto mt-6 grid h-20 w-20 place-items-center rounded-full border-2 border-ink text-3xl transition hover:scale-110"
        >
          ▶
        </button>
        <a
          href="#Story"
          className="paper-card mt-6 inline-block -rotate-2 px-5 py-2 font-bold"
        >
          Enter Zoobi's World
        </a>
      </div>
    </section>
  );
}
/* ─── Section helpers ───────────────────────────────────────────────────────── */
function Title({ t, s }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-4xl font-bold text-ink">{t}</h2>
      <p className="opacity-80">{s}</p>
    </div>
  );
}

function Origin({ isNightMode }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (!isNightMode) {
      vid.play().catch(() => { });
    } else {
      vid.pause();
    }
  }, [isNightMode]);

  return (
    <section
      id="Story"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "100svh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Day-mode background video — unmounted in Night mode ── */}
      {!isNightMode && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
            /* fade-in so the video doesn't snap in abruptly */
            animation: "origin-video-fadein 1.5s ease-out both",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          }}
          aria-hidden="true"
        >
          {/* The video itself */}
          <video
            ref={videoRef}
            src={originVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Feathered top edge — blends into pink/parchment above */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "22%",
            background: "linear-gradient(to bottom, rgba(255,220,230,0.85) 0%, transparent 100%)",
            pointerEvents: "none",
          }} />
          {/* Feathered bottom edge */}
          <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "22%",
            background: "linear-gradient(to top, rgba(255,220,230,0.85) 0%, transparent 100%)",
            pointerEvents: "none",
          }} />
          {/* Feathered left edge */}
          <div style={{
            position: "absolute",
            top: 0, bottom: 0, left: 0,
            width: "12%",
            background: "linear-gradient(to right, rgba(255,215,228,0.80) 0%, transparent 100%)",
            pointerEvents: "none",
          }} />
          {/* Feathered right edge */}
          <div style={{
            position: "absolute",
            top: 0, bottom: 0, right: 0,
            width: "12%",
            background: "linear-gradient(to left, rgba(255,215,228,0.80) 0%, transparent 100%)",
            pointerEvents: "none",
          }} />

          {/* Centre wash — keeps title and book legible without washing out scene */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,235,242,0.18)",
            pointerEvents: "none",
          }} />
        </div>
      )}

      {/* ── Content layered above video ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          flex: "1 1 auto",
          padding: "clamp(1rem, 3vh, 2rem) clamp(1rem, 4vw, 4rem)",
          boxSizing: "border-box",
          pointerEvents: "auto",
        }}
      >
        <Title
          t="Zoobi's Origin"
          s="From a drop of magic, a universe of colors was born..."
        />

        <div className="origin-book-stage">
          <Storybook />
        </div>
      </div>
    </section>
  );
}

const PERSONALITY_CARDS = [
  {
    label: "Curious",
    icon: "✦",
    bg: "bg-[#ffe4f0]/90",
    border: "border-[#f7c0d8]",
    text: "text-[#b83375]",
    shadow: "shadow-[0_4px_12px_rgba(244,166,207,0.2)]",
    tilt: "-rotate-3",
    floatClass: "zoobi-card-float-1",
    delay: "0s",
  },
  {
    label: "Playful",
    icon: "⭐",
    bg: "bg-[#fff2cc]/90",
    border: "border-[#f9df94]",
    text: "text-[#9e6f0b]",
    shadow: "shadow-[0_4px_12px_rgba(248,216,117,0.2)]",
    tilt: "rotate-2",
    floatClass: "zoobi-card-float-2",
    delay: "0.6s",
  },
  {
    label: "Imaginative",
    icon: "✨",
    bg: "bg-[#eee6ff]/90",
    border: "border-[#d4c2fa]",
    text: "text-[#6942b0]",
    shadow: "shadow-[0_4px_12px_rgba(185,165,247,0.2)]",
    tilt: "-rotate-2",
    floatClass: "zoobi-card-float-3",
    delay: "1.2s",
  },
  {
    label: "Kind",
    icon: "🌸",
    bg: "bg-[#e2f8ec]/90",
    border: "border-[#b3ebd0]",
    text: "text-[#288358]",
    shadow: "shadow-[0_4px_12px_rgba(169,223,176,0.2)]",
    tilt: "rotate-3",
    floatClass: "zoobi-card-float-1",
    delay: "1.8s",
  },
  {
    label: "A little clumsy",
    icon: "✧",
    bg: "bg-[#e0f4fe]/90",
    border: "border-[#b8e2fa]",
    text: "text-[#1d6fa5]",
    shadow: "shadow-[0_4px_12px_rgba(145,217,242,0.2)]",
    tilt: "-rotate-3",
    floatClass: "zoobi-card-float-2",
    delay: "2.4s",
  },
  {
    label: "Always creating",
    icon: "🖌️",
    bg: "bg-[#ffe9dc]/90",
    border: "border-[#facbb2]",
    text: "text-[#b24e1b]",
    shadow: "shadow-[0_4px_12px_rgba(255,183,142,0.2)]",
    tilt: "rotate-2",
    floatClass: "zoobi-card-float-3",
    delay: "0.9s",
  },
];

function MagicalBubblesBackground() {
  const bubbles = [
    { left: "5%", top: "12%", size: 46, tint: "rgba(255, 218, 235, 0.45)", glow: "rgba(255, 180, 220, 0.28)", dur: "7s", delay: "0s" },
    { left: "15%", top: "70%", size: 34, tint: "rgba(230, 215, 255, 0.45)", glow: "rgba(200, 170, 255, 0.28)", dur: "9s", delay: "-2s" },
    { left: "25%", top: "18%", size: 58, tint: "rgba(215, 240, 255, 0.42)", glow: "rgba(180, 220, 255, 0.28)", dur: "11s", delay: "-4s" },
    { left: "32%", top: "84%", size: 28, tint: "rgba(255, 235, 220, 0.45)", glow: "rgba(255, 200, 170, 0.28)", dur: "8s", delay: "-1s" },
    { left: "48%", top: "6%", size: 40, tint: "rgba(255, 220, 240, 0.42)", glow: "rgba(255, 180, 210, 0.28)", dur: "10s", delay: "-5s" },
    { left: "65%", top: "86%", size: 50, tint: "rgba(235, 220, 255, 0.45)", glow: "rgba(210, 180, 255, 0.28)", dur: "8.5s", delay: "-3s" },
    { left: "74%", top: "14%", size: 32, tint: "rgba(215, 245, 255, 0.45)", glow: "rgba(180, 230, 255, 0.28)", dur: "9.5s", delay: "-6s" },
    { left: "88%", top: "78%", size: 54, tint: "rgba(255, 225, 235, 0.42)", glow: "rgba(255, 190, 210, 0.28)", dur: "10.5s", delay: "-2.5s" },
    { left: "94%", top: "24%", size: 38, tint: "rgba(255, 240, 215, 0.45)", glow: "rgba(255, 210, 170, 0.28)", dur: "7.5s", delay: "-4.5s" },
    { left: "54%", top: "80%", size: 24, tint: "rgba(225, 250, 235, 0.42)", glow: "rgba(190, 240, 210, 0.22)", dur: "12s", delay: "-7s" },
    { left: "10%", top: "44%", size: 22, tint: "rgba(215, 240, 255, 0.4)", glow: "rgba(180, 220, 255, 0.2)", dur: "8.8s", delay: "-3.5s" },
    { left: "82%", top: "46%", size: 26, tint: "rgba(255, 220, 245, 0.42)", glow: "rgba(255, 180, 220, 0.22)", dur: "9.2s", delay: "-1.8s" },
  ];

  const stars = [
    { left: "8%", top: "32%", icon: "✦", color: "#f8d875", dur: "3.5s", delay: "0s" },
    { left: "28%", top: "64%", icon: "✧", color: "#f4a6cf", dur: "4.2s", delay: "-1.2s" },
    { left: "68%", top: "26%", icon: "★", color: "#b9a5f7", dur: "4s", delay: "-2.5s" },
    { left: "82%", top: "12%", icon: "✦", color: "#f8d875", dur: "3.8s", delay: "-0.8s" },
    { left: "91%", top: "62%", icon: "✧", color: "#91d9f2", dur: "4.5s", delay: "-3s" },
  ];

  return (
    <div className="zoobi-magical-bubbles-bg absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {bubbles.map((b, i) => (
        <span
          key={`b-${i}`}
          className="zoobi-magical-bubble"
          style={{
            left: b.left,
            top: b.top,
            width: `${b.size}px`,
            height: `${b.size}px`,
            "--bubble-tint": b.tint,
            "--bubble-glow": b.glow,
            "--bubble-dur": b.dur,
            "--bubble-delay": b.delay,
          }}
        />
      ))}
      {stars.map((s, i) => (
        <span
          key={`s-${i}`}
          className="zoobi-magical-star"
          style={{
            left: s.left,
            top: s.top,
            "--star-color": s.color,
            "--star-dur": s.dur,
            "--star-delay": s.delay,
          }}
        >
          {s.icon}
        </span>
      ))}
    </div>
  );
}

function Meet() {
  return (
    <div className="zoobi-personality-stage relative w-full overflow-hidden py-2 sm:py-4">
      {/* Subtle magical bubbles and sparkles layer BEHIND character and cards */}
      <MagicalBubblesBackground />

      {/* Main composition: Left (Floating kawaii cards) | Centre (3D Zoobi enlarged) | Right (Character Profile moved farther right) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.35fr_1fr] items-center gap-6 xl:gap-10 w-full max-w-7xl mx-auto px-2">
        {/* LEFT: 6 Floating Kawaii Personality Cards */}
        <div className="zoobi-traits-cluster flex flex-col gap-3.5 max-w-sm mx-auto lg:mx-0 w-full">
          <div className="flex flex-wrap lg:flex-col gap-2.5 sm:gap-3.5 justify-center lg:justify-start">
            {PERSONALITY_CARDS.map((trait) => (
              <div
                key={trait.label}
                className={`zoobi-trait-card ${trait.floatClass} ${trait.bg} ${trait.border} ${trait.shadow} ${trait.tilt} inline-flex items-center gap-2 rounded-2xl border px-4 py-2 sm:py-2.5 backdrop-blur-[2px] transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default`}
                style={{ animationDelay: trait.delay }}
              >
                <span className="text-base select-none" aria-hidden="true">
                  {trait.icon}
                </span>
                <span className={`font-display text-sm sm:text-base font-bold ${trait.text}`}>
                  {trait.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTRE: Zoobi 3D Model (Slightly larger, prominent in the centre) */}
        <div className="zoobi-personality-model flex items-center justify-center w-full max-w-[460px] mx-auto order-first lg:order-none">
          <Zoobi scale={1.18} />
        </div>

        {/* RIGHT: Character Profile Card (Moved slightly farther right with breathing room) */}
        <div className="zoobi-profile-container flex justify-center lg:justify-end w-full">
          <div className="zoobi-profile-card paper-card rotate-2 hover:rotate-0 transition-transform duration-300 p-5 sm:p-6 w-full max-w-xs sm:max-w-sm shadow-md lg:translate-x-3">
            <h3 className="mb-3 text-xl font-bold underline font-display text-ink">
              Character Profile
            </h3>
            <ul className="space-y-2 font-display text-sm sm:text-base">
              <li className="flex items-center gap-2"><span>⭐</span> <span>Species: Zoobi</span></li>
              <li className="flex items-center gap-2"><span>🖌️</span> <span>Magic Tool: Paintbrush</span></li>
              <li className="flex items-center gap-2"><span>🏠</span> <span>Home: Dreamy World</span></li>
              <li className="flex items-center gap-2"><span>🌸</span> <span>Favorite: Colors, Flowers, Stars</span></li>
              <li className="flex items-center gap-2"><span>💫</span> <span>Dream: To paint the whole universe!</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Studio() {
  const ref = useRef(null);
  const [color, setColor] = useState(palette[0]);
  const [size, setSize] = useState(6);
  const drawing = useRef(false);
  const history = useRef([]);
  useEffect(() => {
    const c = ref.current;
    c.width = c.offsetWidth;
    c.height = c.offsetHeight;
  }, []);
  const pos = (e) => {
    const r = ref.current.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  const start = (e) => {
    const ctx = ref.current.getContext("2d");
    history.current.push(
      ctx.getImageData(0, 0, ref.current.width, ref.current.height),
    );
    drawing.current = true;
    const [x, y] = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e) => {
    if (!drawing.current) return;
    const ctx = ref.current.getContext("2d");
    const [x, y] = pos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const undo = () => {
    const d = history.current.pop();
    if (d) ref.current.getContext("2d").putImageData(d, 0, 0);
  };
  const clear = () => {
    const c = ref.current;
    c.getContext("2d").clearRect(0, 0, c.width, c.height);
  };
  const save = () => {
    const a = document.createElement("a");
    a.download = "zoobi-art.png";
    a.href = ref.current.toDataURL();
    a.click();
  };
  return (
    <section id="Art Studio">
      <Title t="Zoobi's Art Studio" s="Let your imagination paint!" />
      <div className="paper-card flex gap-4 p-4">
        <div className="flex flex-col gap-3">
          {palette.map((c) => (
            <button
              key={c}
              aria-label="color"
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-full ring-offset-2 ${color === c ? "ring-2 ring-ink" : ""}`}
              style={{ background: c }}
            />
          ))}
        </div>
        <div className="flex-1">
          <canvas
            ref={ref}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={() => (drawing.current = false)}
            onPointerLeave={() => (drawing.current = false)}
            className="h-72 w-full touch-none rounded-lg border border-ink/20 bg-background"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            Size{" "}
            <input
              type="range"
              min={2}
              max={30}
              value={size}
              onChange={(e) => setSize(+e.target.value)}
              className="accent-berry"
            />
            <button onClick={undo} className="paper-card px-3 py-1">
              Undo
            </button>
            <button onClick={clear} className="paper-card px-3 py-1">
              Clear
            </button>
            <button onClick={save} className="btn-berry px-4 py-1">
              Save PNG
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
function Gallery() {
  const imgs = [
    night,
    meadow,
    gallery3,
    gallery4,
    gallery5,
    gallery6,
  ];

  const row = useRef(null);
  const scroll = (d) =>
    row.current?.scrollBy({ left: d * 300, behavior: "smooth" });
  return (
    <section id="Gallery">
      <Title
        t="Moments from Zoobi's World"
        s="Little glimpses of a colorful journey."
      />
      <div className="flex items-center gap-3">
        <button
          onClick={() => scroll(-1)}
          className="paper-card h-10 w-10 shrink-0"
        >
          ←
        </button>
        <div
          ref={row}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
        >
          {imgs.map((s, i) => (
            <div
              key={i}
              className="relative h-32 w-52 shrink-0 overflow-hidden rounded-xl shadow-md"
            >
              <img
                src={s}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />

            </div>
          ))}
        </div>
        <button
          onClick={() => scroll(1)}
          className="paper-card h-10 w-10 shrink-0"
        >
          →
        </button>
      </div>
    </section>
  );
}

function Guestbook() {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("💖");
  const [message, setMessage] = useState("");
  const [msgs, setMsgs] = useState([]);

  const emojis = ["💖", "🌸", "⭐", "🦋", "🌈", "🎨", "☁️", "✨"];

  const noteColors = [
    "#F9DCE9",
    "#E8E2FC",
    "#FFF0BD",
    "#DDF2E5",
    "#FFE3D6",
  ];

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("zoobi-guestbook") || "[]"
      );

      if (Array.isArray(saved)) setMsgs(saved);
    } catch {
      setMsgs([]);
    }

    // Keep other tabs of this browser in sync.
    function syncMessages(event) {
      if (event.key !== "zoobi-guestbook") return;

      try {
        setMsgs(JSON.parse(event.newValue || "[]"));
      } catch {
        setMsgs([]);
      }
    }

    window.addEventListener("storage", syncMessages);
    return () => window.removeEventListener("storage", syncMessages);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanMessage) return;

    const newNote = {
      id: `${Date.now()}-${Math.random()}`,
      name: cleanName,
      emoji,
      message: cleanMessage,
    };

    const updatedMessages = [newNote, ...msgs].slice(0, 40);

    try {
      localStorage.setItem(
        "zoobi-guestbook",
        JSON.stringify(updatedMessages)
      );

      setMsgs(updatedMessages);
      setName("");
      setMessage("");
      setEmoji("💖");
    } catch {
      alert("Your note couldn't be saved in this browser.");
    }
  }

  return (
    <section className="w-full">
      <div className="mb-5 text-center">
        <p className="mb-1 text-sm font-bold tracking-widest text-berry">
          ✦ LITTLE NOTES, BIG LOVE ✦
        </p>

        <h2 className="text-4xl font-bold text-ink">
          The Guestbook <span>💌</span>
        </h2>

        <p className="mt-1 opacity-80">
          Leave a little sparkle in Zoobi's world!
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="paper-card mx-auto grid max-w-4xl gap-3 p-4"
      >
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name..."
          aria-label="Your name"
          maxLength={30}
          required
          className="w-full rounded-xl border border-ink/20 bg-white/90 px-4 py-2 text-ink outline-none focus:ring-2 focus:ring-berry"
        />

        <div>
          <p className="mb-2 text-sm font-bold">Choose your little emoji</p>

          <div className="flex flex-wrap gap-2">
            {emojis.map((item) => (
              <button
                key={item}
                type="button"
                aria-label={`Choose ${item}`}
                aria-pressed={emoji === item}
                onClick={() => setEmoji(item)}
                className={`grid h-10 w-10 place-items-center rounded-full border bg-white/80 text-xl transition hover:scale-110 ${emoji === item
                  ? "border-berry ring-2 ring-berry/40"
                  : "border-ink/10"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write a little message for Zoobi..."
          aria-label="Your message"
          maxLength={240}
          rows={2}
          required
          className="w-full resize-y rounded-xl border border-ink/20 bg-white/90 px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-berry"
        />

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs opacity-60">
            {message.length}/240 characters
          </span>

          <button
            type="submit"
            className="btn-berry px-6 py-2 font-bold"
          >
            Pin my note 📌
          </button>
        </div>
      </form>

      <div className="mx-auto mt-6 max-w-5xl">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-xl font-bold text-ink">
            Notes pinned with love ♡
          </h3>

          <span className="text-sm opacity-70">
            {msgs.length} {msgs.length === 1 ? "note" : "notes"}
          </span>
        </div>

        {msgs.length === 0 ? (
          <div className="paper-card p-6 text-center">
            <p className="text-3xl">📌</p>
            <p className="mt-2 font-bold">This wall is waiting for you!</p>
            <p className="mt-1 text-sm opacity-70">
              Be the first to pin a little message.
            </p>
          </div>
        ) : (
          <div className="grid max-h-56 grid-cols-1 gap-4 overflow-y-auto p-2 sm:grid-cols-2 lg:grid-cols-3">
            {msgs.map((note, index) => {
              const rotations = [-1.5, 1.2, -0.6, 1.7, -1];

              return (
                <article
                  key={note.id}
                  className="relative min-h-32 rounded-xl px-4 pb-4 pt-6 shadow-md transition duration-200 hover:z-10 hover:scale-[1.03]"
                  style={{
                    backgroundColor:
                      noteColors[index % noteColors.length],
                    transform: `rotate(${rotations[index % rotations.length]}deg)`,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border border-white/80 bg-berry shadow-sm"
                  />

                  <p className="font-bold text-ink">
                    {note.emoji} {note.name}
                  </p>

                  <p className="mt-2 whitespace-pre-wrap break-words text-sm text-ink">
                    {note.message}
                  </p>

                  <p className="mt-3 text-right text-xs opacity-60">
                    pinned with love ♡
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
