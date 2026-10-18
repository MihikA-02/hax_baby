import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import heroBook from "@/assets/hero-book.jpg";
import parchment from "@/assets/parchment-bg.jpg";
import night from "@/assets/night.jpg";
import meadow from "@/assets/meadow.jpg";
import zoobi from "@/assets/zoobi.png";
import heroVideo from "@/assets/hero_page.mp4";
import Zoobi from "@/Zoobi";
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
const projects = [
  {
    t: "Living Coloring Book",
    d: "Turn outlines into vibrant stories.",
    img: heroBook,
  },
  {
    t: "Zoobi's Color Laboratory",
    d: "Mix, discover and create new colors.",
    img: meadow,
  },
  { t: "The Universe Canvas", d: "Sky, ocean, forest or space.", img: night },
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
  const [showVideo, setShowVideo] = useState(false);
  const [siteUnlocked, setSiteUnlocked] = useState(false);
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

      <div
        className={`transition-colors duration-500 ${dark ? "dark" : ""}`}
        style={
          dark
            ? { background: "var(--parchment)", minHeight: "100vh" }
            : {
                backgroundImage: `url(${parchment})`,
                backgroundSize: "100% auto",
                minHeight: "100vh",
              }
        }
      >
        {/* Hero – full viewport, no scroll until siteUnlocked */}
        <div
          style={!siteUnlocked ? { height: "100vh", overflow: "hidden" } : {}}
        >
          <Nav dark={dark} onToggle={() => setDark(!dark)} />
          <Hero onPlay={handlePlayClick} />
        </div>

        {/* Rest of the site – only rendered after the intro is dismissed */}
        {siteUnlocked && (
          <>
            <main className="mx-auto max-w-6xl space-y-20 px-6 py-16">
              <Origin />
              <Meet />
              <Projects />
              <Studio />
              <Gallery />
              <Guestbook />
            </main>
            <footer className="border-t border-ink/10 py-8 text-center">
              <div className="font-display text-3xl font-extrabold rainbow-text">
                Zoobi
              </div>
              <nav className="mt-2 flex justify-center gap-6 text-sm">
                {["Home", "Story", "Projects", "Art Studio", "Gallery"].map(
                  (n) => (
                    <a key={n} href={`#${n}`}>
                      {n}
                    </a>
                  ),
                )}
              </nav>
            </footer>
          </>
        )}
      </div>
    </>
  );
}
/* ─── Video Overlay ─────────────────────────────────────────────────────────── */
function VideoOverlay({ videoSrc, onEnd, onSkip }) {
  const videoRef = useRef(null);
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
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
function Nav({ dark, onToggle }) {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-8 py-4">
      <span className="font-display text-3xl font-extrabold rainbow-text drop-shadow">
        Zoobi
      </span>
      <nav className="hidden gap-8 md:flex">
        {["Home", "Story", "Projects", "Art Studio", "Gallery"].map((n, i) => (
          <a
            key={n}
            href={`#${n}`}
            className={
              i === 0 ? "border-b-2 border-ink font-bold" : "hover:text-berry"
            }
          >
            {n}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <span className="paper-card px-3 py-1">🎵</span>
        <button
          onClick={onToggle}
          aria-label="Toggle night mode"
          className="paper-card px-3 py-1 transition hover:scale-105"
        >
          {dark ? "🌙 Night" : "☀️ Day"}
        </button>
      </div>
    </header>
  );
}
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
        className="h-full w-full object-cover"
      />
      <div className="absolute left-[18%] top-[18%] w-[30%] text-center">
        <h1
          className="font-display text-6xl font-extrabold text-ink md:text-8xl"
          style={{ WebkitTextStroke: "2px var(--ink)", color: "transparent" }}
        >
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
function Origin() {
  return (
    <section id="Story">
      <Title
        t="Zoobi's Origin"
        s="From a drop of magic, a universe of colors was born..."
      />
      <div className="grid gap-6 md:grid-cols-4">
        {origin.map((o, i) => (
          <article key={o.t} className="paper-card overflow-hidden p-2">
            <img
              src={o.img}
              alt={o.t}
              loading="lazy"
              className={`h-32 w-full rounded-lg object-cover ${o.f}`}
            />
            <div className="p-3">
              <h3 className="flex items-center gap-2 font-bold">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-berry text-xs text-primary-foreground">
                  {i + 1}
                </span>
                {o.t}
              </h3>
              <p className="text-sm opacity-80">{o.d}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
function Meet() {
  return (
    <section className="grid items-center gap-8 md:grid-cols-3">
      <div>
        <h2 className="text-5xl font-bold">Meet Zoobi</h2>
        <p className="mt-2">A little creature who brings color to the world.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {traits.map((t) => (
            <span key={t} className="paper-card px-3 py-1 text-sm text-berry">
              {t}
            </span>
          ))}
        </div>
        <p className="mt-4 italic">"You see the world. I see a canvas."</p>
      </div>
      <div className="mx-auto w-full max-w-sm">
        <Zoobi />
      </div>
      <div className="paper-card rotate-2 p-6">
        <h3 className="mb-3 text-xl font-bold underline">Character Profile</h3>
        <ul className="space-y-2">
          <li>⭐ Species: Zoobi</li>
          <li>🖌️ Magic Tool: Paintbrush</li>
          <li>🏠 Home: Dreamy World</li>
          <li>🌸 Favorite: Colors, Flowers, Stars</li>
          <li>💫 Dream: To paint the whole universe!</li>
        </ul>
      </div>
    </section>
  );
}
function Projects() {
  return (
    <section id="Projects">
      <h2 className="text-4xl font-bold">Zoobi's Projects</h2>
      <p className="mb-6">Little worlds, big imagination.</p>
      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((p, i) => (
          <article
            key={p.t}
            className="paper-card group relative overflow-hidden"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={p.img}
                alt={p.t}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <img
                src={zoobi}
                alt=""
                className="absolute bottom-0 right-4 w-28"
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-bold">
                  0{i + 1}. {p.t}
                </h3>
                <p className="text-sm opacity-80">{p.d}</p>
              </div>
              <span className="btn-berry grid h-9 w-9 place-items-center">
                →
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
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
  const imgs = [meadow, night, heroBook, meadow, night, heroBook];
  const filters = [
    "",
    "",
    "sepia",
    "hue-rotate-30",
    "hue-rotate-60",
    "saturate-200",
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
                className={`h-full w-full object-cover ${filters[i]}`}
              />
              <img
                src={zoobi}
                alt=""
                className="absolute bottom-0 left-1/2 w-20 -translate-x-1/2"
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
  const [msgs, setMsgs] = useState([]);
  const [v, setV] = useState("");
  return (
    <section className="grid items-center gap-6 md:grid-cols-[1fr_3fr_1fr]">
      <div className="paper-card -rotate-6 p-4 text-center">
        💗
        <br />
        Color makes everything better
      </div>
      <div>
        <Title t="Guestbook ⭐" s="Leave a little piece of your world here." />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (v.trim()) {
              setMsgs([v, ...msgs]);
              setV("");
            }
          }}
          className="paper-card flex gap-3 p-3"
        >
          <input
            value={v}
            onChange={(e) => setV(e.target.value)}
            placeholder="Write something..."
            className="flex-1 rounded-lg border border-ink/20 bg-background px-3 py-2 outline-none"
          />
          <button className="btn-berry px-6">Post ✈</button>
        </form>
        <ul className="mt-4 space-y-2">
          {msgs.map((m, i) => (
            <li key={i} className="paper-card px-4 py-2">
              {m}
            </li>
          ))}
        </ul>
      </div>
      <div className="paper-card rotate-6 p-4 text-center">
        Thank you for being here! ♡
      </div>
    </section>
  );
}
