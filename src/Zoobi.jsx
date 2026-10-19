import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function ZoobiModel({ isBouncing, onBounceEnd }) {
  const group = useRef();
  const { scene } = useGLTF("/models/bunny_artist.glb");

  const bounceTime = useRef(0);

  useFrame(({ pointer, clock }, delta) => {
    if (!group.current) return;

    // Gentle idle floating / breathing motion
    const t = clock.getElapsedTime();
    const idleY = Math.sin(t * 1.8) * 0.08;
    const idleTilt = Math.sin(t * 1.2) * 0.04;

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
    let bounceOffset = 0;
    if (isBouncing) {
      bounceTime.current += delta * 8;
      bounceOffset = Math.sin(bounceTime.current) * 0.35;
      if (bounceTime.current >= Math.PI) {
        bounceTime.current = 0;
        onBounceEnd();
      }
    }

    group.current.position.y = idleY + bounceOffset;
  });

  return (
    <group ref={group}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

export default function Zoobi() {
  const [mounted, setMounted] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      className="zoobi-container cursor-pointer select-none"
      onClick={() => setBouncing(true)}
      title="Click Zoobi to say hello!"
    >
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
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/bunny_artist.glb");
