import * as THREE from "three";

export interface ProceduralBones {
  headBone: THREE.Bone | null;
  neckBone: THREE.Bone | null;
  spineBone: THREE.Bone | null;
  rightShoulderBone?: THREE.Bone | null;
  rightForeArmBone?: THREE.Bone | null;
}

export type ProceduralMode = "none" | "lookAt" | "point" | "type" | "wave" | "nod" | "think" | "salute" | "guard" | "wrist_check";

export class RobotProceduralLayer {
  private bones: ProceduralBones;
  private mode: ProceduralMode = "none";
  private lookTarget: THREE.Vector3 = new THREE.Vector3();
  private pointTarget: THREE.Vector3 = new THREE.Vector3();
  private blendWeight: number = 0;
  private targetBlend: number = 0;
  private _scratchHead = new THREE.Vector3();
  private _scratchDir = new THREE.Vector3();

  // ── New mode state ──────────────────────────────────────────────
  private nodTimer = 0;           // counts up during nod gesture
  private nodPhase: "down" | "up" | "done" = "done";
  private wristCheckTimer = 0;    // counts up during wrist_check gesture
  private wristCheckPhase: "raise" | "hold" | "lower" | "done" = "done";
  private isGuard = false;        // guard mode flag
  private isThink = false;        // think pose flag
  private isSalute = false;       // salute pose flag

  constructor(bones: ProceduralBones) {
    this.bones = bones;
  }

  getMode(): ProceduralMode {
    return this.mode;
  }

  setMode(mode: ProceduralMode, target?: THREE.Vector3): void {
    this.mode = mode;
    this.targetBlend = mode === "none" ? 0 : 1;
    if (target) {
      if (mode === "lookAt") this.lookTarget.copy(target);
      if (mode === "point") this.pointTarget.copy(target);
    }
    if (mode === "nod") {
      this.nodTimer = 0;
      this.nodPhase = "down";
    }
    if (mode === "wrist_check") {
      this.wristCheckTimer = 0;
      this.wristCheckPhase = "raise";
    }
  }

  setLookTarget(target: THREE.Vector3): void {
    this.lookTarget.copy(target);
  }

  setPointTarget(target: THREE.Vector3): void {
    this.pointTarget.copy(target);
  }

  update(delta: number, time: number): void {
    this.blendWeight = THREE.MathUtils.lerp(
      this.blendWeight,
      this.targetBlend,
      Math.min(1, delta * 4.0)
    );

    if (this.blendWeight < 0.01) return;

    switch (this.mode) {
      case "lookAt":
        this.applyLookAt(this.lookTarget);
        break;
      case "point":
        this.applyPoint(time);
        break;
      case "type":
        this.applyTyping(time);
        break;
      case "wave":
        this.applyWave(time);
        break;
      case "nod":
        this.applyNod(delta);
        break;
      case "think":
        this.applyThink(time);
        break;
      case "salute":
        this.applySalute(time);
        break;
      case "guard":
        this.applyGuard(time);
        break;
      case "wrist_check":
        this.applyWristCheck(delta, time);
        break;
    }
  }

