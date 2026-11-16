import * as THREE from "three";

export interface ProceduralBones {
  headBone: THREE.Bone | null;
  neckBone: THREE.Bone | null;
  spineBone: THREE.Bone | null;
  rightShoulderBone?: THREE.Bone | null;
  rightArmBone?: THREE.Bone | null;
  rightForeArmBone?: THREE.Bone | null;
  rightHandBone?: THREE.Bone | null;
  leftShoulderBone?: THREE.Bone | null;
  leftArmBone?: THREE.Bone | null;
  leftForeArmBone?: THREE.Bone | null;
  leftHandBone?: THREE.Bone | null;
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
  private _scratchAimQuat = new THREE.Quaternion();
  private _scratchLocalTarget = new THREE.Vector3();
  private _scratchLocalDir = new THREE.Vector3();
  private _scratchWorldPos = new THREE.Vector3();
  private _restDirRight = new THREE.Vector3(-1, 0, 0);
  private _restDirLeft = new THREE.Vector3(1, 0, 0);

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
    const {
      rightShoulderBone,
      rightArmBone,
      rightForeArmBone,
      rightHandBone,
      leftShoulderBone,
      leftArmBone,
      leftForeArmBone,
      leftHandBone,
    } = this.bones;
    const w = this.blendWeight;

    // Check which arm to point with:
    // When robot faces camera:
    // Right arm is on screen-left; Left arm is on screen-right.
    let useLeftArm = false;
    if (leftArmBone && leftArmBone.parent && rightArmBone && rightArmBone.parent) {
      this._scratchWorldPos.set(0, 0, 0);
      rightArmBone.getWorldPosition(this._scratchWorldPos);
      const rightArmX = this._scratchWorldPos.x;

      this._scratchWorldPos.set(0, 0, 0);
      leftArmBone.getWorldPosition(this._scratchWorldPos);
      const leftArmX = this._scratchWorldPos.x;

      const robotCenterX = (rightArmX + leftArmX) * 0.5;
      if (this.pointTarget.x > robotCenterX) {
        useLeftArm = true;
      }
    }

