"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef } from "react";

export function CameraRig() {
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        scrollProgressRef.current = window.scrollY / maxScroll;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state) => {
    const p = scrollProgressRef.current;
    const targetX = state.pointer.x * 0.8;
    const targetY = state.pointer.y * 0.5;

    // Cinematic scroll camera dolly interpolation
    // Section 1 (Hero 0-0.15): z = 5.2
    // Section 2 (Impact 0.15-0.35): z = 4.4, y = -0.5
    // Section 3 (Experience 0.35-0.65): z = 5.0, y ascends
    // Section 4 (Reviews 0.65-0.85): z = 6.2 (wide constellation view)
    // Section 5 (Contact 0.85-1.0): z = 4.8
    let targetCamZ = 5.2;
    let targetCamY = 0;

    if (p < 0.2) {
      targetCamZ = THREE.MathUtils.lerp(5.2, 4.4, p / 0.2);
    } else if (p < 0.5) {
      targetCamZ = THREE.MathUtils.lerp(4.4, 5.0, (p - 0.2) / 0.3);
      targetCamY = THREE.MathUtils.lerp(0, -1.2, (p - 0.2) / 0.3);
    } else if (p < 0.8) {
      targetCamZ = THREE.MathUtils.lerp(5.0, 6.2, (p - 0.5) / 0.3);
      targetCamY = THREE.MathUtils.lerp(-1.2, 0.5, (p - 0.5) / 0.3);
    } else {
      targetCamZ = THREE.MathUtils.lerp(6.2, 4.8, (p - 0.8) / 0.2);
      targetCamY = THREE.MathUtils.lerp(0.5, 0, (p - 0.8) / 0.2);
    }

    // Smooth lerp camera movement
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY + targetY, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, 0.05);

    // Camera looks slightly toward center
    state.camera.lookAt(0, targetCamY * 0.4, 0);
  });

  return null;
}
