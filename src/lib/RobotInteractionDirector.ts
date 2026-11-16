import * as THREE from "three";

export interface ChoreographyEvent {
  timeOffset: number;
  agentId: string;
  action: "walkTo" | "greet" | "lookAt" | "idle" | "point" | "wave";
  position?: [number, number, number];
  lookTarget?: string;
}

export interface AgentRef {
  id: string;
  getCurrentPos: () => THREE.Vector3;
  navigateTo: (pos: THREE.Vector3, run?: boolean) => void;
  triggerGreet: () => void;
  triggerPoint: () => void;
  triggerWave: () => void;
  triggerIdle: () => void;
  setLookAt: (target: THREE.Vector3) => void;
}

export class RobotInteractionDirector {
  private timeline: ChoreographyEvent[] = [];
  private agents: Map<string, AgentRef> = new Map();
  private elapsed: number = 0;
  private playing: boolean = false;
  private nextEventIdx: number = 0;

  registerAgent(ref: AgentRef): void {
    this.agents.set(ref.id, ref);
  }

  playSequence(events: ChoreographyEvent[]): void {
    this.timeline = [...events].sort((a, b) => a.timeOffset - b.timeOffset);
    this.elapsed = 0;
    this.nextEventIdx = 0;
    this.playing = true;
  }

  update(delta: number): void {
    if (!this.playing) return;
    this.elapsed += delta;

    while (
      this.nextEventIdx < this.timeline.length &&
      this.timeline[this.nextEventIdx].timeOffset <= this.elapsed
    ) {
      this.fireEvent(this.timeline[this.nextEventIdx]);
      this.nextEventIdx++;
    }

    if (this.nextEventIdx >= this.timeline.length) {
      this.playing = false;
    }
  }

  private fireEvent(evt: ChoreographyEvent): void {
    const agent = this.agents.get(evt.agentId);
    if (!agent) return;

    switch (evt.action) {
      case "walkTo":
        if (evt.position) {
          agent.navigateTo(new THREE.Vector3(...evt.position));
        }
        break;
      case "greet":
        agent.triggerGreet();
        break;
      case "point":
        agent.triggerPoint();
        break;
      case "wave":
        agent.triggerWave();
        break;
      case "idle":
        agent.triggerIdle();
        break;
      case "lookAt":
        if (evt.lookTarget) {
          const target = this.agents.get(evt.lookTarget);
          if (target) {
            agent.setLookAt(target.getCurrentPos());
          }
        }
        break;
    }
  }

  stop(): void {
    this.playing = false;
  }

  isPlaying(): boolean {
    return this.playing;
  }
}

// Scene 09 Contact Finale Choreography
export const SCENE_09_FINALE: ChoreographyEvent[] = [
  { timeOffset: 0.0, agentId: "nova", action: "walkTo", position: [-1.4, -0.15, 0.1] },
  { timeOffset: 0.8, agentId: "nova", action: "greet" },
  { timeOffset: 1.8, agentId: "titan", action: "walkTo", position: [0.0, -0.2, 0.4] },
  { timeOffset: 2.2, agentId: "nova", action: "lookAt", lookTarget: "titan" },
  { timeOffset: 2.6, agentId: "titan", action: "lookAt", lookTarget: "nova" },
  { timeOffset: 2.8, agentId: "titan", action: "greet" },
  { timeOffset: 3.2, agentId: "codex", action: "walkTo", position: [1.4, -0.15, 0.1] },
  { timeOffset: 3.4, agentId: "matrix", action: "walkTo", position: [-2.4, -0.1, -0.2] },
  { timeOffset: 3.6, agentId: "orbit", action: "walkTo", position: [2.4, -0.1, -0.2] },
  { timeOffset: 3.8, agentId: "cloudx", action: "walkTo", position: [-0.75, 0.35, -0.3] },
  { timeOffset: 4.0, agentId: "neura", action: "walkTo", position: [0.75, 0.35, -0.3] },
  { timeOffset: 5.2, agentId: "codex", action: "wave" },
  { timeOffset: 5.3, agentId: "matrix", action: "wave" },
  { timeOffset: 5.4, agentId: "orbit", action: "wave" },
  { timeOffset: 5.5, agentId: "cloudx", action: "wave" },
  { timeOffset: 5.6, agentId: "neura", action: "wave" },
  { timeOffset: 6.0, agentId: "titan", action: "point" },
];
