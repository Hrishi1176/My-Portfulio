"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import {
  RobotUiState,
  ActiveFormField,
  RobotModelType,
  RobotAgentId,
  useRobotCompanion,
} from "@/context/RobotCompanionContext";
import { soundFX } from "@/utils/audioFX";
import { RobotAnimController } from "@/lib/RobotAnimationController";
import { RobotPathNavigator } from "@/lib/RobotPathNavigator";
import { RobotProceduralLayer } from "@/lib/RobotProceduralLayer";
import { RobotInteractionDirector, SCENE_09_FINALE } from "@/lib/RobotInteractionDirector";
import { CinematicCameraDirector } from "@/lib/CinematicCameraDirector";
import { Robot360SpinDirector } from "@/lib/Robot360SpinDirector";
import { RobotSceneActivityDirector } from "@/lib/RobotSceneActivityDirector";

// Suppress internal R3F THREE.Clock deprecation warning
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

export interface ThreeRobotCompanionProps {
  state?: RobotUiState;
  activeField?: ActiveFormField;
  mode?: "screen-roam" | "inline";
  modelType?: RobotModelType;
  className?: string;
  style?: React.CSSProperties;
}

// Brand Monogram Texture for Titan & Nova Chest Badge
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
  state: stateProp,
  activeField: activeFieldProp,
  mode = "screen-roam",
  className = "",
  style,
}: ThreeRobotCompanionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const companionContext = useRobotCompanion();
  const state = stateProp || companionContext.state;
  const activeField = activeFieldProp || companionContext.activeField;
  const {
    activeScene,
    activeAgentId,
    projectShiftCounter,
    activeSkillCategory,
    playSound,
  } = companionContext;

  const stateRef = useRef(state);
  const activeFieldRef = useRef(activeField);
  const activeSceneRef = useRef(activeScene);
  const activeAgentRef = useRef<RobotAgentId>(activeAgentId);
  const projectShiftRef = useRef(projectShiftCounter);
  const activeSkillCatRef = useRef(activeSkillCategory);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    activeFieldRef.current = activeField;
  }, [activeField]);

  useEffect(() => {
    activeSceneRef.current = activeScene;
  }, [activeScene]);

  useEffect(() => {
    activeAgentRef.current = activeAgentId;
  }, [activeAgentId]);

  useEffect(() => {
    projectShiftRef.current = projectShiftCounter;
  }, [projectShiftCounter]);

  useEffect(() => {
    activeSkillCatRef.current = activeSkillCategory;
  }, [activeSkillCategory]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const isMobile = width < 768;

    // 1. Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 8.5 : 7.2);

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

    // 2. Photorealistic Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;

    // Dynamic Multi-Source Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    mainKeyLight.position.set(6, 10, 8);
    scene.add(mainKeyLight);

    const cyanRimLight = new THREE.PointLight(0x00f0ff, 4.5, 25);
    cyanRimLight.position.set(-8, 2, 4);
    scene.add(cyanRimLight);

    const purpleAccentLight = new THREE.PointLight(0xa855f7, 4.0, 20);
    purpleAccentLight.position.set(8, -2, 4);
    scene.add(purpleAccentLight);

    const amberAccentLight = new THREE.PointLight(0xf59e0b, 3.5, 20);
    amberAccentLight.position.set(-6, -6, 4);
    scene.add(amberAccentLight);

    const emeraldAccentLight = new THREE.PointLight(0x10b981, 4.0, 20);
    emeraldAccentLight.position.set(6, -10, 4);
    scene.add(emeraldAccentLight);

    // 3. Materials Library for the 7 Agents
    const silverNovaMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf1f5f9),
      metalness: 0.85,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 2.6,
    });

    const blueCodexMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x0284c7),
      metalness: 0.75,
      roughness: 0.2,
      clearcoat: 0.8,
      envMapIntensity: 2.4,
    });

    const blackMatrixMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x090d16),
      metalness: 0.95,
      roughness: 0.15,
      envMapIntensity: 2.5,
    });

    const purpleOrbitMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x7c3aed),
      metalness: 0.82,
      roughness: 0.18,
      clearcoat: 0.9,
      envMapIntensity: 2.5,
    });

    const whiteCloudXMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 1.0,
      envMapIntensity: 2.5,
    });

    const cyanNeuraMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x06b6d4),
      metalness: 0.88,
      roughness: 0.12,
      clearcoat: 1.0,
      envMapIntensity: 2.8,
    });

    const goldTitanMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.94,
      roughness: 0.18,
      envMapIntensity: 2.8,
    });

    const obsidianChassisMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x070b14),
      metalness: 0.95,
      roughness: 0.18,
      envMapIntensity: 2.6,
    });

    const industrialJointsMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x1e293b),
      metalness: 0.85,
      roughness: 0.25,
      envMapIntensity: 2.0,
    });

    // Glow Materials
    const cyanGlowMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.95 });
    const blueGlowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.95 });
    const emeraldGlowMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.95 });
    const violetGlowMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.95 });
    const orangeGlowMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.95 });
    const amberGlowMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.95 });

    // 4. UFO DROPSHIP & MULTI-VECTOR SECTION-WISE TRACTOR BEAM LANDING
    const ufoGlowRingMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.95 });
    const ufoThrusterMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.95 });
    const ufoDomeMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.8,
      thickness: 0.5,
      transparent: true,
      opacity: 0.85,
    });

    const ufoGroup = new THREE.Group();
    ufoGroup.position.set(-5.0, 4.5, -2.0);
    scene.add(ufoGroup);

    const ufoSaucerDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.72, 0.85, 0.12, 32),
      obsidianChassisMat
    );
    ufoGroup.add(ufoSaucerDisc);

    const ufoCockpitDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
      ufoDomeMat
    );
    ufoCockpitDome.position.set(0, 0.06, 0);
    ufoGroup.add(ufoCockpitDome);

    const ufoGlowRing = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.024, 16, 48), ufoGlowRingMat);
    ufoGlowRing.rotation.x = Math.PI / 2;
    ufoGroup.add(ufoGlowRing);

    const ufoThrusterNodes = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), ufoThrusterMat);
      node.position.set(Math.cos(angle) * 0.82, -0.04, Math.sin(angle) * 0.82);
      ufoThrusterNodes.add(node);
    }
    ufoGroup.add(ufoThrusterNodes);

    const tractorBeamGeom = new THREE.CylinderGeometry(0.3, 0.85, 4.6, 24, 1, true);
    tractorBeamGeom.translate(0, -2.3, 0);
    const tractorBeamMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const ufoTractorBeam = new THREE.Mesh(tractorBeamGeom, tractorBeamMat);
    ufoTractorBeam.position.set(0, -0.06, 0);
    ufoGroup.add(ufoTractorBeam);

    // Section-Specific Multi-Vector UFO Flight Paths & Colors
    interface UfoSectionConfig {
      spawnPos: THREE.Vector3;
      targetPos: THREE.Vector3;
      glowColor: number;
      beamColor: number;
      tiltZ: number;
    }

    const UFO_SECTION_CONFIGS: Record<number, UfoSectionConfig> = {
      1: {
        spawnPos: new THREE.Vector3(-5.0, 4.5, -2.0),
        targetPos: new THREE.Vector3(-1.8, 2.8, 0.4),
        glowColor: 0x00f0ff,
        beamColor: 0x00f0ff,
        tiltZ: -0.2,
      },
      2: {
        spawnPos: new THREE.Vector3(-3.2, 4.0, -1.0),
        targetPos: new THREE.Vector3(-1.5, 2.7, 0.3),
        glowColor: 0x00f0ff,
        beamColor: 0x38bdf8,
        tiltZ: -0.1,
      },
      3: {
        spawnPos: new THREE.Vector3(5.2, 4.2, -1.8),
        targetPos: new THREE.Vector3(1.8, 2.6, 0.3),
        glowColor: 0x0284c7,
        beamColor: 0x38bdf8,
        tiltZ: 0.25,
      },
      4: {
        spawnPos: new THREE.Vector3(0.0, 5.0, -7.0),
        targetPos: new THREE.Vector3(-1.6, 2.6, 0.2),
        glowColor: 0x10b981,
        beamColor: 0x10b981,
        tiltZ: 0.0,
      },
      5: {
        spawnPos: new THREE.Vector3(2.2, 6.0, 0.0),
        targetPos: new THREE.Vector3(1.8, 2.6, 0.3),
        glowColor: 0xa855f7,
        beamColor: 0xa855f7,
        tiltZ: 0.15,
      },
      6: {
        spawnPos: new THREE.Vector3(-5.5, 2.5, 0.0),
        targetPos: new THREE.Vector3(1.5, 2.5, 0.2),
        glowColor: 0xf97316,
        beamColor: 0xf97316,
        tiltZ: -0.3,
      },
      7: {
        spawnPos: new THREE.Vector3(0.0, 4.8, -2.5),
        targetPos: new THREE.Vector3(0.0, 2.8, 0.3),
        glowColor: 0x06b6d4,
        beamColor: 0x06b6d4,
        tiltZ: 0.0,
      },
      8: {
        spawnPos: new THREE.Vector3(0.0, 5.8, 0.5),
        targetPos: new THREE.Vector3(-1.8, 2.8, 0.4),
        glowColor: 0xf59e0b,
        beamColor: 0xf59e0b,
        tiltZ: -0.15,
      },
      9: {
        spawnPos: new THREE.Vector3(0.0, 5.2, -4.0),
        targetPos: new THREE.Vector3(0.0, 3.4, 0.2),
        glowColor: 0xeab308,
        beamColor: 0x38bdf8,
        tiltZ: 0.0,
      },
    };

    // 5. Robot Hierarchy Roots for the 7 Agents
    const squadRoot = new THREE.Group();
    scene.add(squadRoot);

    const novaRoot = new THREE.Group();    // Robot 01: Guide
    const codexRoot = new THREE.Group();   // Robot 02: Frontend
    const matrixRoot = new THREE.Group();  // Robot 03: Backend
    const orbitRoot = new THREE.Group();   // Robot 04: Database
    const cloudxRoot = new THREE.Group();  // Robot 05: DevOps
    const neuraRoot = new THREE.Group();   // Robot 06: AI
    const titanRoot = new THREE.Group();   // Robot 07: Projects/Finale

    squadRoot.add(novaRoot);
    squadRoot.add(codexRoot);
    squadRoot.add(matrixRoot);
    squadRoot.add(orbitRoot);
    squadRoot.add(cloudxRoot);
    squadRoot.add(neuraRoot);
    squadRoot.add(titanRoot);

    const updateScales = () => {
      const mob = window.innerWidth < 768;
      const s = mob ? 0.65 : 0.88;
      novaRoot.scale.set(s, s, s);
      codexRoot.scale.set(s, s, s);
      matrixRoot.scale.set(s, s, s);
      orbitRoot.scale.set(s, s, s);
      cloudxRoot.scale.set(s, s, s);
      neuraRoot.scale.set(s, s, s);
      titanRoot.scale.set(s, s, s);
    };
    updateScales();

    // 6. PROPS & DRESSING FOR THE 7 SPECIALIZED AGENTS

    // --- NOVA PROPS: Cyan Visor & Developer Tech Coat Hood ---
    const novaVisor = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.16), cyanGlowMat);
    novaVisor.position.set(0, 0.08, 0.11);

    const brandTexture = createBrandEmblemTexture();
    const novaBadge = new THREE.Mesh(
      new THREE.CircleGeometry(0.065, 32),
      new THREE.MeshBasicMaterial({ map: brandTexture, transparent: true })
    );
    novaBadge.position.set(0.1, 0.16, 0.16);
    novaBadge.rotation.set(-0.15, 0.2, 0);

    // --- CODEX PROPS: Floating 3D Holographic Keyboard & UI Mesh ---
    const codexHoloDesk = new THREE.Group();
    codexHoloDesk.position.set(0, -0.2, 0.45);
    const keyboardBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.015, 0.18),
      new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.6 })
    );
    keyboardBase.rotation.x = Math.PI / 10;
    const keyRows = new THREE.Group();
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        const key = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.01, 0.035), blueGlowMat);
        key.position.set((c - 3.5) * 0.048, 0.01, (r - 1) * 0.045);
        keyRows.add(key);
      }
    }
    keyboardBase.add(keyRows);
    codexHoloDesk.add(keyboardBase);
    codexRoot.add(codexHoloDesk);

    // --- MATRIX PROPS: Floating 3D Server Blade Rack & Pulsing API Cable Rays ---
    const matrixServerRack = new THREE.Group();
    matrixServerRack.position.set(-0.4, 0, 0.35);
    const rackFrame = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.65, 0.18), industrialJointsMat);
    matrixServerRack.add(rackFrame);
    const serverLeds: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.16), blackMatrixMat);
      blade.position.set(0, (i - 1.5) * 0.12, 0.01);
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), emeraldGlowMat);
      led.position.set(0.08, 0, 0.09);
      blade.add(led);
      serverLeds.push(led);
      matrixServerRack.add(blade);
    }
    matrixRoot.add(matrixServerRack);

    // --- ORBIT PROPS: 3 Glowing Database Cylinders ---
    const orbitDBCylinders = new THREE.Group();
    orbitDBCylinders.position.set(0.35, -0.1, 0.35);
    const createDBCylinder = (x: number, y: number, colorMat: THREE.Material) => {
      const g = new THREE.Group();
      g.position.set(x, y, 0);
      for (let i = 0; i < 3; i++) {
        const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 24), colorMat);
        disc.position.y = (i - 1) * 0.055;
        g.add(disc);
      }
      return g;
    };
    orbitDBCylinders.add(createDBCylinder(-0.14, 0, violetGlowMat));
    orbitDBCylinders.add(createDBCylinder(0, 0.08, cyanGlowMat));
    orbitDBCylinders.add(createDBCylinder(0.14, -0.04, blueGlowMat));
    orbitRoot.add(orbitDBCylinders);

    // --- CLOUD-X PROPS: Rotating Docker Pod & CI/CD Pipeline Ring ---
    const cloudxPipeline = new THREE.Group();
    cloudxPipeline.position.set(0, 0.15, -0.18);
    const pipelineRing = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.012, 16, 48), orangeGlowMat);
    cloudxPipeline.add(pipelineRing);
    const cloudxPods: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const podBox = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), industrialJointsMat);
      podBox.position.set(Math.cos(angle) * 0.32, Math.sin(angle) * 0.32, 0);
      cloudxPods.push(podBox);
      cloudxPipeline.add(podBox);
    }
    cloudxRoot.add(cloudxPipeline);

    // --- NEURA PROPS: Pulsing 3D Synaptic Neural Network Sphere ---
    const neuraSphere = new THREE.Group();
    neuraSphere.position.set(0, 0.25, 0.4);
    const neuralCore = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), cyanGlowMat);
    neuraSphere.add(neuralCore);
    const synapseNodes: THREE.Mesh[] = [];
    for (let i = 0; i < 12; i++) {
      const phi = Math.acos(-1 + (2 * i) / 12);
      const theta = Math.sqrt(12 * Math.PI) * phi;
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), cyanGlowMat);
      node.position.setFromSphericalCoords(0.24, phi, theta);
      neuraSphere.add(node);
      synapseNodes.push(node);
    }
    neuraRoot.add(neuraSphere);

    // --- TITAN PROPS: Imperial Gold Pauldrons, Arc Reactor & Project Holo-Stage ---
    const titanPauldronL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.2), goldTitanMat);
    titanPauldronL.position.set(-0.18, 0.1, 0);
    const titanPauldronR = titanPauldronL.clone();
    titanPauldronR.position.set(0.18, 0.1, 0);

    const titanWristSlate = new THREE.Group();
    titanWristSlate.position.set(0.06, 0.14, 0.08);
    const slateBase = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.015, 0.12), industrialJointsMat);
    const slateScreen = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.018, 0.11), amberGlowMat);
    slateScreen.position.set(0, 0.005, 0);
    titanWristSlate.add(slateBase);
    titanWristSlate.add(slateScreen);

    // Ambient Stardust Sparks
    const stardustCount = 85;
    const stardustGeom = new THREE.BufferGeometry();
    const stardustPos = new Float32Array(stardustCount * 3);
    for (let i = 0; i < stardustCount * 3; i += 3) {
      stardustPos[i] = (Math.random() - 0.5) * 12;
      stardustPos[i + 1] = (Math.random() - 0.5) * 12;
      stardustPos[i + 2] = (Math.random() - 0.5) * 6;
    }
    stardustGeom.setAttribute("position", new THREE.BufferAttribute(stardustPos, 3));
    const stardustParticles = new THREE.Points(
      stardustGeom,
      new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.04,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(stardustParticles);

    // ── PHASE 2: 3D Holographic Connector Beam, Reticle & Click Ripple ─────
    const laserBeamPositions = new Float32Array(6); // 2 points x 3
    const laserBeamGeom = new THREE.BufferGeometry();
    laserBeamGeom.setAttribute("position", new THREE.BufferAttribute(laserBeamPositions, 3));
    const laserBeamMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });
    const laserBeam = new THREE.Line(laserBeamGeom, laserBeamMat);
    laserBeam.visible = false;
    scene.add(laserBeam);

    const laserTargetReticleMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const laserTargetReticleGeom = new THREE.RingGeometry(0.09, 0.13, 24);
    const laserTargetReticle = new THREE.Mesh(laserTargetReticleGeom, laserTargetReticleMat);
    laserTargetReticle.visible = false;
    scene.add(laserTargetReticle);

    // Glowing hand aperture energy node (beam origin)
    const handEmitterGeom = new THREE.SphereGeometry(0.026, 16, 16);
    const handEmitterMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });
    const handEmitterNode = new THREE.Mesh(handEmitterGeom, handEmitterMat);
    handEmitterNode.visible = false;
    scene.add(handEmitterNode);

    const clickAuraRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const clickAuraRingGeom = new THREE.RingGeometry(0.2, 0.28, 32);
    const clickAuraRing = new THREE.Mesh(clickAuraRingGeom, clickAuraRingMat);
    clickAuraRing.rotation.x = Math.PI / 2;
    clickAuraRing.visible = false;
    scene.add(clickAuraRing);

    // 7. MULTI-ROBOT INSTANCES & ANIMATION RIGGING
    interface RobotInstance {
      id: RobotAgentId;
      root: THREE.Group;
      mixer: THREE.AnimationMixer | null;
      actions: Record<string, THREE.AnimationAction>;
      activeAction: string;
      headBone: THREE.Bone | null;
      neckBone: THREE.Bone | null;
      spineBone: THREE.Bone | null;
      rightShoulderBone: THREE.Bone | null;
      rightArmBone: THREE.Bone | null;
      rightForeArmBone: THREE.Bone | null;
      rightHandBone: THREE.Bone | null;
      leftShoulderBone: THREE.Bone | null;
      leftArmBone: THREE.Bone | null;
      leftForeArmBone: THREE.Bone | null;
      leftHandBone: THREE.Bone | null;
      currentPos: THREE.Vector3;
      targetPos: THREE.Vector3;
      heading: number;
      animController: RobotAnimController | null;
      pathNavigator: RobotPathNavigator;
      proceduralLayer: RobotProceduralLayer | null;
      /** Section-wise 360° turntable spin director */
      spinDirector: Robot360SpinDirector | null;
      /** Which scene number triggers this robot's spin */
      assignedScene: number;
    }

    const robots: Record<string, RobotInstance> = {
      nova: {
        id: "nova",
        root: novaRoot,
        mixer: null,
        actions: {},
        activeAction: "walk",
        headBone: null,
        neckBone: null,
        spineBone: null,
        rightShoulderBone: null,
        rightArmBone: null,
        rightForeArmBone: null,
        rightHandBone: null,
        leftShoulderBone: null,
        leftArmBone: null,
        leftForeArmBone: null,
        leftHandBone: null,
        currentPos: new THREE.Vector3(-1.8, -0.2, 0.2),
        targetPos: new THREE.Vector3(-1.8, -0.2, 0.2),
        heading: 0,
        animController: null,
        pathNavigator: new RobotPathNavigator(),
        proceduralLayer: null,
        spinDirector: null,
        assignedScene: 1,
      },
      codex: {
        id: "codex",
        root: codexRoot,
        mixer: null,
        actions: {},
        activeAction: "idle",
        headBone: null,
        neckBone: null,
        spineBone: null,
        rightShoulderBone: null,
        rightArmBone: null,
        rightForeArmBone: null,
        rightHandBone: null,
        leftShoulderBone: null,
        leftArmBone: null,
        leftForeArmBone: null,
        leftHandBone: null,
        currentPos: new THREE.Vector3(1.8, -0.1, -0.1),
        targetPos: new THREE.Vector3(1.8, -0.1, -0.1),
        heading: 0,
        animController: null,
        pathNavigator: new RobotPathNavigator(),
        proceduralLayer: null,
        spinDirector: null,
        assignedScene: 3,
      },
      matrix: {
        id: "matrix",
        root: matrixRoot,
        mixer: null,
        actions: {},
        activeAction: "idle",
        headBone: null,
        neckBone: null,
        spineBone: null,
        rightShoulderBone: null,
        rightArmBone: null,
        rightForeArmBone: null,
        rightHandBone: null,
        leftShoulderBone: null,
        leftArmBone: null,
        leftForeArmBone: null,
        leftHandBone: null,
        currentPos: new THREE.Vector3(1.7, -0.1, -0.1),
        targetPos: new THREE.Vector3(1.7, -0.1, -0.1),
        heading: 0,
        animController: null,
        pathNavigator: new RobotPathNavigator(),
        proceduralLayer: null,
        spinDirector: null,
        assignedScene: 4,
      },
      orbit: {
        id: "orbit",
        root: orbitRoot,
        mixer: null,
        actions: {},
        activeAction: "idle",
        headBone: null,
        neckBone: null,
        spineBone: null,
        rightShoulderBone: null,
        rightArmBone: null,
        rightForeArmBone: null,
        rightHandBone: null,
        leftShoulderBone: null,
        leftArmBone: null,
        leftForeArmBone: null,
        leftHandBone: null,
        currentPos: new THREE.Vector3(1.8, -0.1, -0.1),
        targetPos: new THREE.Vector3(1.8, -0.1, -0.1),
        heading: 0,
        animController: null,
        pathNavigator: new RobotPathNavigator(),
        proceduralLayer: null,
        spinDirector: null,
        assignedScene: 5,
      },
      cloudx: {
        id: "cloudx",
        root: cloudxRoot,
        mixer: null,
        actions: {},
        activeAction: "idle",
        headBone: null,
        neckBone: null,
        spineBone: null,
        rightShoulderBone: null,
        rightArmBone: null,
        rightForeArmBone: null,
        rightHandBone: null,
        leftShoulderBone: null,
        leftArmBone: null,
        leftForeArmBone: null,
        leftHandBone: null,
        currentPos: new THREE.Vector3(1.8, -0.1, -0.1),
        targetPos: new THREE.Vector3(1.8, -0.1, -0.1),
        heading: 0,
        animController: null,
        pathNavigator: new RobotPathNavigator(),
        proceduralLayer: null,
        spinDirector: null,
        assignedScene: 6,
      },
      neura: {
        id: "neura",
        root: neuraRoot,
        mixer: null,
        actions: {},
        activeAction: "idle",
        headBone: null,
        neckBone: null,
        spineBone: null,
        rightShoulderBone: null,
        rightArmBone: null,
        rightForeArmBone: null,
        rightHandBone: null,
        leftShoulderBone: null,
        leftArmBone: null,
        leftForeArmBone: null,
        leftHandBone: null,
        currentPos: new THREE.Vector3(1.8, -0.1, -0.1),
        targetPos: new THREE.Vector3(1.8, -0.1, -0.1),
        heading: 0,
        animController: null,
        pathNavigator: new RobotPathNavigator(),
        proceduralLayer: null,
        spinDirector: null,
        assignedScene: 7,
      },
      titan: {
        id: "titan",
        root: titanRoot,
        mixer: null,
        actions: {},
        activeAction: "walk",
        headBone: null,
        neckBone: null,
        spineBone: null,
        rightShoulderBone: null,
        rightArmBone: null,
        rightForeArmBone: null,
        rightHandBone: null,
        leftShoulderBone: null,
        leftArmBone: null,
        leftForeArmBone: null,
        leftHandBone: null,
        currentPos: new THREE.Vector3(-1.8, -0.2, 0.15),
        targetPos: new THREE.Vector3(-1.8, -0.2, 0.15),
        heading: 0,
        animController: null,
        pathNavigator: new RobotPathNavigator(),
        proceduralLayer: null,
        spinDirector: null,
        assignedScene: 8,
      },
    };

    const crossFadeAction = (
      robot: RobotInstance,
      targetName: string,
      duration = 0.35
    ) => {
      if (robot.activeAction === targetName) return;
      const from = robot.actions[robot.activeAction];
      const to = robot.actions[targetName];
      if (to) {
        to.reset();
        to.enabled = true;
        to.setEffectiveWeight(1);
        to.play();
        if (from) {
          from.crossFadeTo(to, duration, true);
        }
        robot.activeAction = targetName;
      }
    };

    // Cinematic Directors
    const cameraDirector = new CinematicCameraDirector(camera);
    const interactionDirector = new RobotInteractionDirector();
    let hasPlayedScene9Finale = false;

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      "/models/robot-mecha.glb",
      (gltf) => {
        // Safe helper to dress and extract bones without mutating hierarchy inside traverse
        const dressRobot = (
          clonedModel: THREE.Group,
          surfaceMat: THREE.Material,
          jointsMat: THREE.Material
        ) => {
          const bones: Record<string, THREE.Bone> = {};

          clonedModel.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              if (mesh.name.includes("Surface")) mesh.material = surfaceMat;
              else if (mesh.name.includes("Joints")) mesh.material = jointsMat;
            }
            if ((child as THREE.Bone).isBone) {
              const bone = child as THREE.Bone;
              if (bone.name.includes("Head")) bones.head = bone;
              if (bone.name.includes("Neck")) bones.neck = bone;
              if (bone.name.includes("Spine2")) bones.spine2 = bone;
              else if (!bones.spine2 && bone.name.includes("Spine1")) bones.spine2 = bone;

              // Arm & hand bones extraction
              if (bone.name.includes("RightShoulder")) bones.rightShoulder = bone;
              else if (bone.name.includes("RightForeArm")) bones.rightForeArm = bone;
              else if (bone.name.includes("RightArm")) bones.rightArm = bone;
              else if (bone.name.includes("RightHand")) bones.rightHand = bone;

              if (bone.name.includes("LeftShoulder")) bones.leftShoulder = bone;
              else if (bone.name.includes("LeftForeArm")) bones.leftForeArm = bone;
              else if (bone.name.includes("LeftArm")) bones.leftArm = bone;
              else if (bone.name.includes("LeftHand")) bones.leftHand = bone;
            }
          });

          return bones;
        };

        // --- 1. SETUP NOVA (Silver/White + Cyan) ---
        const modelNova = SkeletonUtils.clone(gltf.scene) as THREE.Group;
        modelNova.position.set(0, -1.6, 0);
        novaRoot.add(modelNova);
        robots.nova.mixer = new THREE.AnimationMixer(modelNova);
        const novaBones = dressRobot(modelNova, silverNovaMat, industrialJointsMat);
        if (novaBones.head) {
          robots.nova.headBone = novaBones.head;
          novaBones.head.add(novaVisor);
        }
        if (novaBones.neck) robots.nova.neckBone = novaBones.neck;
        if (novaBones.spine2) {
          robots.nova.spineBone = novaBones.spine2;
          novaBones.spine2.add(novaBadge);
        }
        robots.nova.rightShoulderBone = novaBones.rightShoulder || null;
        robots.nova.rightArmBone = novaBones.rightArm || null;
        robots.nova.rightForeArmBone = novaBones.rightForeArm || null;
        robots.nova.rightHandBone = novaBones.rightHand || null;
        robots.nova.leftShoulderBone = novaBones.leftShoulder || null;
        robots.nova.leftArmBone = novaBones.leftArm || null;
        robots.nova.leftForeArmBone = novaBones.leftForeArm || null;
        robots.nova.leftHandBone = novaBones.leftHand || null;

        // --- 2. SETUP CODEX (Electric Blue + Platinum) ---
        const modelCodex = SkeletonUtils.clone(gltf.scene) as THREE.Group;
        modelCodex.position.set(0, -1.6, 0);
        codexRoot.add(modelCodex);
        robots.codex.mixer = new THREE.AnimationMixer(modelCodex);
        const codexBones = dressRobot(modelCodex, blueCodexMat, silverNovaMat);
        if (codexBones.head) robots.codex.headBone = codexBones.head;
        if (codexBones.neck) robots.codex.neckBone = codexBones.neck;
        if (codexBones.spine2) robots.codex.spineBone = codexBones.spine2;
        robots.codex.rightShoulderBone = codexBones.rightShoulder || null;
        robots.codex.rightArmBone = codexBones.rightArm || null;
        robots.codex.rightForeArmBone = codexBones.rightForeArm || null;
        robots.codex.rightHandBone = codexBones.rightHand || null;
        robots.codex.leftShoulderBone = codexBones.leftShoulder || null;
        robots.codex.leftArmBone = codexBones.leftArm || null;
        robots.codex.leftForeArmBone = codexBones.leftForeArm || null;
        robots.codex.leftHandBone = codexBones.leftHand || null;

        // --- 3. SETUP MATRIX (Matte Black + Emerald) ---
        const modelMatrix = SkeletonUtils.clone(gltf.scene) as THREE.Group;
        modelMatrix.position.set(0, -1.6, 0);
        matrixRoot.add(modelMatrix);
        robots.matrix.mixer = new THREE.AnimationMixer(modelMatrix);
        const matrixBones = dressRobot(modelMatrix, blackMatrixMat, industrialJointsMat);
        if (matrixBones.head) robots.matrix.headBone = matrixBones.head;
        if (matrixBones.neck) robots.matrix.neckBone = matrixBones.neck;
        if (matrixBones.spine2) robots.matrix.spineBone = matrixBones.spine2;
        robots.matrix.rightShoulderBone = matrixBones.rightShoulder || null;
        robots.matrix.rightArmBone = matrixBones.rightArm || null;
        robots.matrix.rightForeArmBone = matrixBones.rightForeArm || null;
        robots.matrix.rightHandBone = matrixBones.rightHand || null;
        robots.matrix.leftShoulderBone = matrixBones.leftShoulder || null;
        robots.matrix.leftArmBone = matrixBones.leftArm || null;
        robots.matrix.leftForeArmBone = matrixBones.leftForeArm || null;
        robots.matrix.leftHandBone = matrixBones.leftHand || null;

        // --- 4. SETUP ORBIT (Purple + Chrome) ---
        const modelOrbit = SkeletonUtils.clone(gltf.scene) as THREE.Group;
        modelOrbit.position.set(0, -1.6, 0);
        orbitRoot.add(modelOrbit);
        robots.orbit.mixer = new THREE.AnimationMixer(modelOrbit);
        const orbitBones = dressRobot(modelOrbit, purpleOrbitMat, silverNovaMat);
        if (orbitBones.head) robots.orbit.headBone = orbitBones.head;
        if (orbitBones.neck) robots.orbit.neckBone = orbitBones.neck;
        if (orbitBones.spine2) robots.orbit.spineBone = orbitBones.spine2;
        robots.orbit.rightShoulderBone = orbitBones.rightShoulder || null;
        robots.orbit.rightArmBone = orbitBones.rightArm || null;
        robots.orbit.rightForeArmBone = orbitBones.rightForeArm || null;
        robots.orbit.rightHandBone = orbitBones.rightHand || null;
        robots.orbit.leftShoulderBone = orbitBones.leftShoulder || null;
        robots.orbit.leftArmBone = orbitBones.leftArm || null;
        robots.orbit.leftForeArmBone = orbitBones.leftForeArm || null;
        robots.orbit.leftHandBone = orbitBones.leftHand || null;

        // --- 5. SETUP CLOUD-X (White + Orange) ---
        const modelCloudx = SkeletonUtils.clone(gltf.scene) as THREE.Group;
        modelCloudx.position.set(0, -1.6, 0);
        cloudxRoot.add(modelCloudx);
        robots.cloudx.mixer = new THREE.AnimationMixer(modelCloudx);
        const cloudxBones = dressRobot(modelCloudx, whiteCloudXMat, industrialJointsMat);
        if (cloudxBones.head) robots.cloudx.headBone = cloudxBones.head;
        if (cloudxBones.neck) robots.cloudx.neckBone = cloudxBones.neck;
        if (cloudxBones.spine2) robots.cloudx.spineBone = cloudxBones.spine2;
        robots.cloudx.rightShoulderBone = cloudxBones.rightShoulder || null;
        robots.cloudx.rightArmBone = cloudxBones.rightArm || null;
        robots.cloudx.rightForeArmBone = cloudxBones.rightForeArm || null;
        robots.cloudx.rightHandBone = cloudxBones.rightHand || null;
        robots.cloudx.leftShoulderBone = cloudxBones.leftShoulder || null;
        robots.cloudx.leftArmBone = cloudxBones.leftArm || null;
        robots.cloudx.leftForeArmBone = cloudxBones.leftForeArm || null;
        robots.cloudx.leftHandBone = cloudxBones.leftHand || null;

        // --- 6. SETUP NEURA (Cyan + Pearlescent) ---
        const modelNeura = SkeletonUtils.clone(gltf.scene) as THREE.Group;
        modelNeura.position.set(0, -1.6, 0);
        neuraRoot.add(modelNeura);
        robots.neura.mixer = new THREE.AnimationMixer(modelNeura);
        const neuraBones = dressRobot(modelNeura, cyanNeuraMat, silverNovaMat);
        if (neuraBones.head) robots.neura.headBone = neuraBones.head;
        if (neuraBones.neck) robots.neura.neckBone = neuraBones.neck;
        if (neuraBones.spine2) robots.neura.spineBone = neuraBones.spine2;
        robots.neura.rightShoulderBone = neuraBones.rightShoulder || null;
        robots.neura.rightArmBone = neuraBones.rightArm || null;
        robots.neura.rightForeArmBone = neuraBones.rightForeArm || null;
        robots.neura.rightHandBone = neuraBones.rightHand || null;
        robots.neura.leftShoulderBone = neuraBones.leftShoulder || null;
        robots.neura.leftArmBone = neuraBones.leftArm || null;
        robots.neura.leftForeArmBone = neuraBones.leftForeArm || null;
        robots.neura.leftHandBone = neuraBones.leftHand || null;

        // --- 7. SETUP TITAN (Imperial Obsidian + 24k Gold) ---
        const modelTitan = SkeletonUtils.clone(gltf.scene) as THREE.Group;
        modelTitan.position.set(0, -1.6, 0);
        titanRoot.add(modelTitan);
        robots.titan.mixer = new THREE.AnimationMixer(modelTitan);
        const titanBones = dressRobot(modelTitan, goldTitanMat, obsidianChassisMat);
        if (titanBones.head) robots.titan.headBone = titanBones.head;
        if (titanBones.neck) robots.titan.neckBone = titanBones.neck;
        if (titanBones.spine2) robots.titan.spineBone = titanBones.spine2;
        if (titanBones.leftShoulder) titanBones.leftShoulder.add(titanPauldronL);
        if (titanBones.rightShoulder) titanBones.rightShoulder.add(titanPauldronR);
        if (titanBones.rightForeArm) titanBones.rightForeArm.add(titanWristSlate);
        robots.titan.rightShoulderBone = titanBones.rightShoulder || null;
        robots.titan.rightArmBone = titanBones.rightArm || null;
        robots.titan.rightForeArmBone = titanBones.rightForeArm || null;
        robots.titan.rightHandBone = titanBones.rightHand || null;
        robots.titan.leftShoulderBone = titanBones.leftShoulder || null;
        robots.titan.leftArmBone = titanBones.leftArm || null;
        robots.titan.leftForeArmBone = titanBones.leftForeArm || null;
        robots.titan.leftHandBone = titanBones.leftHand || null;

        // Bind animation clips & attach advanced controllers
        if (gltf.animations && gltf.animations.length > 0) {
          Object.values(robots).forEach((bot) => {
            if (bot.mixer) {
              gltf.animations.forEach((clip) => {
                bot.actions[clip.name] = bot.mixer!.clipAction(clip);
              });

              // Speed-synchronized animation controller
              bot.animController = new RobotAnimController({
                mixer: bot.mixer,
                actions: bot.actions,
                referenceWalkSpeed: 1.4,
                referenceRunSpeed: 3.6,
              });

              // Procedural bone IK layer with full multi-axis arm kinematics
              bot.proceduralLayer = new RobotProceduralLayer({
                headBone: bot.headBone,
                neckBone: bot.neckBone,
                spineBone: bot.spineBone,
                rightShoulderBone: bot.rightShoulderBone,
                rightArmBone: bot.rightArmBone,
                rightForeArmBone: bot.rightForeArmBone,
                rightHandBone: bot.rightHandBone,
                leftShoulderBone: bot.leftShoulderBone,
                leftArmBone: bot.leftArmBone,
                leftForeArmBone: bot.leftForeArmBone,
                leftHandBone: bot.leftHandBone,
              });

              // ── 360° Section-Entry Spin Director ──────────────────────────
              const isMobileAtLoad = window.innerWidth < 768;
              bot.spinDirector = new Robot360SpinDirector({
                root: bot.root,
                baseY: bot.currentPos.y,
                liftHeight: 0.22,
                spinSpeed: isMobileAtLoad ? 0.9 : 0.68,
                riseTime: 0.22,
                landTime: 0.30,
                skipSpin: isMobileAtLoad, // mobile: lift+land only, no full spin
                onSpinComplete: () => {
                  // Trigger GREET wave immediately after the spin lands
                  bot.animController?.triggerGreet(1.6);
                },
              });

              // Register to multi-robot interaction director
              interactionDirector.registerAgent({
                id: bot.id,
                getCurrentPos: () => bot.currentPos,
                navigateTo: (pos, run) => bot.pathNavigator.navigateTo(bot.currentPos, pos, run),
                triggerGreet: () => bot.animController?.triggerGreet(),
                triggerPoint: () => bot.proceduralLayer?.setMode("point", new THREE.Vector3(0, 0.5, 0)),
                triggerWave: () => bot.proceduralLayer?.setMode("wave"),
                triggerIdle: () => bot.proceduralLayer?.reset(),
                setLookAt: (t) => bot.proceduralLayer?.setMode("lookAt", t),
              });
            }
          });
        }
      },
      undefined,
      (err) => console.error("Error loading ROBOTVERSE 7-Agent GLB:", err)
    );

    // 8. Cursor Tracking & Inactivity Sleep State Machine
    let targetMousePixelX = window.innerWidth / 2;
    let targetMousePixelY = window.innerHeight / 2;
    let currentMousePixelX = targetMousePixelX;
    let currentMousePixelY = targetMousePixelY;
    let lastUserActivityTime = performance.now() * 0.001;
    let isSleeping = false;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const now = performance.now() * 0.001;
      if (isSleeping) {
        isSleeping = false;
        soundFX.wakeChirp();
      }
      lastUserActivityTime = now;

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

    // ── PHASE 2: Two-Way Direct Interactive Clicks via Raycasting ────────
    const clickRaycaster = new THREE.Raycaster();
    const clickNdc = new THREE.Vector2();
    let clickReactionTimer = 0;
    let clickedAgentId: string | null = null;
    let clickAuraScale = 0.2;
    let clickAuraOpacity = 0.0;
    let clickJumpOffset = 0;
    let lastProjectShiftTime = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let cx = 0;
      let cy = 0;
      if ("touches" in e && e.touches.length > 0) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else if ("clientX" in e) {
        cx = (e as MouseEvent).clientX;
        cy = (e as MouseEvent).clientY;
      }

      clickNdc.x = (cx / window.innerWidth) * 2 - 1;
      clickNdc.y = -(cy / window.innerHeight) * 2 + 1;
      clickRaycaster.setFromCamera(clickNdc, camera);

      const currentScene = activeSceneRef.current || 1;
      let currentAgent = "nova";
      if (currentScene === 3) currentAgent = "codex";
      else if (currentScene === 4) currentAgent = "matrix";
      else if (currentScene === 5) currentAgent = "orbit";
      else if (currentScene === 6) currentAgent = "cloudx";
      else if (currentScene === 7) currentAgent = "neura";
      else if (currentScene === 8) currentAgent = "titan";

      const bot = robots[currentAgent] || robots.nova;
      if (!bot || !bot.root.visible) return;

      const intersects = clickRaycaster.intersectObjects(bot.root.children, true);
      if (intersects.length > 0) {
        soundFX.playAgentVoice(currentAgent, 0.12);
        clickReactionTimer = 1.8;
        clickedAgentId = currentAgent;
        clickAuraScale = 0.2;
        clickAuraOpacity = 1.0;
        clickAuraRing.position.copy(bot.currentPos);
        clickAuraRing.position.y += 0.05;

        // Custom reaction by character
        if (currentAgent === "nova") {
          bot.animController?.triggerGreet(1.8);
          bot.proceduralLayer?.setSalute(true);
          setTimeout(() => bot.proceduralLayer?.setSalute(false), 1400);
        } else if (currentAgent === "codex") {
          bot.animController?.triggerGreet(1.6);
          bot.proceduralLayer?.setMode("type");
          setTimeout(() => bot.proceduralLayer?.setMode("none"), 1600);
        } else if (currentAgent === "matrix") {
          bot.proceduralLayer?.triggerNod();
          bot.proceduralLayer?.setGuard(true);
        } else if (currentAgent === "orbit") {
          bot.animController?.triggerGreet(1.6);
        } else if (currentAgent === "cloudx") {
          bot.animController?.triggerGreet(1.6);
          clickJumpOffset = 0.45;
        } else if (currentAgent === "neura") {
          bot.proceduralLayer?.setThink(true);
          setTimeout(() => bot.proceduralLayer?.setThink(false), 1500);
        } else if (currentAgent === "titan") {
          bot.animController?.triggerGreet(1.8);
          bot.proceduralLayer?.triggerWristCheck();
        }
      }
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    // Scratch Vectors
    const _scratchV = new THREE.Vector3();
    const _scratchDir = new THREE.Vector3();
    const _scratchTarget = new THREE.Vector3();
    const _scratchHeadPos = new THREE.Vector3();
    const _scratchAimDir = new THREE.Vector3();

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

    const handleResize = () => {
      if (!container) return;
      width = window.innerWidth;
      height = window.innerHeight;
      const mob = width < 768;

      camera.aspect = width / height;
      camera.position.z = mob ? 8.5 : 7.2;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      updateScales();
    };

    window.addEventListener("resize", handleResize);

    // 9. ANIMATION LOOP: MULTI-AGENT HANDOFFS, WORKBENCHES & SCENE 09 FINALE
    let lastTime = performance.now() * 0.001;
    let animationFrameId: number;
    let lastProjectCounter = projectShiftRef.current;
    let previousScene = activeSceneRef.current;
    let beamProgress = 0;

    // ── Storyline Scene Activity Director ─────────────────────────────────
    const sceneActivityDirector = new RobotSceneActivityDirector();
    const storyTargetOverride = new THREE.Vector3();
    let isStoryTargetActive = false;
    let storyTargetRun = false;
    let sceneInitialized = false;

    const loadSceneTimeline = (sceneNum: number, agentId: string) => {
      isStoryTargetActive = false;
      const targetBot = robots[agentId] || robots.nova;
      sceneActivityDirector.loadScene(sceneNum, {
        triggerSpin: () => {
          targetBot.spinDirector?.triggerSpin();
        },
        setTargetPos: (x, y, z, run) => {
          isStoryTargetActive = true;
          storyTargetOverride.set(x, y, z);
          storyTargetRun = !!run;
        },
        clearTargetOverride: () => {
          isStoryTargetActive = false;
        },
        setProceduralMode: (pMode, target) => {
          targetBot.proceduralLayer?.setMode(pMode, target);
        },
        triggerGreet: (duration) => {
          targetBot.animController?.triggerGreet(duration);
        },
        triggerNod: () => {
          targetBot.proceduralLayer?.triggerNod();
        },
        setGuardMode: (active) => {
          targetBot.proceduralLayer?.setGuard(active);
        },
        setThinkMode: (active) => {
          targetBot.proceduralLayer?.setThink(active);
        },
        setSaluteMode: (active) => {
          targetBot.proceduralLayer?.setSalute(active);
        },
        triggerWristCheck: () => {
          targetBot.proceduralLayer?.triggerWristCheck();
        },
      });
    };

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

      const boundY = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const boundX = boundY * camera.aspect;
      const mobileMode = width < 768;

      // Inactivity Sleep Check (> 3.5s of no cursor activity)
      const inactiveDuration = time - lastUserActivityTime;
      if (!isSleeping && inactiveDuration > 3.5) {
        isSleeping = true;
        soundFX.powerDown();
      }

      screenToWorld(currentMousePixelX, currentMousePixelY, 0.2, _scratchTarget);
      const roamRangeX = boundX * (mobileMode ? 0.72 : 0.82);
      const roamRangeY = boundY * (mobileMode ? 0.65 : 0.72);
      const cursorX = THREE.MathUtils.clamp(_scratchTarget.x, -roamRangeX, roamRangeX);
      const cursorY = THREE.MathUtils.clamp(_scratchTarget.y, -roamRangeY, roamRangeY);

      stardustParticles.rotation.y += 0.0008;

      const currentSceneNum = activeSceneRef.current || 1;
      const currentState = stateRef.current;

      const isScene9Finale = currentSceneNum === 9;
      let primaryAgentId = "nova";
      if (currentSceneNum === 3) primaryAgentId = "codex";
      else if (currentSceneNum === 4) primaryAgentId = "matrix";
      else if (currentSceneNum === 5) primaryAgentId = "orbit";
      else if (currentSceneNum === 6) primaryAgentId = "cloudx";
      else if (currentSceneNum === 7) primaryAgentId = "neura";
      else if (currentSceneNum === 8) primaryAgentId = "titan";

      const activeBot = robots[primaryAgentId] || robots.nova;

      // First run initialization of scene activity director
      if (!sceneInitialized) {
        sceneInitialized = true;
        loadSceneTimeline(currentSceneNum, primaryAgentId);
      }

      // Handle Scene Changes -> Trigger Multi-Vector UFO Entry & Tractor Beam & Activity Timeline
      if (previousScene !== currentSceneNum) {
        previousScene = currentSceneNum;
        beamProgress = 1.0;
        soundFX.ufoBeam();

        const cfg = UFO_SECTION_CONFIGS[currentSceneNum] || UFO_SECTION_CONFIGS[1];
        ufoGroup.position.copy(cfg.spawnPos);
        ufoGroup.rotation.z = cfg.tiltZ;
        ufoGlowRingMat.color.setHex(cfg.glowColor);
        ufoThrusterMat.color.setHex(cfg.glowColor);
        ufoDomeMat.color.setHex(cfg.glowColor);
        tractorBeamMat.color.setHex(cfg.beamColor);

        // Reset all spin directors not on this scene
        Object.values(robots).forEach((bot) => {
          if (bot.assignedScene !== currentSceneNum) {
            bot.spinDirector?.reset();
          }
        });

        // Load scene activity timeline for the newly selected robot
        loadSceneTimeline(currentSceneNum, primaryAgentId);
      }

      const ufoCfg = UFO_SECTION_CONFIGS[currentSceneNum] || UFO_SECTION_CONFIGS[1];

      if (beamProgress > 0) {
        beamProgress = Math.max(0, beamProgress - delta * 0.7);
        // During beam entry, swoop smoothly into deployment position
        ufoGroup.position.lerp(ufoCfg.targetPos, 0.08);
        ufoGroup.rotation.z = THREE.MathUtils.lerp(ufoGroup.rotation.z, 0, 0.06);
      } else {
        // After beam finishes, smooth hover in high orbital overwatch above active robot
        const overwatchTargetX = activeBot.currentPos.x;
        const overwatchTargetY = THREE.MathUtils.clamp(activeBot.currentPos.y + 2.7, 1.4, boundY * 0.88);
        ufoGroup.position.x = THREE.MathUtils.lerp(ufoGroup.position.x, overwatchTargetX, 0.04);
        ufoGroup.position.y = THREE.MathUtils.lerp(ufoGroup.position.y, overwatchTargetY, 0.04);
        ufoGroup.position.z = THREE.MathUtils.lerp(ufoGroup.position.z, 0.35 + Math.sin(time * 2.0) * 0.06, 0.05);
      }

      ufoThrusterNodes.rotation.y = time * 4.0;
      ufoGlowRing.rotation.z = time * 2.0;
      tractorBeamMat.opacity = beamProgress * 0.8;

      // Detect project shift
      if (projectShiftRef.current !== lastProjectCounter) {
        lastProjectCounter = projectShiftRef.current;
        lastProjectShiftTime = time;
        soundFX.laserConnector(0.08);
        crossFadeAction(robots.titan, "agree", 0.2);
        setTimeout(() => crossFadeAction(robots.titan, "walk", 0.4), 1800);
      }

      // ── Storyline Scene Activity Director Update ──────────────────────────
      sceneActivityDirector.update(delta);

      // ── 360° Spin State of Active Robot ──────────────────────────────────
      const activeBot360 = robots[primaryAgentId] || robots.nova;
      const isActiveSpinning = activeBot360.spinDirector?.isSpinning() ?? false;

      // ── PHASE 2: Interactive Easter Eggs & Active Workbenches ───────────
      // --- Codex: Holographic desk & animated ripple keys ---
      codexHoloDesk.rotation.y = Math.sin(time * 1.5) * 0.1;
      const isCodexActive = primaryAgentId === "codex";
      if (isCodexActive) {
        const isCodexClicked = clickReactionTimer > 0 && clickedAgentId === "codex";
        const keySpeed = isCodexClicked ? 20.0 : 8.0;
        keyRows.children.forEach((keyMesh, idx) => {
          const row = Math.floor(idx / 8);
          const col = idx % 8;
          const keyWave = Math.sin(time * keySpeed + row * 0.5 + col * 0.2);
          keyMesh.position.y = 0.01 + Math.max(0, keyWave * (isCodexClicked ? 0.016 : 0.008));
        });
      }

      // --- Matrix: Server rack hover & sequential cascading LEDs ---
      matrixServerRack.position.y = Math.sin(time * 2.0) * 0.06;
      const isMatrixActive = primaryAgentId === "matrix";
      const isMatrixClicked = clickReactionTimer > 0 && clickedAgentId === "matrix";
      if (isMatrixActive) {
        serverLeds.forEach((ledMesh, idx) => {
          if (isMatrixClicked) {
            ledMesh.scale.set(1.9, 1.9, 1.9);
          } else {
            const ledCycle = Math.sin(time * 10.0 - idx * 1.2);
            const ledScale = ledCycle > 0.2 ? 1.35 : 0.85;
            ledMesh.scale.set(ledScale, ledScale, ledScale);
          }
        });
      }

      // --- Orbit: Database cylinders dynamic orbiting & breathing ---
      const isOrbitActive = primaryAgentId === "orbit";
      const isOrbitClicked = clickReactionTimer > 0 && clickedAgentId === "orbit";
      const orbitSpinRate = isOrbitClicked ? 9.5 : (isOrbitActive && isActiveSpinning ? 4.2 : 1.8);
      orbitDBCylinders.rotation.y += delta * orbitSpinRate;
      const orbitRadiusSpread = isOrbitClicked ? 0.08 : (isOrbitActive ? 0.03 * Math.sin(time * 3.0) : 0);
      orbitDBCylinders.children.forEach((cylGroup, idx) => {
        const baseOffsets = [-0.14, 0, 0.14];
        cylGroup.position.x = baseOffsets[idx] + (idx === 0 ? -orbitRadiusSpread : idx === 2 ? orbitRadiusSpread : 0);
        cylGroup.position.y = Math.sin(time * 2.0 + idx * 1.2) * 0.04;
      });

      // --- Cloud-X: Rotating Docker pods & CI/CD pipeline ring ---
      const isCloudxActive = primaryAgentId === "cloudx";
      const pipelineRate = isCloudxActive ? (isActiveSpinning ? 3.6 : 2.0) : 1.2;
      cloudxPipeline.rotation.z += delta * pipelineRate;
      if (isCloudxActive) {
        cloudxPods.forEach((pod, idx) => {
          const podPulse = Math.sin(time * 6.0 + idx * 2.1);
          const s = 1.0 + Math.max(0, podPulse * 0.25);
          pod.scale.set(s, s, s);
        });
      }

      // --- Neura: Synaptic neural sphere breathe & pulse waves ---
      neuraSphere.rotation.y = time * 1.5;
      neuraSphere.rotation.x = Math.sin(time * 1.2) * 0.2;
      const isNeuraActive = primaryAgentId === "neura";
      const isNeuraClicked = clickReactionTimer > 0 && clickedAgentId === "neura";
      const neuralCorePulse = isNeuraClicked ? 1.6 : (isNeuraActive ? 1.0 + Math.sin(time * 3.0) * 0.2 : 1.0);
      neuralCore.scale.set(neuralCorePulse, neuralCorePulse, neuralCorePulse);
      if (isNeuraActive) {
        synapseNodes.forEach((node, i) => {
          const phi = Math.acos(-1 + (2 * i) / 12);
          const theta = Math.sqrt(12 * Math.PI) * phi;
          const wave = Math.sin(time * 4.0 - i * 0.4);
          const baseRadius = isNeuraClicked ? 0.38 : 0.24;
          const rad = baseRadius + Math.max(0, wave * 0.09);
          node.position.setFromSphericalCoords(rad, phi, theta);
        });
      }

      // --- Titan: Wrist slate screen & pauldrons gleam ---
      const isTitanActive = primaryAgentId === "titan";
      if (isTitanActive) {
        const slateIntensity = (isActiveSpinning || activeBot.proceduralLayer?.getMode() === "wrist_check" || (time - lastProjectShiftTime < 3.0)) ? 1.0 : 0.7;
        amberGlowMat.opacity = slateIntensity;
        const pauldronGleam = 0.92 + Math.sin(time * 2.5) * 0.08;
        titanPauldronL.scale.set(pauldronGleam, pauldronGleam, pauldronGleam);
        titanPauldronR.scale.set(pauldronGleam, pauldronGleam, pauldronGleam);
      }

      // ── PHASE 2: 3D Holographic Connector Beam Update ──────────────────
      const isTargetingSkill = !!activeSkillCatRef.current && (primaryAgentId === "codex" || primaryAgentId === "matrix" || primaryAgentId === "orbit");
      const isTargetingProject = primaryAgentId === "titan" && (time - lastProjectShiftTime < 3.2);
      const isLaserActive = isTargetingSkill || isTargetingProject;

      if (isLaserActive) {
        if (isTargetingSkill) {
          _scratchTarget.set(-0.9, -0.05 + Math.sin(time * 2.5) * 0.08, 0.4);
        } else if (isTargetingProject) {
          _scratchTarget.set(0.65, -0.15, 0.45);
        }
      }

      const beamPulse = (isLaserActive ? 0.85 : 0.0) * (0.75 + Math.sin(time * 18.0) * 0.25);
      laserBeamMat.opacity = beamPulse;
      laserTargetReticleMat.opacity = beamPulse;

      if (isLaserActive) {
        laserBeam.visible = true;
        laserTargetReticle.visible = true;

        // Position laser start and hand emitter node directly at the pointing hand / wrist
        const pointingHand = activeBot.rightHandBone || activeBot.rightForeArmBone;
        const handWorldPos = new THREE.Vector3();
        if (pointingHand) {
          pointingHand.getWorldPosition(handWorldPos);
        } else {
          handWorldPos.set(
            activeBot.currentPos.x + (primaryAgentId === "titan" ? -0.15 : 0.15),
            activeBot.currentPos.y + 0.35,
            activeBot.currentPos.z + 0.15
          );
        }

        handEmitterNode.visible = true;
        handEmitterNode.position.copy(handWorldPos);
        handEmitterMat.color.copy(laserBeamMat.color);
        handEmitterMat.opacity = beamPulse;

        const posAttr = laserBeamGeom.getAttribute("position") as THREE.BufferAttribute;
        posAttr.setXYZ(0, handWorldPos.x, handWorldPos.y, handWorldPos.z);
        posAttr.setXYZ(1, _scratchTarget.x, _scratchTarget.y, _scratchTarget.z);
        posAttr.needsUpdate = true;

        laserTargetReticle.position.copy(_scratchTarget);
        laserTargetReticle.rotation.z += delta * 3.5;

        if (primaryAgentId === "codex") {
          laserBeamMat.color.setHex(0x38bdf8);
          laserTargetReticleMat.color.setHex(0x38bdf8);
        } else if (primaryAgentId === "matrix") {
          laserBeamMat.color.setHex(0x10b981);
          laserTargetReticleMat.color.setHex(0x10b981);
        } else if (primaryAgentId === "orbit") {
          laserBeamMat.color.setHex(0xa855f7);
          laserTargetReticleMat.color.setHex(0xa855f7);
        } else if (primaryAgentId === "titan") {
          laserBeamMat.color.setHex(0xf59e0b);
          laserTargetReticleMat.color.setHex(0xf59e0b);
        } else {
          laserBeamMat.color.setHex(0x00f0ff);
          laserTargetReticleMat.color.setHex(0x00f0ff);
        }
      } else {
        laserBeam.visible = false;
        laserTargetReticle.visible = false;
        handEmitterNode.visible = false;
      }

      // ── Click Aura Ripple & Jump Decay ──────────────────────────────────
      if (clickAuraOpacity > 0.01) {
        clickAuraScale += delta * 2.4;
        clickAuraOpacity = Math.max(0, clickAuraOpacity - delta * 1.6);
        clickAuraRing.scale.set(clickAuraScale, clickAuraScale, clickAuraScale);
        clickAuraRingMat.opacity = clickAuraOpacity;
        clickAuraRing.visible = true;
      } else {
        clickAuraRing.visible = false;
      }

      if (clickReactionTimer > 0) {
        clickReactionTimer = Math.max(0, clickReactionTimer - delta);
      }

      if (clickJumpOffset > 0) {
        clickJumpOffset = Math.max(0, clickJumpOffset - delta * 1.4);
        activeBot.root.position.y += Math.sin(clickJumpOffset * Math.PI) * 0.35;
      }

      // Check if user is scrolled into footer area
      const scrollBottom = typeof window !== "undefined" ? window.scrollY + window.innerHeight : 0;
      const docHeight = typeof document !== "undefined" ? document.documentElement.scrollHeight : 0;
      const isOverFooter = docHeight > 0 && scrollBottom >= docHeight - 340;

      ufoGroup.visible = !isOverFooter;

      // Manage Scale & Visibility (Single presenter vs Scene 09 Finale Assembly)
      const targetScaleBot = (id: string) => {
        if (isOverFooter) return 0.001; // Hide completely in footer so navigation and links remain clean
        if (isScene9Finale) return mobileMode ? 0.38 : 0.52; // All 7 in formation in #contact
        return id === primaryAgentId ? (mobileMode ? 0.65 : 0.88) : 0.001;
      };

      const applyScaleTransition = (bot: RobotInstance) => {
        const currentScale = bot.root.scale.x;
        const target = targetScaleBot(bot.id);
        const nextScale = THREE.MathUtils.lerp(currentScale, target, 0.1);
        bot.root.scale.set(nextScale, nextScale, nextScale);
        bot.root.visible = nextScale > 0.04;
      };

      Object.values(robots).forEach(applyScaleTransition);

      // Light breathing intensity in sleep
      const sleepBreathing = isSleeping ? 0.4 + Math.sin(time * 1.5) * 0.25 : 1.0;

      // ── 360° Spin Directors: tick all & pulse active robot's accent glow ──
      // During a spin: fast 3Hz brightness pulse. Otherwise: gentle sleep breathing.
      const spinPulse = isActiveSpinning
        ? 0.65 + 0.35 * Math.sin(time * Math.PI * 6)
        : sleepBreathing;

      cyanGlowMat.opacity   = 0.95 * spinPulse;
      blueGlowMat.opacity   = 0.95 * spinPulse;
      emeraldGlowMat.opacity = 0.95 * spinPulse;
      violetGlowMat.opacity = 0.95 * spinPulse;
      orangeGlowMat.opacity = 0.95 * spinPulse;
      amberGlowMat.opacity  = 0.95 * spinPulse;

      // Advance each visible robot's spin director (handles cooldown + spin phases)
      Object.values(robots).forEach((bot) => {
        if (bot.spinDirector && bot.root.visible) {
          bot.spinDirector.update(delta);
        }
      });

      // Camera Director Auto Shot & Smooth Transition
      cameraDirector.autoShot(currentSceneNum, isScene9Finale, activeBot.currentPos);
      cameraDirector.update(delta);

      // =========================================================
      // SCENE 09 FINALE ASSEMBLY: ALL 7 ASSEMBLED IN TACTICAL FORMATION
      // =========================================================
      if (isScene9Finale) {
        if (!hasPlayedScene9Finale) {
          hasPlayedScene9Finale = true;
          interactionDirector.playSequence(SCENE_09_FINALE);
        }
        interactionDirector.update(delta);

        // Grand Tiered Formation across the terminal deck
        const formationPositions: Record<string, [number, number, number]> = {
          titan: [0, -0.2, 0.4],         // Center Lead
          nova: [-1.4, -0.15, 0.1],      // Left Vanguard
          matrix: [-2.4, -0.1, -0.2],    // Far Left Flank
          codex: [1.4, -0.15, 0.1],       // Right Vanguard
          orbit: [2.4, -0.1, -0.2],      // Far Right Flank
          cloudx: [-0.75, 0.4, -0.4],    // Upper Left Tier
          neura: [0.75, 0.4, -0.4],      // Upper Right Tier
        };

        Object.entries(robots).forEach(([id, bot]) => {
          if (bot.mixer && bot.root.visible) {
            const [fx, fy, fz] = formationPositions[id] || [0, 0, 0];
            bot.targetPos.set(fx * (mobileMode ? 0.7 : 1.0), fy, fz);
            bot.currentPos.lerp(bot.targetPos, 0.08);
            bot.root.position.copy(bot.currentPos);
            bot.root.rotation.y = THREE.MathUtils.lerp(bot.root.rotation.y, 0, 0.08);

            if (bot.animController) {
              bot.animController.update(delta, 0.1);
            } else {
              bot.mixer.update(delta);
            }

            if (bot.proceduralLayer) {
              bot.proceduralLayer.setMode("lookAt", _scratchTarget);
              bot.proceduralLayer.update(delta, time);
            }
          }
        });
      } else {
        hasPlayedScene9Finale = false;
        // =========================================================
        // SCENES 01-08: SOLO PRESENTER FULL-SCREEN MOUSE ROAMING & STORYLINE
        // =========================================================
        const bot = robots[primaryAgentId] || robots.nova;
        if (bot && bot.mixer && bot.root.visible) {
          // ── Spin guard: freeze mouse-follow while spin is active ──────────
          const botIsSpinning = bot.spinDirector?.isSpinning() ?? false;

          if (!botIsSpinning) {
            if (isStoryTargetActive) {
              // Activity timeline overrides position target (e.g. walk_to, run_to)
              bot.targetPos.copy(storyTargetOverride);
            } else if (!isSleeping && inactiveDuration < 3.5) {
              // Direct mouse targeting across the ENTIRE viewport width and height
              bot.targetPos.x = cursorX;
              bot.targetPos.y = cursorY;
            } else {
              // Gentle ambient idle breathing sway when user is inactive
              const baseAnchorX = (primaryAgentId === "nova" || primaryAgentId === "titan") ? -roamRangeX * 0.45 : roamRangeX * 0.45;
              bot.targetPos.x = baseAnchorX + Math.sin(time * 0.5) * 0.25;
              bot.targetPos.y = -0.15 + Math.sin(time * 0.8) * 0.12;
            }
          }
          // While spinning: target stays frozen at last position (robot lifts in place)

          const vx = bot.targetPos.x - bot.currentPos.x;
          const vy = bot.targetPos.y - bot.currentPos.y;
          const dist = Math.hypot(vx, vy);

          // Face the exact direction of travel when moving
          if (!botIsSpinning) {
            if (dist > 0.08) {
              const targetHeading = Math.atan2(vx, 0.95);
              bot.heading = THREE.MathUtils.lerp(bot.heading, THREE.MathUtils.clamp(targetHeading, -1.2, 1.2), 0.14);
            } else {
              // Turn smoothly forward to face visitor when stopped
              bot.heading = THREE.MathUtils.lerp(bot.heading, 0, 0.1);
            }
          }

          // Smooth kinematic position update (responsive travel across screen)
          const moveLerpSpeed = (isStoryTargetActive && storyTargetRun) ? 0.09 : (dist > 1.2 ? 0.08 : 0.055);
          bot.currentPos.lerp(bot.targetPos, moveLerpSpeed);
          bot.root.position.copy(bot.currentPos);

          // During spin: rotation is controlled by spinDirector — don't overwrite it
          if (!botIsSpinning) {
            bot.root.rotation.y = THREE.MathUtils.lerp(bot.root.rotation.y, bot.heading, 0.12);
          }

          // Speed-synchronized locomotion (locks footsteps to actual displacement speed)
          const computedSpeed = (dist / Math.max(delta, 0.001)) * 0.1;
          const actualSpeed = botIsSpinning
            ? 0
            : (isStoryTargetActive && storyTargetRun && dist > 0.15 ? Math.max(computedSpeed, 2.4) : computedSpeed);

          if (bot.animController) {
            if (isSleeping) {
              bot.animController.triggerSleep();
            } else if (currentState === "success") {
              bot.animController.triggerGreet(1.5);
            } else if (currentState === "error") {
              bot.animController.triggerDisagree();
            } else {
              bot.animController.wakeUp();
            }
            bot.animController.update(delta, actualSpeed);
          } else {
            bot.mixer.update(delta);
            if (isSleeping) crossFadeAction(bot, "idle", 0.5);
            else if (dist > 0.08 && !botIsSpinning) crossFadeAction(bot, (isStoryTargetActive && storyTargetRun) ? "run" : "walk", 0.35);
            else crossFadeAction(bot, "idle", 0.35);
          }

          // Procedural Bone IK Layer (Story Activities / Pointing / Look-At)
          if (bot.proceduralLayer) {
            const currentPMode = bot.proceduralLayer.getMode();
            if (botIsSpinning) {
              // During spin: face neutral, no look-at fighting the Y rotation
              bot.proceduralLayer.reset();
            } else if (isLaserActive) {
              // Active targeting of card: smoothly aim arm & hand at target card!
              bot.proceduralLayer.setMode("point", _scratchTarget);
            } else if (currentPMode === "none" || currentPMode === "lookAt" || currentPMode === "point") {
              if (primaryAgentId === "titan" && projectShiftRef.current !== lastProjectCounter) {
                bot.proceduralLayer.setMode("point", new THREE.Vector3(0, 0.5, 0));
              } else if (!isSleeping) {
                bot.proceduralLayer.setMode("lookAt", _scratchTarget);
              } else {
                bot.proceduralLayer.reset();
              }
            }
            bot.proceduralLayer.update(delta, time);
          }
        }
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 10. Strict Cleanup Routine
    return () => {
      cancelAnimationFrame(animationFrameId);
      sceneActivityDirector.reset();
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);

      laserBeamGeom.dispose();
      laserBeamMat.dispose();
      laserTargetReticleGeom.dispose();
      laserTargetReticleMat.dispose();
      handEmitterGeom.dispose();
      handEmitterMat.dispose();
      clickAuraRingGeom.dispose();
      clickAuraRingMat.dispose();

      pmremGenerator.dispose();
      roomEnv.dispose();
      silverNovaMat.dispose();
      blueCodexMat.dispose();
      blackMatrixMat.dispose();
      purpleOrbitMat.dispose();
      whiteCloudXMat.dispose();
      cyanNeuraMat.dispose();
      goldTitanMat.dispose();
      obsidianChassisMat.dispose();
      industrialJointsMat.dispose();
      cyanGlowMat.dispose();
      blueGlowMat.dispose();
      emeraldGlowMat.dispose();
      violetGlowMat.dispose();
      orangeGlowMat.dispose();
      amberGlowMat.dispose();
      ufoGlowRingMat.dispose();
      ufoThrusterMat.dispose();
      ufoDomeMat.dispose();
      ufoSaucerDisc.geometry.dispose();
      ufoCockpitDome.geometry.dispose();
      ufoGlowRing.geometry.dispose();
      tractorBeamGeom.dispose();
      stardustGeom.dispose();
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
