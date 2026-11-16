import * as THREE from "three";

export interface ProceduralBones {
  headBone: THREE.Bone | null;
  neckBone: THREE.Bone | null;
  spineBone: THREE.Bone | null;
  rightShoulderBone?: THREE.Bone | null;
  rightForeArmBone?: THREE.Bone | null;
}

export type ProceduralMode = "none" | "lookAt" | "point" | "type" | "wave";

export class RobotProceduralLayer {
  private bones: ProceduralBones;
  private mode: ProceduralMode = "none";
  private lookTarget: THREE.Vector3 = new THREE.Vector3();
  private pointTarget: THREE.Vector3 = new THREE.Vector3();
  private blendWeight: number = 0;
  private targetBlend: number = 0;
  private _scratchHead = new THREE.Vector3();
  private _scratchDir = new THREE.Vector3();

  constructor(bones: ProceduralBones) {
    this.bones = bones;
  }

  setMode(mode: ProceduralMode, target?: THREE.Vector3): void {
    this.mode = mode;
    this.targetBlend = mode === "none" ? 0 : 1;
    if (target) {
      if (mode === "lookAt") this.lookTarget.copy(target);
      if (mode === "point") this.pointTarget.copy(target);
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

  reset(): void {
    this.setMode("none");
  }
}
