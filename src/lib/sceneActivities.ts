// ─────────────────────────────────────────────────────────────────────────────
// Scene-wise activity scripts for all 9 ROBOTVERSE scenes.
// Each ActivityBeat fires at `timeOffset` seconds after scene entry.
// The RobotSceneActivityDirector consumes these timelines.
// ─────────────────────────────────────────────────────────────────────────────

export type ActivityType =
  | "spin"             // 360° turntable spin (via Robot360SpinDirector)
  | "walk_to"          // move to world XYZ at walk speed
  | "run_to"           // move to world XYZ at run speed
  | "look_at_content"  // proceduralLayer lookAt toward section content
  | "point_content"    // proceduralLayer point arm toward content
  | "point_up"         // proceduralLayer point arm upward-center
  | "nod"              // brief head-dip gesture
  | "greet"            // GREET animation (wave)
  | "type_start"       // start typing procedural mode
  | "type_stop"        // stop typing procedural mode
  | "guard_start"      // rigid guard idle (minimal sway)
  | "guard_stop"       // end guard idle
  | "think_start"      // forward lean + head dip (Neura THINK pose)
  | "think_stop"       // return from think pose
  | "salute_start"     // right arm raises to head (Nova salute)
  | "salute_stop"      // lower arm from salute
  | "wrist_check"      // forearm raises briefly (Cloud-X / Titan wrist panel)
  | "idle_reset";      // clear all overrides → resume mouse follow

export interface ActivityBeat {
  timeOffset: number; // seconds from scene entry
  type: ActivityType;
  params?: {
    x?: number;
    y?: number;
    z?: number;
    run?: boolean;
    duration?: number;
  };
}

// ── Per-Scene Activity Timelines ─────────────────────────────────────────────

export const SCENE_ACTIVITIES: Record<number, ActivityBeat[]> = {

  // ── Scene 1: Nova — The Arrival ─────────────────────────────────
  // "Welcome. We've been expecting you."
  // Nova drops from beam, spins, salutes, points at HB badge, then roams.
  1: [
    { timeOffset: 0.5,  type: "spin" },
    { timeOffset: 2.6,  type: "salute_start" },
    { timeOffset: 4.0,  type: "salute_stop" },
    { timeOffset: 4.3,  type: "point_up" },
    { timeOffset: 5.8,  type: "idle_reset" },
  ],

  // ── Scene 2: Nova — About Module ────────────────────────────────
  // "Let me show you who built all of this."
  // Nova walks left, faces About text, points, nods, steps back.
  2: [
    { timeOffset: 0.3,  type: "walk_to",        params: { x: -1.8, y: -0.2, z: 0.2 } },
    { timeOffset: 1.2,  type: "look_at_content" },
    { timeOffset: 2.5,  type: "nod" },
    { timeOffset: 3.5,  type: "point_content" },
    { timeOffset: 5.0,  type: "walk_to",        params: { x: -2.1, y: -0.2, z: 0.0 } },
    { timeOffset: 5.8,  type: "idle_reset" },
  ],

  // ── Scene 3: Codex — Frontend Lab ───────────────────────────────
  // "Watch closely. I'll build it right in front of you."
  // Codex spins, runs to position, greets, and transitions to dynamic mouse presenter.
  3: [
    { timeOffset: 0.5,  type: "spin" },
    { timeOffset: 2.2,  type: "run_to",         params: { x: 0.6, y: -0.3, z: 0.1 } },
    { timeOffset: 3.0,  type: "greet" },
    { timeOffset: 4.2,  type: "idle_reset" },
  ],

  // ── Scene 4: Matrix — Backend Command Center ─────────────────────
  // "I keep the systems alive. 24/7. Zero downtime."
  // Matrix marches in, halts, scan-spins, inspects, and resumes mouse follow.
  4: [
    { timeOffset: 0.0,  type: "run_to",         params: { x: 0.8, y: -0.2, z: 0.1 } },
    { timeOffset: 1.2,  type: "spin" },
    { timeOffset: 2.8,  type: "nod" },
    { timeOffset: 4.0,  type: "idle_reset" },
  ],

  // ── Scene 5: Orbit — Database Core ──────────────────────────────
  // "Data doesn't just sit still. It orbits. It flows. I control both."
  // Orbit rises from below, spins (cylinders orbit), aligns stack, points up.
  5: [
    { timeOffset: 0.5,  type: "spin" },
    { timeOffset: 2.5,  type: "point_up" },
    { timeOffset: 3.8,  type: "nod" },
    { timeOffset: 4.5,  type: "idle_reset" },
  ],

  // ── Scene 6: Cloud-X — DevOps Station ───────────────────────────
  // "Every project I've shipped has lived in production. This is the ops board."
  // Cloud-X rockets in, spins, checks wrist panel, greet fist-pump, and resumes follow.
  6: [
    { timeOffset: 0.5,  type: "spin" },
    { timeOffset: 2.5,  type: "wrist_check" },
    { timeOffset: 3.5,  type: "greet" },
    { timeOffset: 4.5,  type: "idle_reset" },
  ],

  // ── Scene 7: Neura — AI Universe ────────────────────────────────
  // "I don't just process data. I think. Watch what happens when synapses fire."
  // Neura pulses in, slow spin, enters THINK pose, snaps out, points at metrics.
  7: [
    { timeOffset: 0.3,  type: "spin" },
    { timeOffset: 2.0,  type: "think_start" },
    { timeOffset: 3.8,  type: "think_stop" },
    { timeOffset: 4.2,  type: "greet" },
    { timeOffset: 5.2,  type: "idle_reset" },
  ],

  // ── Scene 8: Titan — Project Arena ──────────────────────────────
  // "These aren't just projects. These are production systems."
  // Titan strides to centre, 360° imperial spin, raises wrist slate, resumes follow.
  8: [
    { timeOffset: 0.0,  type: "walk_to",        params: { x: -0.4, y: -0.2, z: 0.2 } },
    { timeOffset: 1.5,  type: "spin" },
    { timeOffset: 3.2,  type: "wrist_check" },
    { timeOffset: 4.5,  type: "idle_reset" },
  ],

  // ── Scene 9: Finale — All Squad Assembled ───────────────────────
  // Extended by existing SCENE_09_FINALE choreography.
  // Director adds squad-level nod after main wave sequence completes.
  9: [
    { timeOffset: 6.0,  type: "nod" },
    { timeOffset: 7.0,  type: "idle_reset" },
  ],
};
