"use client";

import { useSyncExternalStore } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { SceneManager } from "./SceneManager";

// Suppress internal R3F THREE.Clock deprecation warning until R3F migrates to THREE.Timer
if (typeof window !== "undefined" && typeof THREE.setConsoleFunction === "function") {
  THREE.setConsoleFunction((type, message, ...params) => {
    if (typeof message === "string" && message.includes("THREE.Clock: This module has been deprecated")) {
      return;
    }
    if (type === "error") console.error(message, ...params);
    else if (type === "warn") console.warn(message, ...params);
    else console.log(message, ...params);
  });
}

const emptySubscribe = () => () => {};

export function ExperienceCanvas() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#030014]" />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030014]">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        dpr={[1, Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio : 1)]}
      >
        <SceneManager />
      </Canvas>
    </div>
  );
}