  private applyLookAt(target: THREE.Vector3): void {
    const { headBone, neckBone } = this.bones;
    if (!headBone) return;

    headBone.getWorldPosition(this._scratchHead);
    this._scratchDir.copy(target).sub(this._scratchHead).normalize();

    // Natural horizontal head turn only (yaw) - zero vertical pitch (no head down/up tilt)
    const yaw = Math.atan2(this._scratchDir.x, this._scratchDir.z);

    const w = this.blendWeight;
    headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, yaw * 0.55 * w, 0.14);
    // Keep head strictly level and upright (zero pitch down/up)
    headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, 0, 0.2);

    if (neckBone) {
      neckBone.rotation.y = THREE.MathUtils.lerp(neckBone.rotation.y, yaw * 0.25 * w, 0.1);
      neckBone.rotation.x = THREE.MathUtils.lerp(neckBone.rotation.x, 0, 0.2);
    }
  }

  private applyPoint(time: number): void {
    const { rightShoulderBone, rightForeArmBone } = this.bones;
    const w = this.blendWeight;

    if (rightShoulderBone) {
      rightShoulderBone.rotation.z = THREE.MathUtils.lerp(
        rightShoulderBone.rotation.z,
        -0.65 * w + Math.sin(time * 1.5) * 0.04,
        0.12
      );
      rightShoulderBone.rotation.x = THREE.MathUtils.lerp(
        rightShoulderBone.rotation.x,
        0.35 * w,
        0.12
      );
    }

    if (rightForeArmBone) {
      rightForeArmBone.rotation.z = THREE.MathUtils.lerp(
        rightForeArmBone.rotation.z,
        0.45 * w,
        0.12
      );
    }

    this.applyLookAt(this.pointTarget);
  }

  private applyTyping(time: number): void {
    const { rightForeArmBone, headBone } = this.bones;
    const w = this.blendWeight;

    if (rightForeArmBone) {
      rightForeArmBone.rotation.x = THREE.MathUtils.lerp(
        rightForeArmBone.rotation.x,
        Math.sin(time * 24.0) * 0.15 * w,
        0.3
      );
    }

    // Keep head level during typing, no bobbing down/up
    if (headBone) {
      headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, 0, 0.2);
    }
  }

  private applyWave(time: number): void {
    const { rightShoulderBone, rightForeArmBone } = this.bones;
    const w = this.blendWeight;

    if (rightShoulderBone) {
      rightShoulderBone.rotation.z = THREE.MathUtils.lerp(
        rightShoulderBone.rotation.z,
        (-0.75 + Math.sin(time * 4.0) * 0.25) * w,
        0.15
      );
    }

    if (rightForeArmBone) {
      rightForeArmBone.rotation.x = THREE.MathUtils.lerp(
        rightForeArmBone.rotation.x,
        Math.sin(time * 4.0 + 0.4) * 0.28 * w,
        0.15
      );
    }
  }

  private applyNod(delta: number): void {
    const { headBone } = this.bones;
    if (!headBone || this.nodPhase === "done") return;

    const NOD_DOWN_TIME = 0.28;
    const NOD_UP_TIME   = 0.32;

    this.nodTimer += delta;

    if (this.nodPhase === "down") {
      const t = Math.min(1, this.nodTimer / NOD_DOWN_TIME);
      headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, 0.3 * t, 0.3);
      if (t >= 1) {
        this.nodTimer = 0;
        this.nodPhase = "up";
      }
    } else {
      const t = Math.min(1, this.nodTimer / NOD_UP_TIME);
      headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, 0.3 * (1 - t), 0.25);
      if (t >= 1) {
        headBone.rotation.x = 0;
        this.nodPhase = "done";
        // After nod completes, return to previous mode if any
        if (this.mode === "nod") {
          this.mode = "none";
          this.targetBlend = 0;
        }
      }
    }
  }

  private applyThink(time: number): void {
    const { spineBone, headBone } = this.bones;
    const w = this.blendWeight;

    if (spineBone) {
      spineBone.rotation.x = THREE.MathUtils.lerp(
        spineBone.rotation.x,
        0.18 * w + Math.sin(time * 0.6) * 0.015,
        0.08
      );
    }
    if (headBone) {
      headBone.rotation.x = THREE.MathUtils.lerp(
        headBone.rotation.x,
        0.1 * w,
        0.08
      );
      // Slight slow side-to-side "pondering" head sway
      headBone.rotation.y = THREE.MathUtils.lerp(
        headBone.rotation.y,
        Math.sin(time * 0.9) * 0.08 * w,
        0.06
      );
    }
  }

  private applySalute(time: number): void {
    const { rightShoulderBone, rightForeArmBone } = this.bones;
    const w = this.blendWeight;

    if (rightShoulderBone) {
      // Raise arm up and inward toward head
      rightShoulderBone.rotation.z = THREE.MathUtils.lerp(
        rightShoulderBone.rotation.z,
        -0.85 * w,
        0.1
      );
      rightShoulderBone.rotation.x = THREE.MathUtils.lerp(
        rightShoulderBone.rotation.x,
        0.3 * w,
        0.1
      );
    }
    if (rightForeArmBone) {
      // Forearm bends in toward forehead
      rightForeArmBone.rotation.z = THREE.MathUtils.lerp(
        rightForeArmBone.rotation.z,
        0.55 * w + Math.sin(time * 1.2) * 0.02,
        0.1
      );
    }
  }

  private applyGuard(time: number): void {
    // Guard idle: very rigid. Apply tiny residual sway only.
    const { spineBone, headBone } = this.bones;
    const w = this.blendWeight;
    if (spineBone) {
      spineBone.rotation.z = THREE.MathUtils.lerp(
        spineBone.rotation.z,
        Math.sin(time * 0.4) * 0.012 * w,
        0.06
      );
      spineBone.rotation.x = THREE.MathUtils.lerp(spineBone.rotation.x, 0, 0.1);
    }
    if (headBone) {
      // Slow environmental scan: head turns slightly left-right every 4s
      const scanAngle = Math.sin(time * 0.5) * 0.18 * w;
      headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, scanAngle, 0.05);
      headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, 0, 0.1);
    }
  }

  private applyWristCheck(delta: number, time: number): void {
    const { rightForeArmBone, rightShoulderBone } = this.bones;
    if (this.wristCheckPhase === "done") return;

    const RAISE_T = 0.4;
    const HOLD_T  = 0.9;
    const LOWER_T = 0.4;

    this.wristCheckTimer += delta;

    if (this.wristCheckPhase === "raise") {
      const t = Math.min(1, this.wristCheckTimer / RAISE_T);
      if (rightShoulderBone) {
        rightShoulderBone.rotation.z = THREE.MathUtils.lerp(rightShoulderBone.rotation.z, -0.5 * t, 0.2);
      }
      if (rightForeArmBone) {
        rightForeArmBone.rotation.x = THREE.MathUtils.lerp(rightForeArmBone.rotation.x, 0.6 * t, 0.2);
      }
      if (t >= 1) { this.wristCheckTimer = 0; this.wristCheckPhase = "hold"; }
    } else if (this.wristCheckPhase === "hold") {
      // Subtle "reading" micro-shake
      if (rightForeArmBone) {
        rightForeArmBone.rotation.x = THREE.MathUtils.lerp(
          rightForeArmBone.rotation.x,
          0.6 + Math.sin(time * 8) * 0.025,
          0.3
        );
      }
      if (this.wristCheckTimer >= HOLD_T) { this.wristCheckTimer = 0; this.wristCheckPhase = "lower"; }
    } else {
      const t = Math.min(1, this.wristCheckTimer / LOWER_T);
      if (rightShoulderBone) {
        rightShoulderBone.rotation.z = THREE.MathUtils.lerp(rightShoulderBone.rotation.z, -0.5 * (1 - t), 0.2);
      }
      if (rightForeArmBone) {
        rightForeArmBone.rotation.x = THREE.MathUtils.lerp(rightForeArmBone.rotation.x, 0.6 * (1 - t), 0.2);
      }
      if (t >= 1) {
        this.wristCheckPhase = "done";
        if (rightShoulderBone) rightShoulderBone.rotation.z = 0;
        if (rightForeArmBone)  rightForeArmBone.rotation.x  = 0;
      }
    }
  }

  reset(): void {
    this.setMode("none");
  }

  /** Trigger a single head-dip nod gesture. */
  triggerNod(): void {
    this.nodTimer = 0;
    this.nodPhase = "down";
    this.targetBlend = 1;
  }

  /** Set guard idle mode (rigid stance, minimal spine sway). */
  setGuard(active: boolean): void {
    this.isGuard = active;
    if (active) {
      this.isThink = false;
      this.isSalute = false;
      this.mode = "guard";
      this.targetBlend = 1;
    } else if (this.mode === "guard") {
      this.mode = "none";
      this.targetBlend = 0;
    }
  }

  /** Set think pose (Neura forward lean + head dip). */
  setThink(active: boolean): void {
    this.isThink = active;
    if (active) {
      this.isGuard = false;
      this.isSalute = false;
      this.mode = "think";
      this.targetBlend = 1;
    } else if (this.mode === "think") {
      this.mode = "none";
      this.targetBlend = 0;
    }
  }

  /** Set salute pose (Nova right arm to head). */
  setSalute(active: boolean): void {
    this.isSalute = active;
    if (active) {
      this.isGuard = false;
      this.isThink = false;
      this.mode = "salute";
      this.targetBlend = 1;
    } else if (this.mode === "salute") {
      this.mode = "none";
      this.targetBlend = 0;
    }
  }

  /** Trigger the wrist-check forearm raise gesture. */
  triggerWristCheck(): void {
    this.wristCheckTimer = 0;
    this.wristCheckPhase = "raise";
    this.targetBlend = 1;
  }
}
