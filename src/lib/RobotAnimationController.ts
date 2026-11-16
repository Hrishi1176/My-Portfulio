import * as THREE from "three";

export type AnimState =
  | "IDLE"
  | "WALK"
  | "RUN"
  | "SLEEP"
  | "GREET"
  | "POINT"
  | "WORK"
  | "TURN"
  | "SNEAK";

export interface RobotAnimControllerOptions {
  mixer: THREE.AnimationMixer;
  actions: Record<string, THREE.AnimationAction>;
  referenceWalkSpeed?: number;
  referenceRunSpeed?: number;
}

export class RobotAnimController {
  private mixer: THREE.AnimationMixer;
  private actions: Record<string, THREE.AnimationAction>;
  private currentState: AnimState = "IDLE";
  private activeActionName: string = "idle";
  private referenceWalkSpeed: number;
  private referenceRunSpeed: number;
  private smoothedSpeed: number = 0;
  private greetTimer: number = 0;

  constructor(options: RobotAnimControllerOptions) {
    this.mixer = options.mixer;
    this.actions = options.actions;
    this.referenceWalkSpeed = options.referenceWalkSpeed ?? 1.4;
    this.referenceRunSpeed = options.referenceRunSpeed ?? 3.6;

    // Start with idle
    if (this.actions["idle"]) {
      this.actions["idle"].reset().setEffectiveWeight(1).play();
      this.activeActionName = "idle";
    }
  }

  update(delta: number, rawSpeed: number, overrideState?: AnimState): void {
    // 1. Smooth velocity over time
    this.smoothedSpeed = THREE.MathUtils.lerp(this.smoothedSpeed, Math.max(0, rawSpeed), 0.15);

    // 2. Decrement greet timer if active
    if (this.greetTimer > 0) {
      this.greetTimer -= delta;
      if (this.greetTimer <= 0 && this.currentState === "GREET") {
        this.transition("IDLE", 0.4);
      }
    }

    // 3. Determine target state
    let targetState = overrideState;
    if (!targetState && this.greetTimer <= 0) {
      if (this.currentState === "SLEEP") {
        targetState = "SLEEP";
      } else {
        targetState = this.speedToState(this.smoothedSpeed);
      }
    }

    // 4. Transition if state changed
    if (targetState && targetState !== this.currentState) {
      this.transition(targetState);
    }

    // 5. Speed-sync timeScale for walk/run to prevent sliding
    this.syncTimeScale();

    // 6. Step animation mixer
    this.mixer.update(delta);
  }

  private speedToState(speed: number): AnimState {
    if (speed < 0.05) return "IDLE";
    if (speed < 1.3) return "WALK";
    return "RUN";
  }

  private stateToClipName(state: AnimState): string {
    switch (state) {
      case "IDLE":
      case "WORK":
      case "POINT":
      case "TURN":
      case "SLEEP":
        return "idle";
      case "WALK":
        return "walk";
      case "RUN":
        return "run";
      case "GREET":
        return "agree";
      case "SNEAK":
        return "sneak_pose";
      default:
        return "idle";
    }
  }

  private transition(next: AnimState, duration = 0.3): void {
    if (this.currentState === next && this.greetTimer <= 0) return;
    this.currentState = next;

    const nextClip = this.stateToClipName(next);
    if (nextClip === this.activeActionName && this.actions[nextClip]?.isRunning()) {
      return;
    }

    const fromAction = this.actions[this.activeActionName];
    const toAction = this.actions[nextClip] || this.actions["idle"];

    if (toAction) {
      toAction.reset();
      toAction.enabled = true;
      toAction.setEffectiveWeight(1);
      toAction.play();

      if (fromAction && fromAction !== toAction) {
        fromAction.crossFadeTo(toAction, duration, true);
      }
      this.activeActionName = nextClip;
    }
  }

  private syncTimeScale(): void {
    if (this.currentState === "WALK") {
      const scale = this.smoothedSpeed / this.referenceWalkSpeed;
      const clip = this.actions["walk"];
      if (clip) {
        clip.timeScale = THREE.MathUtils.clamp(scale, 0.4, 2.2);
      }
    } else if (this.currentState === "RUN") {
      const scale = this.smoothedSpeed / this.referenceRunSpeed;
      const clip = this.actions["run"];
      if (clip) {
        clip.timeScale = THREE.MathUtils.clamp(scale, 0.6, 2.0);
      }
    } else {
      const idleClip = this.actions["idle"];
      if (idleClip) idleClip.timeScale = 1.0;
    }
  }

  triggerGreet(duration = 1.8): void {
    this.greetTimer = duration;
    this.transition("GREET", 0.25);
  }

  triggerSleep(): void {
    this.greetTimer = 0;
    this.transition("SLEEP", 0.6);
  }

  wakeUp(): void {
    if (this.currentState === "SLEEP") {
      this.transition("IDLE", 0.35);
    }
  }

  triggerDisagree(): void {
    const shake = this.actions["headShake"];
    if (shake) {
      const current = this.actions[this.activeActionName];
      shake.reset().setEffectiveWeight(1).play();
      if (current) current.crossFadeTo(shake, 0.2, true);
      setTimeout(() => {
        if (current) shake.crossFadeTo(current, 0.3, true);
      }, 1500);
    }
  }

  getState(): AnimState {
    return this.currentState;
  }

  getSmoothedSpeed(): number {
    return this.smoothedSpeed;
  }
}