    if (useLeftArm && leftArmBone && leftArmBone.parent) {
      // Left arm aiming
      this._scratchLocalTarget.copy(this.pointTarget);
      leftArmBone.parent.worldToLocal(this._scratchLocalTarget);
      this._scratchLocalDir.copy(this._scratchLocalTarget).sub(leftArmBone.position).normalize();

      if (this._scratchLocalDir.lengthSq() > 0.001) {
        this._scratchAimQuat.setFromUnitVectors(this._restDirLeft, this._scratchLocalDir);
        leftArmBone.quaternion.slerp(this._scratchAimQuat, Math.min(1, w * 0.96));
      }
      if (leftForeArmBone) {
        this._scratchAimQuat.setFromEuler(new THREE.Euler(0, 0, Math.sin(time * 3.5) * 0.02));
        leftForeArmBone.quaternion.slerp(this._scratchAimQuat, w * 0.88);
      }
      if (leftHandBone) {
        this._scratchAimQuat.identity();
        leftHandBone.quaternion.slerp(this._scratchAimQuat, w * 0.88);
      }
      if (leftShoulderBone) {
        leftShoulderBone.rotation.z = THREE.MathUtils.lerp(leftShoulderBone.rotation.z, 0.12 * w, 0.1);
      }

      // Smoothly relax right arm when left arm is aiming
      if (rightArmBone) {
        this._scratchAimQuat.identity();
        rightArmBone.quaternion.slerp(this._scratchAimQuat, 0.12);
      }
    } else if (rightArmBone && rightArmBone.parent) {
      // Right arm aiming (as in screenshot)
      this._scratchLocalTarget.copy(this.pointTarget);
      rightArmBone.parent.worldToLocal(this._scratchLocalTarget);
      this._scratchLocalDir.copy(this._scratchLocalTarget).sub(rightArmBone.position).normalize();

      if (this._scratchLocalDir.lengthSq() > 0.001) {
        this._scratchAimQuat.setFromUnitVectors(this._restDirRight, this._scratchLocalDir);
        rightArmBone.quaternion.slerp(this._scratchAimQuat, Math.min(1, w * 0.96));
      }

      if (rightForeArmBone) {
        // Subtle micro-energy pulse on the forearm
        this._scratchAimQuat.setFromEuler(new THREE.Euler(0, 0, Math.sin(time * 3.5) * 0.02));
        rightForeArmBone.quaternion.slerp(this._scratchAimQuat, w * 0.88);
      }

      if (rightHandBone) {
        // Wrist straightens to align beam forward
        this._scratchAimQuat.identity();
        rightHandBone.quaternion.slerp(this._scratchAimQuat, w * 0.88);
      }

      if (rightShoulderBone) {
        // Slight clavicle elevation for natural posture
        rightShoulderBone.rotation.z = THREE.MathUtils.lerp(
          rightShoulderBone.rotation.z,
          -0.12 * w,
          0.1
        );
      }

      // Smoothly relax left arm when right arm is aiming
      if (leftArmBone) {
        this._scratchAimQuat.identity();
        leftArmBone.quaternion.slerp(this._scratchAimQuat, 0.12);
      }
    } else if (rightShoulderBone && rightForeArmBone) {
      // Fallback if rightArmBone wasn't bound
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
    const { rightShoulderBone, rightArmBone, rightForeArmBone } = this.bones;
    const w = this.blendWeight;

    if (rightArmBone) {
      this._scratchAimQuat.setFromEuler(
        new THREE.Euler(0.2 * w, 0, -1.2 * w)
      );
      rightArmBone.quaternion.slerp(this._scratchAimQuat, 0.15);
    } else if (rightShoulderBone) {
      rightShoulderBone.rotation.z = THREE.MathUtils.lerp(
        rightShoulderBone.rotation.z,
        (-0.75 + Math.sin(time * 4.0) * 0.25) * w,
        0.15
      );
    }

    if (rightForeArmBone) {
      rightForeArmBone.rotation.x = THREE.MathUtils.lerp(
        rightForeArmBone.rotation.x,
        Math.sin(time * 4.5 + 0.4) * 0.35 * w,
        0.2
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
    const { rightShoulderBone, rightArmBone, rightForeArmBone, rightHandBone } = this.bones;
    const w = this.blendWeight;

    if (rightArmBone) {
      this._scratchAimQuat.setFromEuler(
        new THREE.Euler(0.3 * w, 0.4 * w, -1.1 * w)
      );
      rightArmBone.quaternion.slerp(this._scratchAimQuat, 0.15);
    } else if (rightShoulderBone) {
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
        0.65 * w + Math.sin(time * 1.2) * 0.02,
        0.12
      );
    }
    if (rightHandBone) {
      rightHandBone.quaternion.identity();
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
    const { rightForeArmBone, rightShoulderBone, rightArmBone } = this.bones;
    if (this.wristCheckPhase === "done") return;

    const RAISE_T = 0.4;
    const HOLD_T  = 0.9;
    const LOWER_T = 0.4;

    this.wristCheckTimer += delta;

    if (this.wristCheckPhase === "raise") {
      const t = Math.min(1, this.wristCheckTimer / RAISE_T);
      if (rightArmBone) {
        this._scratchAimQuat.setFromEuler(new THREE.Euler(0.4 * t, 0.2 * t, -0.6 * t));
        rightArmBone.quaternion.slerp(this._scratchAimQuat, 0.2);
      } else if (rightShoulderBone) {
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
      if (rightArmBone) {
        this._scratchAimQuat.setFromEuler(new THREE.Euler(0.4 * (1 - t), 0.2 * (1 - t), -0.6 * (1 - t)));
        rightArmBone.quaternion.slerp(this._scratchAimQuat, 0.2);
      } else if (rightShoulderBone) {
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
