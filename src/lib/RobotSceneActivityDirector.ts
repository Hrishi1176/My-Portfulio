import * as THREE from "three";
import { ActivityBeat, SCENE_ACTIVITIES } from "./sceneActivities";
import type { ProceduralMode } from "./RobotProceduralLayer";

// ─────────────────────────────────────────────────────────────────────────────
// RobotSceneActivityDirector
//
// Runs a timed activity timeline for one robot when its assigned section
// enters the viewport.  It communicates back to ThreeRobotCompanion via
// typed callbacks so it stays decoupled from THREE.js internals.
// ─────────────────────────────────────────────────────────────────────────────

export interface SceneActivityCallbacks {
  /** Fire the 360° spin (delegates to Robot360SpinDirector). */
  triggerSpin: () => void;
  /** Override robot position target (suppresses mouse-follow). */
  setTargetPos: (x: number, y: number, z: number, run?: boolean) => void;
  /** Clear position override — resume mouse follow. */
  clearTargetOverride: () => void;
  /** Set the robot's procedural bone IK mode. */
  setProceduralMode: (mode: ProceduralMode, target?: THREE.Vector3) => void;
  /** Play the GREET wave animation. */
  triggerGreet: (duration?: number) => void;
  /** Play the NOD head-dip gesture. */
  triggerNod: () => void;
  /** Toggle guard-idle (rigid, minimal-sway) stance. */
  setGuardMode: (active: boolean) => void;
  /** Toggle THINK pose (Neura forward lean + head dip). */
  setThinkMode: (active: boolean) => void;
  /** Toggle SALUTE pose (Nova right arm to head). */
  setSaluteMode: (active: boolean) => void;
  /** Trigger the wrist-check gesture (Cloud-X / Titan forearm raise). */
  triggerWristCheck: () => void;
}

export class RobotSceneActivityDirector {
  private timeline: ActivityBeat[] = [];
  private elapsed = 0;
  private nextBeatIdx = 0;
  private playing = false;
  private callbacks: SceneActivityCallbacks | null = null;

  // Direction-aware content side target:
  // robots on the right side look/point LEFT toward content, and vice-versa.
  private contentTarget = new THREE.Vector3(1.5, 0.3, 2.0);

  /**
   * Load a new scene's activity timeline and start the director.
   * @param sceneNum  Scene number 1-9
   * @param callbacks Callbacks into ThreeRobotCompanion
   */
  loadScene(sceneNum: number, callbacks: SceneActivityCallbacks): void {
    this.callbacks = callbacks;
    this.elapsed = 0;
    this.nextBeatIdx = 0;
    this.playing = true;
    this.timeline = [...(SCENE_ACTIVITIES[sceneNum] ?? [])];

    // Robots that stage on the RIGHT side of the screen (content is on the left)
    const robotOnRight = sceneNum === 3 || sceneNum === 4 || sceneNum === 5 || sceneNum === 7;
    this.contentTarget.set(robotOnRight ? -1.5 : 1.5, 0.3, 2.0);
  }

  /** Call every RAF frame with the current delta. */
  update(delta: number): void {
    if (!this.playing || !this.callbacks) return;
    this.elapsed += delta;

    while (
      this.nextBeatIdx < this.timeline.length &&
      this.timeline[this.nextBeatIdx].timeOffset <= this.elapsed
    ) {
      this._fireBeat(this.timeline[this.nextBeatIdx]);
      this.nextBeatIdx++;
    }

    // Timeline finished — keep playing flag true so guard/think loops continue
  }

  /** Stop & reset the director (call when section leaves). */
  reset(): void {
    this.playing = false;
    this.elapsed = 0;
    this.nextBeatIdx = 0;
    this.callbacks?.clearTargetOverride();
    this.callbacks?.setGuardMode(false);
    this.callbacks?.setThinkMode(false);
    this.callbacks?.setSaluteMode(false);
    this.callbacks?.setProceduralMode("none");
  }

  isPlaying(): boolean {
    return this.playing;
  }

  private _fireBeat(beat: ActivityBeat): void {
    const cb = this.callbacks!;
    const p = beat.params;

    switch (beat.type) {
      case "spin":
        cb.triggerSpin();
        break;

      case "walk_to":
        cb.setTargetPos(p?.x ?? 0, p?.y ?? -0.1, p?.z ?? 0.1, false);
        break;

      case "run_to":
        cb.setTargetPos(p?.x ?? 0, p?.y ?? -0.1, p?.z ?? 0.1, true);
        break;

      case "look_at_content":
        cb.setProceduralMode("lookAt", this.contentTarget.clone());
        break;

      case "point_content":
        cb.setProceduralMode("point", this.contentTarget.clone());
        break;

      case "point_up":
        cb.setProceduralMode("point", new THREE.Vector3(0, 1.5, 1.5));
        break;

      case "nod":
        cb.triggerNod();
        break;

      case "greet":
        cb.triggerGreet(1.6);
        break;

      case "type_start":
        cb.setProceduralMode("type");
        break;

      case "type_stop":
        cb.setProceduralMode("none");
        break;

      case "guard_start":
        cb.setGuardMode(true);
        break;

      case "guard_stop":
        cb.setGuardMode(false);
        break;

      case "think_start":
        cb.setThinkMode(true);
        break;

      case "think_stop":
        cb.setThinkMode(false);
        break;

      case "salute_start":
        cb.setSaluteMode(true);
        break;

      case "salute_stop":
        cb.setSaluteMode(false);
        break;

      case "wrist_check":
        cb.triggerWristCheck();
        break;

      case "idle_reset":
        cb.clearTargetOverride();
        cb.setGuardMode(false);
        cb.setThinkMode(false);
        cb.setSaluteMode(false);
        cb.setProceduralMode("none");
        break;
    }
  }
}
