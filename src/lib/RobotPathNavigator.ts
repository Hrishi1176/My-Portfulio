import * as THREE from "three";

export interface PathNavigatorOptions {
  acceleration?: number;
  maxWalkSpeed?: number;
  maxRunSpeed?: number;
  arrivalThreshold?: number;
}

export class RobotPathNavigator {
  private curve: THREE.CatmullRomCurve3 | null = null;
  private t: number = 0;
  private totalLength: number = 0;
  private currentSpeed: number = 0;
  private targetSpeed: number = 0;
  private arrived: boolean = true;
  private acceleration: number;
  private maxWalkSpeed: number;
  private maxRunSpeed: number;
  private currentHeading: number = 0;

  constructor(options?: PathNavigatorOptions) {
    this.acceleration = options?.acceleration ?? 2.4;
    this.maxWalkSpeed = options?.maxWalkSpeed ?? 1.4;
    this.maxRunSpeed = options?.maxRunSpeed ?? 3.6;
  }

  navigateTo(from: THREE.Vector3, to: THREE.Vector3, run = false): void {
    if (from.distanceTo(to) < 0.05) {
      this.arrived = true;
      this.currentSpeed = 0;
      return;
    }

    const mid = from.clone().lerp(to, 0.5);
    // Subtle perpendicular curve displacement for natural pathing
    const dir = to.clone().sub(from);
    const perp = new THREE.Vector3(-dir.z, 0, dir.x).normalize().multiplyScalar(0.2);
    mid.add(perp);

    this.curve = new THREE.CatmullRomCurve3([from.clone(), mid, to.clone()]);
    this.totalLength = Math.max(this.curve.getLength(), 0.001);
    this.t = 0;
    this.arrived = false;
    this.targetSpeed = run ? this.maxRunSpeed : this.maxWalkSpeed;
  }

  tick(delta: number): { position: THREE.Vector3; heading: number; speed: number; arrived: boolean } {
    if (!this.curve || this.arrived) {
      return {
        position: new THREE.Vector3(),
        heading: this.currentHeading,
        speed: 0,
        arrived: true,
      };
    }

    // Ease-in and Ease-out speed curve
    let targetCruise = this.targetSpeed;
    if (this.t < 0.2) {
      targetCruise = this.targetSpeed * Math.max(0.2, this.t / 0.2);
    } else if (this.t > 0.8) {
      targetCruise = this.targetSpeed * Math.max(0.15, (1.0 - this.t) / 0.2);
    }

    this.currentSpeed = THREE.MathUtils.lerp(
      this.currentSpeed,
      targetCruise,
      Math.min(1, delta * this.acceleration)
    );

    const step = (this.currentSpeed * delta) / this.totalLength;
    this.t = Math.min(1.0, this.t + step);

    if (this.t >= 0.995) {
      this.arrived = true;
      this.currentSpeed = 0;
      const finalPos = this.curve.getPointAt(1.0);
      return {
        position: finalPos,
        heading: this.currentHeading,
        speed: 0,
        arrived: true,
      };
    }

    const position = this.curve.getPointAt(this.t);
    const tangent = this.curve.getTangentAt(Math.min(1.0, this.t + 0.02));
    this.currentHeading = Math.atan2(tangent.x, tangent.z);

    return {
      position,
      heading: this.currentHeading,
      speed: this.currentSpeed,
      arrived: false,
    };
  }

  isArrived(): boolean {
    return this.arrived;
  }

  stop(): void {
    this.arrived = true;
    this.currentSpeed = 0;
  }
}
