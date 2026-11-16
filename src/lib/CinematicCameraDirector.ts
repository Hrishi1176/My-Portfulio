import * as THREE from "three";

export type CameraShot = "WIDE" | "MEDIUM" | "FOLLOW" | "OVER_SHOULDER" | "CLOSE_UP";

export interface ShotConfig {
  x?: number;
  y?: number;
  z: number;
  fov: number;
}

const DEFAULT_SHOTS: Record<CameraShot, ShotConfig> = {
  WIDE: { x: 0, y: 0.3, z: 9.2, fov: 50 },
  MEDIUM: { x: 0, y: 0.0, z: 7.2, fov: 45 },
  CLOSE_UP: { x: 0, y: 0.2, z: 5.6, fov: 38 },
  OVER_SHOULDER: { x: 1.8, y: 0.3, z: 6.2, fov: 42 },
  FOLLOW: { x: 0, y: 0.0, z: 7.2, fov: 45 },
};

export class CinematicCameraDirector {
  private camera: THREE.PerspectiveCamera;
  private currentShot: CameraShot = "MEDIUM";
  private targetX: number = 0;
  private targetY: number = 0;
  private targetZ: number = 7.2;
  private targetFov: number = 45;
  private lerpSpeed: number = 0.04;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.targetZ = camera.position.z;
    this.targetFov = camera.fov;
  }

  setShot(shot: CameraShot, agentPosition?: THREE.Vector3): void {
    this.currentShot = shot;
    const cfg = DEFAULT_SHOTS[shot];

    this.targetZ = cfg.z;
    this.targetFov = cfg.fov;
    this.targetY = cfg.y ?? 0;

    if (shot === "OVER_SHOULDER") {
      this.targetX = cfg.x ?? 1.8;
    } else if (shot === "FOLLOW" && agentPosition) {
      this.targetX = agentPosition.x * 0.35;
    } else {
      this.targetX = 0;
    }
  }

  update(delta: number): void {
    const s = Math.min(1, this.lerpSpeed + delta * 0.5);

    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, this.targetX, s);
    this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, this.targetY, s);
    this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, this.targetZ, s);

    if (Math.abs(this.camera.fov - this.targetFov) > 0.05) {
      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.targetFov, s * 0.5);
      this.camera.updateProjectionMatrix();
    }
  }

  autoShot(sceneNum: number, isScene9Finale: boolean, activeAgentPos?: THREE.Vector3): void {
    if (isScene9Finale) {
      this.setShot("WIDE");
    } else if (sceneNum === 3) {
      this.setShot("OVER_SHOULDER", activeAgentPos);
    } else {
      this.setShot("MEDIUM", activeAgentPos);
    }
  }

  getShot(): CameraShot {
    return this.currentShot;
  }
}
