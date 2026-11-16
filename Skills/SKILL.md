---
name: robotverse-3d-portfolio
description: "Specialized engineering guide and skill for maintaining, debugging, and extending the Three.js 3D Robotverse companion, procedural inverse kinematics, scene timelines, and interactive WebGL layer in Hrishi Bhattacharyya's portfolio."
risk: critical
source: portfolio-internal-architecture
date_added: 2026-11-17
---

# 🤖 Robotverse 3D Portfolio Architecture & Engineering Skill

Expert specification and maintenance guide for the **Three.js WebGL Robotverse Companion**, **Procedural Bilateral Inverse Kinematics (IK)**, **Storyline Timeline Director**, and **Interactive 3D Web Systems** in this portfolio.

---

## 🏛️ 1. 3D Architectural Overview

The portfolio features a hybrid rendering architecture:
1. **HTML/DOM Content Layer**: Next.js 16 Server & Client Components styled with Tailwind CSS 4 and animated via Framer Motion and GSAP.
2. **WebGL Background Canvas Layer**: A fixed, full-viewport Three.js `<canvas>` (`ThreeRobotCompanion.tsx`) positioned behind the DOM with pointer-events pass-through (`pointer-events-none`).
3. **Interactive 3D Elements**:
   - `ThreeRobotCompanion.tsx`: Main 7-agent robot squad with dynamic bilateral IK, laser targeting, and scene-activity animations.
   - `Hero3DCore.tsx`: Canvas visual anchor in the Hero section.
   - `TiltCard.tsx`: Real-time mouse tilt, 3D perspective depth, and dynamic glare reflection.
   - `Projects.tsx`: 3D Spatial Coverflow deck with Z-depth layering and swipe gestures.
   - `ChatbotRobotCompanion.tsx`: Mini autonomous 3D robot (AXIOM) embedded inside the AI Chatbot drawer.

---

## 🦾 2. Robotverse Multi-Agent Roster & Scene Mapping

The 3D companion shifts character, role, codename, and particle glow as the user navigates across the 9 portfolio sections:

| Scene # | Sector / Anchor | Agent ID | Codename | Role | Primary Shader Glow |
|---|---|---|---|---|---|
| **01** | `#hero` | `nova` | NOVA-01 | UI & Systems Navigator | Cyan (`#00f0ff`) |
| **02** | `#about`, `#impact` | `codex` | CODEX-02 | Core Architecture | Sky Blue (`#38bdf8`) |
| **03** | `#skills` | `matrix` | MATRIX-03 | Systems & Cloud Architect | Emerald (`#10b981`) |
| **04** | `#experience` | `orbit` | ORBIT-04 | Career & Experience Navigator | Purple (`#a855f7`) |
| **05** | `#projects` | `cloudx` | CLOUDX-05 | Distributed Cloud & DevOps | Amber/Orange (`#f97316`) |
| **06** | `#reviews` | `neura` | NEURA-06 | Telemetry & Data Intelligence | Cyan/Purple (`#06b6d4`) |
| **07** | `#analytics` | `neura` | NEURA-06 | Mission Control Intelligence | Emerald/Cyan (`#10b981`) |
| **08** | `#education` | `titan` | TITAN-07 | Academic & Credentials | Gold/Amber (`#f59e0b`) |
| **09** | `#contact` | `sentinel` / `all` | SENTINEL-X | Full-Stack Division Coordinator | All 7 Agents Formation |

---

## 📐 3. Procedural Inverse Kinematics (`RobotProceduralLayer.ts`)

The robot is driven by custom procedural animation layered over skeletal bones (`SkinnedMesh`).

### Skeletal Bone Naming Convention
The 3D model expects standard humanoid bone hierarchy:
- Head / Neck: `head`, `neck`
- Spine / Torso: `spine`, `spine1`, `spine2`, `hips`
- Right Arm: `upper_arm.R`, `forearm.R`, `hand.R`
- Left Arm: `upper_arm.L`, `forearm.L`, `hand.L`

### Bilateral Two-Bone IK Solver
The two-bone IK solver calculates shoulder pitch/yaw and elbow flexion in closed form:
```
Distance to target = D = clamp(||Target - Shoulder||, min_reach, L1 + L2)
Angle at elbow = θ_elbow = acos((L1² + L2² - D²) / (2 * L1 * L2))
Angle at shoulder = θ_shoulder = atan2(y, x) ± acos((L1² + D² - L2²) / (2 * L1 * D))
```
- **Elbow Flexion Constraint**: Clamped between `0.0` (fully extended) and `2.4` radians (fully bent).
- **Arm Selection**: Automatically selects the right arm for targets on the right side of the screen (`targetX >= 0`), and the left arm for targets on the left side (`targetX < 0`).
- **Laser Emitter Node**: Attached to the active wrist bone. Points in the exact direction of the laser aim vector.

