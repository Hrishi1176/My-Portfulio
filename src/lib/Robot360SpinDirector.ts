import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// Robot360SpinDirector
// Controls the section-entry 360° turntable spin for a single robot root.
//
// State machine:  STANDBY → RISING → SPINNING → LANDING → IDLE
//
// Usage (inside ThreeRobotCompanion RAF loop):
//   director.triggerSpin();   // call once when robot's section enters viewport
//   director.update(delta);   // call every frame
//   director.reset();         // call when section leaves
// ─────────────────────────────────────────────────────────────────────────────

export type SpinState =
  | "STANDBY"   // waiting for section entry
  | "RISING"    // lifting off the ground (pre-spin)
  | "SPINNING"  // full 360° Y-axis rotation
  | "LANDING"   // settling back to baseline
  | "IDLE";     // finished — robot faces front, greet plays

export interface SpinDirectorOptions {
  root: THREE.Group;
  /** Y position the robot rests at. Default 0. */
  baseY?: number;
  /** World units to rise during spin arc. Default 0.18. */
  liftHeight?: number;
  /** Full rotations per second during the spin phase. Default 0.72. */
  spinSpeed?: number;
  /** Seconds to rise before spinning. Default 0.22. */
  riseTime?: number;
  /** Seconds to land after spinning. Default 0.28. */
  landTime?: number;
  /** Called when LANDING phase begins (triggers greet on the animController). */
  onSpinComplete?: () => void;
  /** If true the full spin is skipped — only a quick lift+land plays. Mobile guard. */
  skipSpin?: boolean;
}

// ─── Easing helpers ──────────────────────────────────────────────────────────
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInCubic(t: number): number {
  return t * t * t;
}

// ─── Director ────────────────────────────────────────────────────────────────
export class Robot360SpinDirector {
  private root: THREE.Group;
  private baseY: number;
  private liftHeight: number;
  private spinSpeed: number;
  private riseTime: number;
  private landTime: number;
  private skipSpin: boolean;
  private onSpinComplete?: () => void;

  private state: SpinState = "STANDBY";
  private phaseElapsed = 0;
  /** Accumulated Y rotation added by this director (so we don't clobber external rotation). */
  private accumulatedRotY = 0;
  /** Guard — prevents re-triggering for `cooldown` seconds after a spin finishes. */
  private cooldownRemaining = 0;
  private readonly COOLDOWN = 3.0;

  // The total spin duration is computed dynamically from spinSpeed (1 full rev = 1/spinSpeed seconds)
  get spinDuration(): number {
    return 1 / this.spinSpeed;
  }

  constructor(options: SpinDirectorOptions) {
    this.root = options.root;
    this.baseY = options.baseY ?? 0;
    this.liftHeight = options.liftHeight ?? 0.18;
    this.spinSpeed = options.spinSpeed ?? 0.72;
    this.riseTime = options.riseTime ?? 0.22;
    this.landTime = options.landTime ?? 0.28;
    this.skipSpin = options.skipSpin ?? false;
    this.onSpinComplete = options.onSpinComplete;
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /** Kick off the spin sequence. Safe to call multiple times — debounced by cooldown. */
  triggerSpin(): void {
    if (
      this.state !== "STANDBY" ||
      this.cooldownRemaining > 0
    ) return;

    this.phaseElapsed = 0;
    this.accumulatedRotY = 0;
    this.state = "RISING";
  }

  /** Must be called every RAF frame while the robot is active. */
  update(delta: number): void {
    // Tick cooldown
    if (this.cooldownRemaining > 0) {
      this.cooldownRemaining = Math.max(0, this.cooldownRemaining - delta);
    }

    switch (this.state) {
      case "STANDBY":
      case "IDLE":
        return;

      case "RISING":
        this._updateRising(delta);
        break;

      case "SPINNING":
        this._updateSpinning(delta);
        break;

      case "LANDING":
        this._updateLanding(delta);
        break;
    }
  }

  /** Call when the robot's section leaves the viewport. Snaps back to standby cleanly. */
  reset(): void {
    if (this.state === "STANDBY" || this.state === "IDLE") {
      // Already at rest — just ensure Y rotation is zeroed over time (handled outside)
      this.state = "STANDBY";
      this.phaseElapsed = 0;
      this.accumulatedRotY = 0;
      this.cooldownRemaining = 0;
      return;
    }
    // Mid-spin reset: snap cleanly
    this.state = "STANDBY";
    this.phaseElapsed = 0;
    this.accumulatedRotY = 0;
    this._applyLift(0); // settle Y
  }

  isSpinning(): boolean {
    return this.state === "RISING" || this.state === "SPINNING" || this.state === "LANDING";
  }

  getState(): SpinState {
    return this.state;
  }

  // ── Phase Handlers ─────────────────────────────────────────────────────────

  private _updateRising(delta: number): void {
    this.phaseElapsed += delta;
    const t = Math.min(1, this.phaseElapsed / this.riseTime);
    this._applyLift(easeOutCubic(t) * this.liftHeight);

    if (t >= 1) {
      this.phaseElapsed = 0;
      this.state = this.skipSpin ? "LANDING" : "SPINNING";
    }
  }

  private _updateSpinning(delta: number): void {
    this.phaseElapsed += delta;

    // Spin progress 0→1 over spinDuration
    const rawT = Math.min(1, this.phaseElapsed / this.spinDuration);
    const easedT = easeInOutCubic(rawT);

    // Apply rotation — target is exactly 2π (one full revolution)
    const targetRotY = easedT * Math.PI * 2;
    const diff = targetRotY - this.accumulatedRotY;
    this.root.rotation.y += diff;
    this.accumulatedRotY = targetRotY;

    // Keep at lift height during spin
    this._applyLift(this.liftHeight);

    if (rawT >= 1) {
      // Snap to clean 0 rotation mod 2π
      this.root.rotation.y = this.root.rotation.y % (Math.PI * 2);
      this.accumulatedRotY = 0;
      this.phaseElapsed = 0;
      this.state = "LANDING";
      this.onSpinComplete?.();
    }
  }

  private _updateLanding(delta: number): void {
    this.phaseElapsed += delta;
    const t = Math.min(1, this.phaseElapsed / this.landTime);
    this._applyLift((1 - easeInCubic(t)) * this.liftHeight);

    // During landing, also snap rotation back to face front (y → 0)
    this.root.rotation.y = THREE.MathUtils.lerp(this.root.rotation.y, 0, 0.14);

    if (t >= 1) {
      this._applyLift(0);
      this.root.rotation.y = 0;
      this.state = "IDLE";
      this.cooldownRemaining = this.COOLDOWN;
    }
  }

  private _applyLift(yOffset: number): void {
    this.root.position.y = THREE.MathUtils.lerp(
      this.root.position.y,
      this.baseY + yOffset,
      0.25
    );
  }
}
