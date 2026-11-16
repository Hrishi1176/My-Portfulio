"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { soundFX } from "@/utils/audioFX";

export interface ChatbotRobotCompanionProps {
  state?: "idle" | "listening" | "responding" | "success" | "error";
  className?: string;
  isOpen?: boolean;
}

/**
 * AXIOM — Dedicated AI Chatbot Robot Companion
 * Stationed in the bottom-right corner alongside the AI assistant.
 */
export function ChatbotRobotCompanion({
  state = "idle",
  className = "",
  isOpen = false,
}: ChatbotRobotCompanionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = 140;
    const height = 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 20);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Subtle Sci-Fi Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const violetRim = new THREE.PointLight(0xa855f7, 3.5, 10);
    violetRim.position.set(2, 2, 2);
    scene.add(violetRim);

    const cyanKey = new THREE.DirectionalLight(0x00f0ff, 2.2);
    cyanKey.position.set(-2, 3, 3);
    scene.add(cyanKey);

    // AXIOM Custom PBR Materials
    const violetArmorMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x6d28d9),
      metalness: 0.82,
      roughness: 0.2,
      clearcoat: 0.9,
    });

    const whiteJointsMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xf8fafc),
      metalness: 0.3,
      roughness: 0.2,
    });

    const amberVisorMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
    });

    const visorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.12), amberVisorMat);
    visorMesh.position.set(0, 0.08, 0.11);

    // Orbiting data particles
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), particleMat);
      dot.position.set(Math.cos(angle) * 0.75, Math.sin(angle) * 0.25, Math.sin(angle) * 0.5);
      orbitGroup.add(dot);
    }

    let mixer: THREE.AnimationMixer | null = null;
    const actions: Record<string, THREE.AnimationAction> = {};
    let activeClip = "sneak_pose";
    let robotRoot: THREE.Group | null = null;

    const crossFadeTo = (targetName: string, duration = 0.3) => {
      if (activeClip === targetName) return;
      const from = actions[activeClip];
      const to = actions[targetName];
      if (to) {
        to.reset().setEffectiveWeight(1).play();
        if (from) from.crossFadeTo(to, duration, true);
        activeClip = targetName;
      }
    };

    const loader = new GLTFLoader();
    loader.load(
      "/models/robot-mecha.glb",
      (gltf) => {
        const cloned = SkeletonUtils.clone(gltf.scene) as THREE.Group;
        cloned.scale.set(0.55, 0.55, 0.55);
        cloned.position.set(0, -0.9, 0);
        cloned.rotation.y = -0.35;
        scene.add(cloned);
        robotRoot = cloned;

        const bones: Record<string, THREE.Bone> = {};
        cloned.traverse((child) => {
          if (!child) return;
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            if (m.name.includes("Surface")) m.material = violetArmorMat;
            else if (m.name.includes("Joints")) m.material = whiteJointsMat;
          }
          if ((child as THREE.Bone).isBone && child.name.includes("Head")) {
            bones.head = child as THREE.Bone;
          }
        });

        if (bones.head) {
          bones.head.add(visorMesh);
        }

        mixer = new THREE.AnimationMixer(cloned);
        if (gltf.animations) {
          gltf.animations.forEach((clip) => {
            actions[clip.name] = mixer!.clipAction(clip);
          });

          if (actions["idle"]) {
            actions["idle"].reset().setEffectiveWeight(1).play();
            activeClip = "idle";
          }
        }
      },
      undefined,
      (err) => console.error("Error loading AXIOM model:", err)
    );

    let animId: number;
    let lastTime = performance.now() * 0.001;

    const animate = () => {
      const now = performance.now() * 0.001;
      const delta = Math.min(now - lastTime, 0.05);
      lastTime = now;

      orbitGroup.rotation.y = now * 1.5;

      if (robotRoot) {
        robotRoot.position.y = -0.9 + Math.sin(now * 1.2) * 0.015;
      }

      if (mixer) {
        mixer.update(delta);

        const cur = stateRef.current;

        if (cur === "responding") {
          crossFadeTo("agree", 0.25);
        } else if (cur === "listening") {
          crossFadeTo("walk", 0.3);
        } else if (cur === "error") {
          crossFadeTo("headShake", 0.3);
        } else {
          crossFadeTo("idle", 0.35);
        }
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      violetArmorMat.dispose();
      whiteJointsMat.dispose();
      amberVisorMat.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-[96px] right-6 z-40 pointer-events-none select-none transition-all duration-300 ${className}`}
      style={{
        width: 140,
        height: 180,
      }}
      title="AXIOM — AI Chatbot Co-Pilot"
    />
  );
}

export default ChatbotRobotCompanion;
