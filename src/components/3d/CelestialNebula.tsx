"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const PARTICLE_COUNT = 280;

function createDeterministicParticles(count: number) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);

  let seed = 42;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    pos[idx] = (rnd() - 0.5) * 16;
    pos[idx + 1] = (rnd() - 0.5) * 16;
    pos[idx + 2] = (rnd() - 0.5) * 10 - 2;

    const mix = rnd();
    if (mix < 0.5) {
      col[idx] = 0.54 + mix * (0.0 - 0.54);
      col[idx + 1] = 0.36 + mix * (0.94 - 0.36);
      col[idx + 2] = 0.96 + mix * (1.0 - 0.96);
    } else {
      const m2 = (mix - 0.5) * 2;
      col[idx] = 0.0;
      col[idx + 1] = 0.94 + m2 * (0.96 - 0.94);
      col[idx + 2] = 1.0 + m2 * (0.63 - 1.0);
    }
  }

  return { positions: pos, colors: col };
}

const STATIC_PARTICLES = createDeterministicParticles(PARTICLE_COUNT);

export function CelestialNebula() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.03;
    pointsRef.current.rotation.x += delta * 0.015;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[STATIC_PARTICLES.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[STATIC_PARTICLES.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}