---

## 🎯 4. Real-Time Laser Reticle & Screen-to-World Raycasting

The laser pointer tracks the user's cursor across every section of the portfolio.

### Coordinate Transformation
Cursor screen coordinates `(pixelX, pixelY)` are converted to 3D world space at target plane `Z = targetZ`:
```typescript
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
```

### Invariants:
- Never replace `screenToWorld(currentMousePixelX, currentMousePixelY, ...)` with a fixed 3D coordinate vector.
- On touch devices, register both `touchmove` and `touchstart` to update target coordinates instantly.

---

## 🎬 5. Scene Activity Director (`src/lib/sceneActivities.ts`)

When a user scrolls to a new section, `RobotSceneActivityDirector` executes a scripted activity sequence.

### Mandatory Structure
```typescript
export const SCENE_ACTIVITIES: Record<number, SceneActivityConfig> = {
  [sceneNumber]: {
    duration: 4.5,
    steps: [
      { at: 0.0, action: "jump_in" },
      { at: 0.4, action: "wave" },
      { at: 1.2, action: "point_screen" },
      { at: 2.5, action: "scan" },
      { at: 4.2, action: "idle_reset" }, // ⚠️ NEVER REMOVE THIS STEP!
    ],
  },
};
```

> [!CAUTION]
> Every scene sequence **MUST** conclude with `{ at: ..., action: "idle_reset" }`.
> `idle_reset` releases procedural override locks, resets `isActivityRunning = false`, and restores dynamic mouse-following and laser reticle tracking. If omitted, the robot freezes in place indefinitely.

---

## 📱 6. Mobile Responsiveness & Performance Budgets

### Device Targets & Budgets
| Metric | Desktop (1024px+) | Mobile Phone (< 768px) |
|---|---|---|
| **Target FPS** | 60 FPS | 30–60 FPS |
| **Renderer Pixel Ratio** | `Math.min(window.devicePixelRatio, 1.5)` | Limited to `1.0`–`1.2` |
| **Camera Distance** | `Z = 7.2` | `Z = 8.5` (scaled to fit narrower aspect ratio) |
| **Roam Range X** | `boundX * 0.82` | `boundX * 0.72` |
| **Robot Scale** | `0.88` (Single) / `0.52` (Scene 9) | `0.65` (Single) / `0.38` (Scene 9) |
| **Section 360 Spin** | Full 360° jump + spin | Jump + land only (`skipSpin: true` on mobile) |
| **Footer Visibility** | Hidden (`scale = 0.001`) | Hidden (`scale = 0.001`) |

### WebGL Lifecycle Management
- **Resize Handler**: Update `camera.aspect = width / height`, `camera.updateProjectionMatrix()`, and `renderer.setSize(width, height)`.
- **Cleanup**: In `useEffect` return handler, dispose of all geometries (`geom.dispose()`), materials (`mat.dispose()`), textures, and remove window event listeners (`mousemove`, `touchmove`, `touchstart`, `resize`).

---

## 🔊 7. Audio FX Synthesis (`src/utils/audioFX.ts`)

Sound effects are synthesized in real-time via the browser's Web Audio API using `AudioContext`, oscillators, and gain ramps.
- **Zero MP3 asset overhead**: No network latency, 0 external audio files needed.
- **Sound Palette**:
  - `laser`: Synthesized frequency ramp from 880Hz down to 220Hz.
  - `wakeChirp`: Dual high-pitch chirp (1200Hz -> 1800Hz) on wake/touch.
  - `warp`: Deep resonant sweep (150Hz -> 600Hz) on scene transitions.
  - `error`: Low sawtooth pulse (180Hz) on invalid inputs.
- **Mute Respect**: Always check `soundEnabled` in `RobotCompanionContext` before calling audio functions.

---

## 🛠️ 8. Step-by-Step Checklist for Future 3D Extensions

When adding new 3D animations, models, or interactions:
1. **Check Bone Names**: Confirm the GLTF mesh matches standard bone names or map them via `RobotProceduralLayer.ts`.
2. **Update Context**: If adding a new agent, register the agent ID in `RobotAgentId` in `src/context/RobotCompanionContext.tsx`.
3. **Add Dialogue**: Add the agent's speech and codename in `ROBOTVERSE_AGENTS` array.
4. **Update Activity Timeline**: Add the scene's steps in `src/lib/sceneActivities.ts`, ending with `idle_reset`.
5. **Verify Compilation**:
   ```bash
   npx tsc --noEmit
   npx next build
   ```
