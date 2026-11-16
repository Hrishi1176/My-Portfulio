"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function Lighting() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    // Mouse reactive light tracking
    lightRef.current.position.x = state.pointer.x * 4;
    lightRef.current.position.y = state.pointer.y * 3 + 1;
  });

  return (
    <>
      <ambientLight intensity={0.4} color="#0f0728" />

      {/* Cyber Cyan Key Light */}
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#00f0ff" />

      {/* Electric Hyper-Violet Rim Light */}
      <directionalLight position={[-6, -4, -4]} intensity={2.0} color="#8b5cf6" />

      {/* Neon Emerald Accent Floor Light */}
      <directionalLight position={[0, -6, 2]} intensity={0.8} color="#00f5a0" />

      {/* Mouse Tracking Point Light */}
      <pointLight ref={lightRef} position={[0, 0, 4]} intensity={2.2} distance={8} color="#38bdf8" />
    </>
  );
}
