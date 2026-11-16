"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { RobotUiState, ActiveFormField, RobotModelType } from "@/context/RobotCompanionContext";

export interface ThreeRobotCompanionProps {
  state?: RobotUiState;
  activeField?: ActiveFormField;
  mode?: "screen-roam" | "inline";
  modelType?: RobotModelType;
  className?: string;
  style?: React.CSSProperties;
}

function createBrandEmblemTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const bgGrad = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
    bgGrad.addColorStop(0, "#0f172a");
    bgGrad.addColorStop(0.85, "#020617");
    bgGrad.addColorStop(1, "#000000");
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(256, 256, 250, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(256, 256, 230, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(256, 256, 205, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 6;
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const x1 = 256 + Math.cos(angle) * 205;
      const y1 = 256 + Math.sin(angle) * 205;
      const x2 = 256 + Math.cos(angle) * 230;
      const y2 = 256 + Math.sin(angle) * 230;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 160px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 30;
    ctx.fillText("HB", 256, 235);

    ctx.font = "bold 32px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.fillStyle = "#38bdf8";
    ctx.shadowBlur = 10;
    ctx.fillText("AI // ARCH", 256, 340);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function ThreeRobotCompanion({
  state = "idle",
  activeField = "none",
  mode = "screen-roam",
  modelType = "squad",
  className = "",
  style,
}: ThreeRobotCompanionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef(state);
  const activeFieldRef = useRef(activeField);
  const modeRef = useRef(mode);
  const modelTypeRef = useRef<RobotModelType>(modelType);
  const updateModelAppearanceRef = useRef<((type: RobotModelType) => void) | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    activeFieldRef.current = activeField;
  }, [activeField]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    modelTypeRef.current = modelType;
    if (updateModelAppearanceRef.current) {
      updateModelAppearanceRef.current(modelType);
    }
  }, [modelType]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isRoaming = modeRef.current === "screen-roam";
    let width = isRoaming ? window.innerWidth : container.clientWidth || 360;
    let height = isRoaming ? window.innerHeight : container.clientHeight || 360;
    const isMobile = width < 768;

    // 1. Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, isRoaming ? (isMobile ? 8.6 : 7.2) : 5.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. Photorealistic Studio Environment (PMREM RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;

    // Dynamic Multi-Source Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    mainKeyLight.position.set(6, 10, 8);
    scene.add(mainKeyLight);

    const cyanRimLight = new THREE.PointLight(0x00f0ff, 5.0, 20);
    cyanRimLight.position.set(-6, 0, 4);
    scene.add(cyanRimLight);

    const purpleAccentLight = new THREE.PointLight(0xa855f7, 4.0, 16);
    purpleAccentLight.position.set(6, -1, 4);
    scene.add(purpleAccentLight);

    // 3. Hierarchy Roots
    const circusRoot = new THREE.Group();
    scene.add(circusRoot);

    const alphaRoot = new THREE.Group();
    const betaRoot = new THREE.Group();
    circusRoot.add(alphaRoot);
    circusRoot.add(betaRoot);

    const updateScales = () => {
      const mob = window.innerWidth < 768;
      const alphaScale = isRoaming ? (mob ? 0.54 : 0.8) : 0.95;
      const betaScale = isRoaming ? (mob ? 0.46 : 0.68) : 0.85;
      alphaRoot.scale.set(alphaScale, alphaScale, alphaScale);
      betaRoot.scale.set(betaScale, betaScale, betaScale);
    };
    updateScales();

    // 4. Asset Loaders: Personal Monogram Emblem
    const brandTexture = createBrandEmblemTexture();

    // 5. Materials
    const pearlCeramicMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf8fafc),
      metalness: 0.15,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
      envMapIntensity: 2.2,
    });

    const obsidianChassisMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x070b14),
      metalness: 0.95,
      roughness: 0.18,
      envMapIntensity: 2.4,
    });

    const goldArmorMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.92,
      roughness: 0.22,
      envMapIntensity: 2.5,
    });

    const titaniumArmorMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x1e293b),
      metalness: 0.88,
      roughness: 0.22,
      clearcoat: 0.8,
      clearcoatRoughness: 0.08,
      envMapIntensity: 2.5,
    });

    const cyanGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.95,
    });

    const amberGlowMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.95,
    });

    // Aero Scout Drone
    const droneRoot = new THREE.Group();
    droneRoot.visible = false;
    scene.add(droneRoot);

    const droneBody = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 16), obsidianChassisMat);
    droneBody.scale.set(1.35, 0.55, 0.85);
    droneRoot.add(droneBody);

    const droneShell = new THREE.Mesh(new THREE.SphereGeometry(0.23, 24, 16), pearlCeramicMat);
    droneShell.scale.set(1.2, 0.52, 0.78);
    droneShell.position.set(0, 0.04, 0);
    droneRoot.add(droneShell);

    const droneEye = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.035, 0.05), cyanGlowMat);
    droneEye.position.set(0, 0.03, 0.2);
    droneRoot.add(droneEye);

    // 3D Laser Scanning Cones (Active Form Assist)
    const makeLaserCone = () => {
      const coneGeom = new THREE.ConeGeometry(0.85, 3.2, 24, 1, true);
      coneGeom.translate(0, -1.6, 0);
      const coneMesh = new THREE.Mesh(
        coneGeom,
        new THREE.MeshBasicMaterial({
          color: 0x00f0ff,
          transparent: true,
          opacity: 0.38,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        })
      );
      coneMesh.visible = false;
      return coneMesh;
    };

    const laserConeAlpha = makeLaserCone();
    const laserConeBeta = makeLaserCone();
    alphaRoot.add(laserConeAlpha);
    betaRoot.add(laserConeBeta);

    // Ambient Stardust Sparks
    const particleCount = 75;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 9;
      particlePositions[i + 1] = (Math.random() - 0.5) * 7;
      particlePositions[i + 2] = (Math.random() - 0.5) * 5;
    }
    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particleGeom,
      new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.045,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(particles);

    // 6. Load Rigged Model & Build Dual Clones
    let alphaMixer: THREE.AnimationMixer | null = null;
    let betaMixer: THREE.AnimationMixer | null = null;
    const alphaActions: Record<string, THREE.AnimationAction> = {};
    const betaActions: Record<string, THREE.AnimationAction> = {};
    let activeAlphaAction = "walk";
    let activeBetaAction = "walk";

    let alphaHead: THREE.Bone | null = null;
    let alphaNeck: THREE.Bone | null = null;
    let alphaSpine: THREE.Bone | null = null;

    let betaHead: THREE.Bone | null = null;
    let betaNeck: THREE.Bone | null = null;

    const haloGroup = new THREE.Group();
    const reactorGroup = new THREE.Group();

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      "/models/robot-mecha.glb",
      (gltf) => {
        // --- Setup Alpha (Titan Base Mech) ---
        const modelAlpha = gltf.scene;
        modelAlpha.position.set(0, -1.6, 0);
        alphaRoot.add(modelAlpha);

        modelAlpha.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            if (mesh.name === "Beta_Surface" || mesh.name.includes("Surface")) {
              mesh.material = titaniumArmorMat;
            } else if (mesh.name === "Beta_Joints" || mesh.name.includes("Joints")) {
              mesh.material = obsidianChassisMat;
            }
          }
          if ((child as THREE.Bone).isBone) {
            const bone = child as THREE.Bone;
            if (bone.name.includes("Head")) alphaHead = bone;
            if (bone.name.includes("Neck")) alphaNeck = bone;
            if (bone.name.includes("Spine2") || bone.name.includes("Spine1")) alphaSpine = bone;
          }
        });

        // Alpha Accessories: Arc Reactor & Personal Monogram Badge
        const chestTarget = alphaSpine || modelAlpha;
        const logoBadgeGroup = new THREE.Group();
        logoBadgeGroup.position.set(0.12, 0.18, 0.15);
        logoBadgeGroup.rotation.set(-0.15, 0.2, 0);
        const logoPlane = new THREE.Mesh(
          new THREE.CircleGeometry(0.065, 32),
          new THREE.MeshBasicMaterial({ map: brandTexture, transparent: true })
        );
        logoBadgeGroup.add(logoPlane);
        const logoGoldRing = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.008, 12, 32), goldArmorMat);
        logoBadgeGroup.add(logoGoldRing);
        chestTarget.add(logoBadgeGroup);

        reactorGroup.position.set(0, 0.14, 0.17);
        reactorGroup.add(new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.012, 16, 32), goldArmorMat));
        const reactorCore = new THREE.Mesh(new THREE.CircleGeometry(0.048, 24), amberGlowMat);
        reactorCore.position.set(0, 0, 0.005);
        reactorGroup.add(reactorCore);
        chestTarget.add(reactorGroup);

        // --- Setup Beta (Acrobat via SkeletonUtils.clone) ---
        const modelBeta = SkeletonUtils.clone(gltf.scene) as THREE.Group;
        modelBeta.position.set(0, -1.6, 0);
        betaRoot.add(modelBeta);

        modelBeta.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            if (mesh.name === "Beta_Surface" || mesh.name.includes("Surface")) {
              mesh.material = pearlCeramicMat;
            } else if (mesh.name === "Beta_Joints" || mesh.name.includes("Joints")) {
              mesh.material = obsidianChassisMat;
            }
          }
          if ((child as THREE.Bone).isBone) {
            const bone = child as THREE.Bone;
            if (bone.name.includes("Head")) betaHead = bone;
            if (bone.name.includes("Neck")) betaNeck = bone;
          }
        });

        // Beta Accessories: Halo Crest & Tie Clip
        if (betaHead) {
          haloGroup.position.set(0, 0.18, -0.22);
          haloGroup.rotation.x = Math.PI / 4;
          haloGroup.add(new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.012, 16, 48), cyanGlowMat));
          for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2 + Math.PI / 4;
            const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, 0.035), goldArmorMat);
            clamp.position.set(Math.cos(angle) * 0.24, Math.sin(angle) * 0.24, 0);
            clamp.rotation.z = angle;
            haloGroup.add(clamp);
          }
          (betaHead as THREE.Bone).add(haloGroup);
        }

        if (betaNeck) {
          const collar = new THREE.Group();
          collar.position.set(0, 0.05, 0.08);
          const tieClip = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.16, 0.025), goldArmorMat);
          tieClip.position.set(0, -0.06, 0.08);
          collar.add(tieClip);
          (betaNeck as THREE.Bone).add(collar);
        }

        // --- Animation Mixers Setup ---
        if (gltf.animations && gltf.animations.length > 0) {
          alphaMixer = new THREE.AnimationMixer(modelAlpha);
          betaMixer = new THREE.AnimationMixer(modelBeta);

          gltf.animations.forEach((clip) => {
            alphaActions[clip.name] = alphaMixer!.clipAction(clip);
            betaActions[clip.name] = betaMixer!.clipAction(clip);
          });

          if (alphaActions["walk"]) {
            alphaActions["walk"].setEffectiveWeight(1.0).play();
            activeAlphaAction = "walk";
          }
          if (betaActions["walk"]) {
            betaActions["walk"].setEffectiveWeight(1.0).play();
            activeBetaAction = "walk";
          }
        }

        const applyModelAppearance = (type: RobotModelType) => {
          if (type === "sentinel") {
            alphaRoot.visible = true;
            betaRoot.visible = false;
            droneRoot.visible = false;
          } else if (type === "eve") {
            alphaRoot.visible = false;
            betaRoot.visible = true;
            droneRoot.visible = false;
          } else if (type === "scout") {
            alphaRoot.visible = false;
            betaRoot.visible = false;
            droneRoot.visible = true;
          } else {
            alphaRoot.visible = true;
            betaRoot.visible = true;
            droneRoot.visible = false;
          }
        };

        updateModelAppearanceRef.current = applyModelAppearance;
        applyModelAppearance(modelTypeRef.current);
      },
      undefined,
      (err) => console.error("Error loading GLB model:", err)
    );

    // 7. Pointer Tracking
    let targetMousePixelX = window.innerWidth / 2;
    let targetMousePixelY = window.innerHeight / 2;
    let currentMousePixelX = targetMousePixelX;
    let currentMousePixelY = targetMousePixelY;
    let lastPointerTime = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      lastPointerTime = performance.now() * 0.001;
      let cx = 0;
      let cy = 0;
      if ("touches" in e && e.touches.length > 0) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else if ("clientX" in e) {
        cx = (e as MouseEvent).clientX;
        cy = (e as MouseEvent).clientY;
      }
      targetMousePixelX = cx;
      targetMousePixelY = cy;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchstart", handlePointerMove, { passive: true });

    // 8. Zero-Allocation Scratch Vectors
    const _scratchV = new THREE.Vector3();
    const _scratchDir = new THREE.Vector3();
    const _scratchTarget = new THREE.Vector3();
    const _scratchHeadWorldPos = new THREE.Vector3();
    const _scratchAimDir = new THREE.Vector3();
    const _scratchDomTarget = new THREE.Vector3();

    const screenToWorld = (pixelX: number, pixelY: number, targetZ = 0, out = _scratchTarget): THREE.Vector3 => {
      const ndcX = (pixelX / window.innerWidth) * 2 - 1;
      const ndcY = -(pixelY / window.innerHeight) * 2 + 1;
      _scratchV.set(ndcX, ndcY, 0.5);
      _scratchV.unproject(camera);
      _scratchDir.copy(_scratchV).sub(camera.position).normalize();
      const dist = (targetZ - camera.position.z) / _scratchDir.z;
      out.copy(camera.position).addScaledVector(_scratchDir, dist);
      return out;
    };

    const getActiveDomTarget = (field: ActiveFormField): THREE.Vector3 | null => {
      if (field === "none" || typeof document === "undefined") return null;
      let sel = "";
      if (field === "name") sel = 'input[name="name"], #contact-name';
      else if (field === "email") sel = 'input[type="email"], input[name="email"]';
      else if (field === "requirements") sel = 'textarea[name="requirements"], #contact-requirements';
      else if (field === "chat") sel = 'input[placeholder*="Ask"], #ai-chat-input';

      const el = document.querySelector(sel);
      if (!el) return null;

      const rect = el.getBoundingClientRect();
      const mobileMode = window.innerWidth < 768;
      const targetPixelX = mobileMode ? rect.left + rect.width / 2 : rect.right + 85;
      const targetPixelY = mobileMode ? rect.top - 120 : rect.top + rect.height / 2;

      return screenToWorld(targetPixelX, targetPixelY, 0.8, _scratchDomTarget);
    };

    const handleResize = () => {
      if (!container) return;
      const isRoam = modeRef.current === "screen-roam";
      width = isRoam ? window.innerWidth : container.clientWidth || 360;
      height = isRoam ? window.innerHeight : container.clientHeight || 360;
      const mob = width < 768;

      camera.aspect = width / height;
      camera.position.z = isRoam ? (mob ? 8.6 : 7.2) : 5.4;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      updateScales();
    };

    window.addEventListener("resize", handleResize);

    // 9. Animation Loop (High-precision timer without THREE.Clock)
    let lastTime = performance.now() * 0.001;
    let animationFrameId: number;

    const crossFadeAction = (
      actions: Record<string, THREE.AnimationAction>,
      activeName: string,
      targetName: string,
      duration = 0.35
    ): string => {
      if (activeName === targetName) return activeName;
      const from = actions[activeName];
      const to = actions[targetName];
      if (to) {
        to.reset();
        to.enabled = true;
        to.setEffectiveWeight(1);
        to.play();
        if (from) {
          from.crossFadeTo(to, duration, true);
        }
        return targetName;
      }
      return activeName;
    };

    const alphaPos = new THREE.Vector3(-1.5, -1.8, 0.22);
    const betaPos = new THREE.Vector3(1.5, -1.8, -0.15);

    let wasInError = false;
    const errorAnchorAlpha = new THREE.Vector3();
    const errorAnchorBeta = new THREE.Vector3();

    const normalCyan = new THREE.Color(0x00f0ff);
    const alertCoral = new THREE.Color(0xef4444);
    const successEmerald = new THREE.Color(0x10b981);
    const currentGlowColor = new THREE.Color(0x00f0ff);

    const animate = () => {
      if (!document.hasFocus() && document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const currentTime = performance.now() * 0.001;
      const rawDelta = currentTime - lastTime;
      lastTime = currentTime;
      const delta = Math.min(rawDelta, 0.033);
      const time = currentTime;

      currentMousePixelX += (targetMousePixelX - currentMousePixelX) * 0.08;
      currentMousePixelY += (targetMousePixelY - currentMousePixelY) * 0.08;
      const normMouseX = (currentMousePixelX / width) * 2 - 1;

      if (alphaMixer) alphaMixer.update(delta);
      if (betaMixer) betaMixer.update(delta);

      const boundY = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const boundX = boundY * camera.aspect;
      const mobileMode = width < 768;

      const currentField = activeFieldRef.current;
      const currentState = stateRef.current;
      const domTarget = getActiveDomTarget(currentField);

      particles.rotation.y += 0.0012;

      const rangeX = boundX * (mobileMode ? 0.82 : 0.88);
      const rangeY = boundY * (mobileMode ? 0.78 : 0.82);

      let desiredAlphaAction = "walk";
      let desiredBetaAction = "walk";

      const targetAlphaPos = new THREE.Vector3();
      const targetBetaPos = new THREE.Vector3();

      let targetHeadingAlpha = 0;
      let targetHeadingBeta = 0;

      let postureAlphaX = -0.04;
      let postureAlphaZ = 0;
      let postureBetaX = -0.04;
      let postureBetaZ = 0;

      const isUserInteracting = time - lastPointerTime < 3.0;

      if (domTarget) {
        wasInError = false;
        targetAlphaPos.set(-boundX * 0.45, -boundY * 0.45, 0.25);
        targetBetaPos.copy(domTarget);
        desiredAlphaAction = "idle";
        desiredBetaAction = "idle";
        targetHeadingAlpha = normMouseX * 0.25;
        targetHeadingBeta = normMouseX * 0.25;
      } else if (currentState === "success") {
        wasInError = false;
        targetAlphaPos.set(-0.6, 0, 0.25);
        targetBetaPos.set(0.6, 0, -0.15);
        desiredAlphaAction = "agree";
        desiredBetaAction = "agree";
      } else if (currentState === "error") {
        if (!wasInError) {
          wasInError = true;
          errorAnchorAlpha.copy(alphaPos);
          errorAnchorBeta.copy(betaPos);
          if (alphaActions["headShake"]) alphaActions["headShake"].setEffectiveTimeScale(0.9);
          if (betaActions["headShake"]) betaActions["headShake"].setEffectiveTimeScale(1.06);
        }

        const errorBreathA = Math.sin(time * 2.2) * 0.025;
        const errorBreathB = Math.cos(time * 2.2) * 0.025;
        targetAlphaPos.set(errorAnchorAlpha.x, errorAnchorAlpha.y + errorBreathA, errorAnchorAlpha.z);
        targetBetaPos.set(errorAnchorBeta.x, errorAnchorBeta.y + errorBreathB, errorAnchorBeta.z);

        desiredAlphaAction = "headShake";
        desiredBetaAction = "headShake";

        targetHeadingAlpha = normMouseX * 0.06;
        targetHeadingBeta = normMouseX * 0.06;

        postureAlphaX = 0.05;
        postureAlphaZ = -0.025;
        postureBetaX = 0.04;
        postureBetaZ = 0.025;
      } else {
        wasInError = false;
        const alphaSpeed = 0.38;
        const alphaT = time * alphaSpeed;
        const alphaBaseX = Math.sin(alphaT) * (rangeX * 0.85) + Math.cos(alphaT * 0.38) * (rangeX * 0.12);
        const alphaBaseY = Math.cos(alphaT * 0.62) * (rangeY * 0.82) + Math.sin(alphaT * 1.15) * (rangeY * 0.1);

        const betaSpeed = 0.42;
        const betaT = time * betaSpeed + Math.PI;
        const betaBaseX = Math.sin(betaT) * (rangeX * 0.85) + Math.sin(betaT * 0.32) * (rangeX * 0.12);
        const betaBaseY = -Math.cos(betaT * 0.58) * (rangeY * 0.82) + Math.cos(betaT * 1.2) * (rangeY * 0.1);

        if (isUserInteracting) {
          screenToWorld(currentMousePixelX, currentMousePixelY, 0.2, _scratchTarget);
          const cursorX = THREE.MathUtils.clamp(_scratchTarget.x, -rangeX, rangeX);
          const cursorY = THREE.MathUtils.clamp(_scratchTarget.y, -rangeY, rangeY);

          targetAlphaPos.x = THREE.MathUtils.lerp(alphaBaseX, cursorX - boundX * 0.22, 0.45);
          targetAlphaPos.y = THREE.MathUtils.lerp(alphaBaseY, cursorY, 0.45);
          targetAlphaPos.z = 0.25;

          targetBetaPos.x = THREE.MathUtils.lerp(betaBaseX, cursorX + boundX * 0.22, 0.45);
          targetBetaPos.y = THREE.MathUtils.lerp(betaBaseY, cursorY, 0.45);
          targetBetaPos.z = -0.15;
        } else {
          targetAlphaPos.set(alphaBaseX, alphaBaseY, 0.25);
          targetBetaPos.set(betaBaseX, betaBaseY, -0.15);
        }

        // Avoid blocking the Hero Profile Avatar on desktop
        const isNearHeroTop = typeof window !== "undefined" && window.scrollY < 700;
        if (!mobileMode && isNearHeroTop) {
          // If Beta enters the avatar area (top-right quadrant), push it below the avatar disc
          if (targetBetaPos.x > boundX * 0.12 && targetBetaPos.y > -boundY * 0.35) {
            targetBetaPos.y = -boundY * 0.42;
          }
          // If Alpha enters the avatar area, keep it toward the left
          if (targetAlphaPos.x > boundX * 0.12 && targetAlphaPos.y > -boundY * 0.35) {
            targetAlphaPos.x = boundX * 0.05;
          }
        }

        desiredAlphaAction = "walk";
        desiredBetaAction = "walk";

        const vAx = targetAlphaPos.x - alphaPos.x;
        const vBx = targetBetaPos.x - betaPos.x;

        targetHeadingAlpha = THREE.MathUtils.clamp(Math.atan2(vAx, 1.4), -0.65, 0.65);
        targetHeadingBeta = THREE.MathUtils.clamp(Math.atan2(vBx, 1.4), -0.65, 0.65);
      }

      const crossFadeDuration =
        currentState === "error" || activeAlphaAction === "headShake" || activeBetaAction === "headShake"
          ? 0.55
          : 0.32;
      activeAlphaAction = crossFadeAction(alphaActions, activeAlphaAction, desiredAlphaAction, crossFadeDuration);
      activeBetaAction = crossFadeAction(betaActions, activeBetaAction, desiredBetaAction, crossFadeDuration);

      const posLerpRate = currentState === "error" ? 0.05 : 0.08;
      alphaPos.lerp(targetAlphaPos, posLerpRate);
      betaPos.lerp(targetBetaPos, posLerpRate);

      alphaRoot.position.copy(alphaPos);
      betaRoot.position.copy(betaPos);

      alphaRoot.rotation.y = THREE.MathUtils.lerp(alphaRoot.rotation.y, targetHeadingAlpha, 0.08);
      betaRoot.rotation.y = THREE.MathUtils.lerp(betaRoot.rotation.y, targetHeadingBeta, 0.08);

      alphaRoot.rotation.x = THREE.MathUtils.lerp(alphaRoot.rotation.x, postureAlphaX, 0.06);
      alphaRoot.rotation.z = THREE.MathUtils.lerp(alphaRoot.rotation.z, postureAlphaZ, 0.06);
      betaRoot.rotation.x = THREE.MathUtils.lerp(betaRoot.rotation.x, postureBetaX, 0.06);
      betaRoot.rotation.z = THREE.MathUtils.lerp(betaRoot.rotation.z, postureBetaZ, 0.06);

      const targetGlowColor =
        currentState === "error" ? alertCoral : currentState === "success" ? successEmerald : normalCyan;
      currentGlowColor.lerp(targetGlowColor, 0.05);
      cyanGlowMat.color.copy(currentGlowColor);
      cyanRimLight.color.copy(currentGlowColor);

      // Automated Formation Cycling (Squad / Sentinel / Eve)
      const autoPeriod = 80.0;
      const cycleTime = time % autoPeriod;

      if (modelTypeRef.current === "squad") {
        if (cycleTime < 30.0) {
          alphaRoot.visible = true;
          betaRoot.visible = true;
          droneRoot.visible = false;
        } else if (cycleTime < 55.0) {
          alphaRoot.visible = true;
          betaRoot.visible = false;
          droneRoot.visible = true;

          const escortX = alphaPos.x + 0.65 + Math.sin(time * 2.0) * 0.12;
          const escortY = alphaPos.y + 0.85 + Math.cos(time * 2.5) * 0.08;
          droneRoot.position.set(escortX, escortY, alphaPos.z + 0.25);
          droneRoot.rotation.z = -THREE.MathUtils.clamp(targetHeadingAlpha * 0.35, -0.22, 0.22);
          droneRoot.rotation.y = Math.sin(time * 0.8) * 0.25;
        } else {
          alphaRoot.visible = false;
          betaRoot.visible = true;
          droneRoot.visible = true;

          const escortX = betaPos.x - 0.65 + Math.sin(time * 2.0) * 0.12;
          const escortY = betaPos.y + 0.85 + Math.cos(time * 2.5) * 0.08;
          droneRoot.position.set(escortX, escortY, betaPos.z + 0.25);
          droneRoot.rotation.z = -THREE.MathUtils.clamp(targetHeadingBeta * 0.35, -0.22, 0.22);
          droneRoot.rotation.y = -Math.sin(time * 0.8) * 0.25;
        }
      }

      // Dynamic Bone IK Look-At
      const isPerformingHeadGesture =
        currentState === "error" ||
        currentState === "success" ||
        desiredAlphaAction === "headShake" ||
        desiredBetaAction === "headShake";

      if (!isPerformingHeadGesture) {
        screenToWorld(currentMousePixelX, currentMousePixelY, 0, _scratchTarget);

        if (alphaHead && alphaNeck) {
          (alphaHead as THREE.Bone).getWorldPosition(_scratchHeadWorldPos);
          _scratchAimDir.copy(_scratchTarget).sub(_scratchHeadWorldPos).normalize();
          const yawA = Math.atan2(_scratchAimDir.x, _scratchAimDir.z);
          const pitchA = -Math.asin(Math.max(-0.95, Math.min(0.95, _scratchAimDir.y)));
          (alphaHead as THREE.Bone).rotation.y = THREE.MathUtils.lerp((alphaHead as THREE.Bone).rotation.y, yawA * 0.65, 0.12);
          (alphaHead as THREE.Bone).rotation.x = THREE.MathUtils.lerp((alphaHead as THREE.Bone).rotation.x, pitchA * 0.55, 0.12);
          (alphaNeck as THREE.Bone).rotation.y = THREE.MathUtils.lerp((alphaNeck as THREE.Bone).rotation.y, yawA * 0.25, 0.1);
        }

        if (betaHead && betaNeck) {
          (betaHead as THREE.Bone).getWorldPosition(_scratchHeadWorldPos);
          _scratchAimDir.copy(_scratchTarget).sub(_scratchHeadWorldPos).normalize();
          const yawB = Math.atan2(_scratchAimDir.x, _scratchAimDir.z);
          const pitchB = -Math.asin(Math.max(-0.95, Math.min(0.95, _scratchAimDir.y)));
          (betaHead as THREE.Bone).rotation.y = THREE.MathUtils.lerp((betaHead as THREE.Bone).rotation.y, yawB * 0.65, 0.12);
          (betaHead as THREE.Bone).rotation.x = THREE.MathUtils.lerp((betaHead as THREE.Bone).rotation.x, pitchB * 0.55, 0.12);
          (betaNeck as THREE.Bone).rotation.y = THREE.MathUtils.lerp((betaNeck as THREE.Bone).rotation.y, yawB * 0.25, 0.1);
        }
      }

      // Laser Scan Cones on active form fields or verifying
      if (currentField !== "none" || currentState === "verifying") {
        laserConeAlpha.visible = true;
        laserConeBeta.visible = true;
        laserConeAlpha.rotation.y = time * 2.2;
        laserConeBeta.rotation.y = -time * 2.2;
      } else {
        laserConeAlpha.visible = false;
        laserConeBeta.visible = false;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 10. Strict Cleanup Routine
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchstart", handlePointerMove);
      window.removeEventListener("resize", handleResize);

      pmremGenerator.dispose();
      roomEnv.dispose();
      pearlCeramicMat.dispose();
      obsidianChassisMat.dispose();
      goldArmorMat.dispose();
      cyanGlowMat.dispose();
      titaniumArmorMat.dispose();
      amberGlowMat.dispose();
      particleGeom.dispose();
      brandTexture.dispose();
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const isRoaming = mode === "screen-roam";

  return (
    <div
      ref={containerRef}
      className={`tech-robot-companion-container ${className}`}
      style={{
        position: isRoaming ? "fixed" : "relative",
        top: isRoaming ? 0 : undefined,
        left: isRoaming ? 0 : undefined,
        right: isRoaming ? 0 : undefined,
        bottom: isRoaming ? 0 : undefined,
        width: isRoaming ? "100vw" : "100%",
        height: isRoaming ? "100vh" : "100%",
        minHeight: isRoaming ? undefined : 300,
        pointerEvents: "none",
        zIndex: isRoaming ? 20 : 2,
        overflow: "hidden",
        ...style,
      }}
    />
  );
}

export default ThreeRobotCompanion;
