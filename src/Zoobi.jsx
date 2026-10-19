import { Suspense, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function ZoobiModel({ isBouncing, onBounceEnd, isSpinning, onSpinEnd, onModelClick }) {
  const group = useRef();
  const { scene } = useGLTF("/models/bunny_artist.glb");

  const bounceTime = useRef(0);
  const spinTime = useRef(0);

  useFrame(({ pointer, clock }, delta) => {
    if (!group.current) return;

    // Gentle idle floating / breathing motion
    const t = clock.getElapsedTime();
    const idleY = Math.sin(t * 1.8) * 0.08;
    const idleTilt = Math.sin(t * 1.2) * 0.04;

    let bounceOffset = 0;

    if (isSpinning) {
      // 3D Easter egg reaction: joyful 360-degree spin + bounce
      spinTime.current += delta;
      group.current.rotation.y += delta * 14;
      bounceOffset = Math.sin((spinTime.current / 0.8) * Math.PI) * 0.55;

      if (spinTime.current >= 0.8) {
        spinTime.current = 0;
        onSpinEnd();
      }
    } else {
      // Follow the cursor
      const targetY = pointer.x * 0.65 + idleTilt;
      const targetX = -pointer.y * 0.25;

      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        targetY,
        4,
        delta,
      );

      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        targetX,
        4,
        delta,
      );

      // Click bounce reaction
      if (isBouncing) {
        bounceTime.current += delta * 8;
        bounceOffset = Math.sin(bounceTime.current) * 0.35;
        if (bounceTime.current >= Math.PI) {
          bounceTime.current = 0;
          onBounceEnd();
        }
      }
    }

    group.current.position.y = idleY + bounceOffset;
  });

  return (
    <group
      ref={group}
      onClick={(e) => {
        e.stopPropagation();
        onModelClick();
      }}
    >
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

function ParticleBurst({ active, onDone }) {
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => {
      onDone();
    }, 1200);
    return () => clearTimeout(t);
  }, [active, onDone]);

  if (!active) return null;

  const rawParticles = [
    { char: "✦", color: "#f4a6cf", angle: 15, dist: 90 },
    { char: "★", color: "#f8d875", angle: 50, dist: 120 },
    { char: "✧", color: "#b9a5f7", angle: 85, dist: 95 },
    { char: "✴", color: "#91d9f2", angle: 125, dist: 130 },
    { char: "🌸", color: "#f4a6cf", angle: 165, dist: 105 },
    { char: "✵", color: "#a9dfb0", angle: 205, dist: 115 },
    { char: "★", color: "#f8d875", angle: 245, dist: 100 },
    { char: "✦", color: "#b9a5f7", angle: 285, dist: 135 },
    { char: "✨", color: "#f4a6cf", angle: 325, dist: 110 },
    { char: "✧", color: "#91d9f2", angle: 355, dist: 90 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center z-30">
      {rawParticles.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const driftX = Math.round(Math.cos(rad) * p.dist);
        const driftY = Math.round(Math.sin(rad) * p.dist);
        return (
          <span
            key={i}
            className="zoobi-secret-particle"
            style={{
              "--p-color": p.color,
              "--p-drift-x": `${driftX}px`,
              "--p-drift-y": `${driftY}px`,
              animationDelay: `${i * 30}ms`,
            }}
          >
            {p.char}
          </span>
        );
      })}
    </div>
  );
}

function SecretModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="zoobi-secret-title"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-[#110e26]/65 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border-2 border-[#edc5d9] bg-[#fffaf3] p-6 sm:p-8 shadow-2xl text-center select-none"
        style={{
          boxShadow:
            "0 20px 50px -10px rgba(220, 76, 155, 0.35), 0 10px 25px -5px rgba(67, 56, 120, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top-Right */}
        <button
          onClick={onClose}
          aria-label="Close secret"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-[#514582]/70 hover:bg-[#ffe2ee] hover:text-[#dc4c9b] transition-colors"
        >
          ✕
        </button>

        {/* Decorative Stars Badge */}
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffe2ee] text-2xl shadow-inner animate-bounce">
          ✨
        </div>

        {/* Title */}
        <h3
          id="zoobi-secret-title"
          className="font-display text-2xl sm:text-3xl font-extrabold text-[#514582]"
        >
          Psst… you found my little secret!
        </h3>

        {/* Story Secret Parchment Card */}
        <div className="my-5 rounded-2xl border border-[#edc5d9]/80 bg-[#fff5ea] p-5 text-left shadow-sm">
          <p className="font-hand text-lg sm:text-xl text-[#3b2a40] leading-relaxed">
            “Before I came along, the universe was a blank canvas. Then I painted
            the very first star… and its colours travelled across the sky,
            waking up flowers, oceans, rainbows and distant worlds. And now you
            know how my colourful world began. Shhh… it's our little secret!”
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#dc4c9b] to-[#7f52ff] px-6 py-2.5 font-display text-base font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc4c9b]"
        >
          <span>Return to my world 🌸</span>
        </button>
      </div>
    </div>,
    document.body
  );
}

export default function Zoobi() {
  const [mounted, setMounted] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [particlesActive, setParticlesActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const clickTimes = useRef([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleModelClick() {
    if (modalOpen) return;

    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    // Keep clicks from the last 2000ms
    const recent = clickTimes.current.filter((t) => now - t <= 2000);
    recent.push(now);
    clickTimes.current = recent;

    if (recent.length >= 3) {
      // Secret Easter Egg triggered!
      clickTimes.current = [];
      setSpinning(true);
      setParticlesActive(true);
      setModalOpen(true);
    } else {
      // Ordinary click: normal bounce reaction
      setBouncing(true);
    }
  }

  function handleCloseModal() {
    setModalOpen(false);
    clickTimes.current = [];
  }

  if (!mounted) {
    return (
      <div className="zoobi-container flex items-center justify-center">
        <div className="animate-pulse text-sm opacity-60 font-display">
          Summoning Zoobi... 🎨
        </div>
      </div>
    );
  }

  return (
    <div
      className="zoobi-container relative cursor-pointer select-none"
      title="Click Zoobi to say hello!"
    >
      <ParticleBurst
        active={particlesActive}
        onDone={() => setParticlesActive(false)}
      />

      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[3, 5, 5]} intensity={2.5} />
        <directionalLight position={[-4, 2, -3]} intensity={1} />

        <Suspense fallback={null}>
          <ZoobiModel
            isBouncing={bouncing}
            onBounceEnd={() => setBouncing(false)}
            isSpinning={spinning}
            onSpinEnd={() => setSpinning(false)}
            onModelClick={handleModelClick}
          />
        </Suspense>
      </Canvas>

      <SecretModal isOpen={modalOpen} onClose={handleCloseModal} />
    </div>
  );
}

useGLTF.preload("/models/bunny_artist.glb");
