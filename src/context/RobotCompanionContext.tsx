"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { soundFX } from "@/utils/audioFX";
import type { RobotCMSDoc } from "@/services/payloadService";

export type RobotUiState = "idle" | "typing" | "verifying" | "success" | "error";
export type ActiveFormField = "name" | "email" | "requirements" | "chat" | "none";
export type RobotModelType = "squad" | "sentinel" | "eve" | "scout";

export type RobotAgentId =
  | "nova"
  | "codex"
  | "matrix"
  | "orbit"
  | "cloudx"
  | "neura"
  | "titan"
  | "all"
  | "sentinel"
  | "aegis"
  | "weaver"
  | "echo";

export type RobotSquadId = RobotAgentId;

export interface RobotAgentMember {
  id: RobotAgentId;
  sceneNumber: number;
  name: string;
  codename: string;
  role: string;
  techDomain: string;
  sector: string;
  targetElementId: string;
  accentColor: string;
  speech: string;
  status: "active" | "standby" | "synthesizing" | "deploying" | "assembled";
}

export const ROBOTVERSE_AGENTS: RobotAgentMember[] = [
  {
    id: "nova",
    sceneNumber: 1,
    name: "Nova",
    codename: "ROBOT-01 // GUIDE",
    role: "Portfolio Guide",
    techDomain: "React, JavaScript, HTML, CSS",
    sector: "Scene 01 // The Arrival Deck",
    targetElementId: "hero",
    accentColor: "#00f0ff",
    speech:
      "👋 Welcome to Hrishi's digital engineering facility. We've been expecting you. Let my team demonstrate what we build.",
    status: "active",
  },
  {
    id: "nova",
    sceneNumber: 2,
    name: "Nova",
    codename: "ROBOT-01 // ARCHIVE",
    role: "System Guide",
    techDomain: "Engineering Philosophy",
    sector: "Scene 02 // The Developer Archive",
    targetElementId: "about",
    accentColor: "#00f0ff",
    speech:
      "👤 Nova at the Archive. Behind every system is an engineer with relentless dedication. Let me show you who built all of this.",
    status: "active",
  },
  {
    id: "codex",
    sceneNumber: 3,
    name: "Codex",
    codename: "ROBOT-02 // FRONTEND",
    role: "Frontend Engineer",
    techDomain: "React, Next.js, TypeScript, Tailwind CSS",
    sector: "Scene 03 // Frontend Development Lab",
    targetElementId: "skills",
    accentColor: "#38bdf8",
    speech:
      "⚡ Codex active in the Frontend Lab. Watch closely — assembling reactive micro-frontends and sub-millisecond interfaces.",
    status: "active",
  },
  {
    id: "matrix",
    sceneNumber: 4,
    name: "Matrix",
    codename: "ROBOT-03 // BACKEND",
    role: "Backend Engineer",
    techDomain: "Node.js, Express.js, Python, REST APIs",
    sector: "Scene 04 // Backend Command Center",
    targetElementId: "skills",
    accentColor: "#10b981",
    speech:
      "🛡️ Matrix online at the Command Center. High-throughput distributed nodes, zero-downtime microservices, and secured REST endpoints.",
    status: "active",
  },
  {
    id: "orbit",
    sceneNumber: 5,
    name: "Orbit",
    codename: "ROBOT-04 // DATABASE",
    role: "Database Engineer",
    techDomain: "MongoDB, PostgreSQL, MySQL, Snowflake",
    sector: "Scene 05 // Database Core",
    targetElementId: "skills",
    accentColor: "#a855f7",
    speech:
      "🔮 Orbit synchronized at the Database Core. Data doesn't just sit still — it orbits and flows. ACID transactions and schemas locked.",
    status: "active",
  },
  {
    id: "cloudx",
    sceneNumber: 6,
    name: "Cloud-X",
    codename: "ROBOT-05 // DEVOPS",
    role: "DevOps & Cloud Engineer",
    techDomain: "AWS, Docker, Git, CI/CD Pipelines",
    sector: "Scene 06 // Cloud & DevOps Station",
    targetElementId: "experience",
    accentColor: "#f97316",
    speech:
      "🚀 Cloud-X deployed. Every project we ship lives in production. Automated CI/CD pipelines, containerized pods, and cloud infrastructure live.",
    status: "active",
  },
  {
    id: "neura",
    sceneNumber: 7,
    name: "Neura",
    codename: "ROBOT-06 // AI LAB",
    role: "AI & Automation Engineer",
    techDomain: "AI Agents, Python, Machine Learning, Automation",
    sector: "Scene 07 // Artificial Intelligence Universe",
    targetElementId: "analytics",
    accentColor: "#06b6d4",
    speech:
      "🧠 Neura connected. Synaptic neural nodes firing. Intelligent autonomous agents, LLM orchestration, and deep predictive pipelines.",
    status: "active",
  },
  {
    id: "titan",
    sceneNumber: 8,
    name: "Titan",
    codename: "ROBOT-07 // ARENA",
    role: "System Architect & Presenter",
    techDomain: "Complete Full-Stack Engineering Ecosystem",
    sector: "Scene 08 // Project Arena",
    targetElementId: "projects",
    accentColor: "#f59e0b",
    speech:
      "🏆 Titan taking center stage. Presenting Hrishi's verified production applications, scalable architectures, and flagship systems.",
    status: "active",
  },
  {
    id: "all",
    sceneNumber: 9,
    name: "The Squad",
    codename: "ROBOT-07 // ASSEMBLY",
    role: "All 7 Specialized Agents",
    techDomain: "Full Engineering Division Assembled",
    sector: "Scene 09 // Contact & Final Mission",
    targetElementId: "contact",
    accentColor: "#eab308",
    speech:
      "🤝 All seven specialized agents assembled. The next mission starts with you. Let's engineer something extraordinary together.",
    status: "assembled",
  },
];

export const SQUAD_MEMBERS = ROBOTVERSE_AGENTS;

interface RobotCompanionContextType {
  // Common UI State
  state: RobotUiState;
  activeField: ActiveFormField;
  modelType: RobotModelType;
  isEnabled: boolean;
  setState: (state: RobotUiState) => void;
  setActiveField: (field: ActiveFormField) => void;
  setModelType: (type: RobotModelType) => void;
  setIsEnabled: (enabled: boolean) => void;
  triggerSuccess: () => void;
  triggerError: () => void;
  triggerTyping: (field?: ActiveFormField) => void;

  // ROBOTVERSE Multi-Agent State
  activeScene: number;
  navigationMode: "cinematic" | "explore";
  activeAgentId: RobotAgentId;
  activeSector: RobotAgentId;
  soundEnabled: boolean;
  isTourPlaying: boolean;
  activeSkillCategory: string;
  projectShiftCounter: number;
  robots: RobotCMSDoc[];

  // Actions
  goToScene: (sceneNum: number) => void;
  setNavigationMode: (mode: "cinematic" | "explore") => void;
  toggleTourPlayPause: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  setActiveSector: (sector: RobotAgentId | null) => void;
  setActiveSkillCategory: (category: string) => void;
  triggerProjectShift: () => void;
  warpToSector: (agentId: RobotAgentId) => void;
  playSound: (
    type: "laser" | "hydraulic" | "beep" | "warp" | "chime" | "ufo" | "powerdown" | "wake"
  ) => void;
}

const RobotCompanionContext = createContext<RobotCompanionContextType | null>(null);

export function RobotCompanionProvider({
  children,
  initialRobots = [],
}: {
  children: React.ReactNode;
  initialRobots?: RobotCMSDoc[];
}) {
  const [robots] = useState<RobotCMSDoc[]>(initialRobots);
  const [state, setState] = useState<RobotUiState>("idle");
  const [activeField, setActiveField] = useState<ActiveFormField>("none");
  const [modelType, setModelType] = useState<RobotModelType>("squad");
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeScene, setActiveScene] = useState<number>(1);
  const [navigationMode, setNavigationMode] = useState<"cinematic" | "explore">("explore");
  const [activeAgentId, setActiveAgentId] = useState<RobotAgentId>("nova");
  const [activeSector, setActiveSectorState] = useState<RobotAgentId>("nova");
  const [isTourPlaying, setIsTourPlaying] = useState<boolean>(false);
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>("All");
  const [projectShiftCounter, setProjectShiftCounter] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const playSound = useCallback(
    (type: "laser" | "hydraulic" | "beep" | "warp" | "chime" | "ufo" | "powerdown" | "wake") => {
      if (!soundEnabled) return;
      if (type === "laser") soundFX.laserHum(0.08);
      else if (type === "hydraulic") soundFX.hydraulicClick(0.12);
      else if (type === "beep") soundFX.scanBeep(880, 0.05);
      else if (type === "warp") soundFX.warpWoosh(0.12);
      else if (type === "chime") soundFX.transmitChime(0.1);
      else if (type === "ufo") soundFX.ufoBeam(0.12);
      else if (type === "powerdown") soundFX.powerDown(0.08);
      else if (type === "wake") soundFX.wakeChirp(0.08);
    },
    [soundEnabled]
  );

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) soundFX.scanBeep(1200, 0.06);
      return next;
    });
  }, []);

  const triggerSuccess = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState("success");
    playSound("chime");
    timerRef.current = setTimeout(() => {
      setState("idle");
    }, 4500);
  }, [playSound]);

  const triggerError = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState("error");
    if (soundEnabled) soundFX.scanBeep(320, 0.08);
    timerRef.current = setTimeout(() => {
      setState("idle");
    }, 3800);
  }, [soundEnabled]);

  const triggerTyping = useCallback(
    (field?: ActiveFormField) => {
      if (field) setActiveField(field);
      setState("typing");
      if (Math.random() > 0.65) {
        playSound("beep");
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setState("idle");
      }, 1400);
    },
    [playSound]
  );

  const triggerProjectShift = useCallback(() => {
    setProjectShiftCounter((prev) => prev + 1);
    playSound("hydraulic");
  }, [playSound]);

  const goToScene = useCallback(
    (sceneNum: number) => {
      const targetAgent = ROBOTVERSE_AGENTS.find((a) => a.sceneNumber === sceneNum) || ROBOTVERSE_AGENTS[0];
      setActiveScene(sceneNum);
      setActiveAgentId(targetAgent.id);
      setActiveSectorState(targetAgent.id);
      playSound("warp");

      const targetEl = document.getElementById(targetAgent.targetElementId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [playSound]
  );

  const warpToSector = useCallback(
    (agentId: RobotAgentId) => {
      const targetAgent = ROBOTVERSE_AGENTS.find((a) => a.id === agentId) || ROBOTVERSE_AGENTS[0];
      goToScene(targetAgent.sceneNumber);
    },
    [goToScene]
  );

  const toggleTourPlayPause = useCallback(() => {
    setIsTourPlaying((prev) => {
      const next = !prev;
      if (next) {
        setNavigationMode("cinematic");
        playSound("ufo");
      }
      return next;
    });
  }, [playSound]);

  const setActiveSector = useCallback((sector: RobotAgentId | null) => {
    if (!sector) return;
    setActiveSectorState(sector);
    setActiveAgentId(sector);
    const agent = ROBOTVERSE_AGENTS.find((a) => a.id === sector);
    if (agent) {
      setActiveScene(agent.sceneNumber);
    }
  }, []);

  // Auto-detect active section in viewport during scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY + window.innerHeight * 0.45;

          const getElementTop = (id: string): number | null => {
            const el = document.getElementById(id);
            if (!el) return null;
            const rect = el.getBoundingClientRect();
            return rect.top + window.scrollY;
          };

          const contactTop = getElementTop("contact");
          const projectsTop = getElementTop("projects");
          const analyticsTop = getElementTop("analytics");
          const experienceTop = getElementTop("experience");
          const skillsTop = getElementTop("skills");
          const aboutTop = getElementTop("about");

          if (contactTop !== null && scrollPos >= contactTop - 300) {
            setActiveSectorState("all");
            setActiveAgentId("all");
            setActiveScene(9);
          } else if (projectsTop !== null && scrollPos >= projectsTop - 300) {
            setActiveSectorState("titan");
            setActiveAgentId("titan");
            setActiveScene(8);
          } else if (analyticsTop !== null && scrollPos >= analyticsTop - 300) {
            setActiveSectorState("neura");
            setActiveAgentId("neura");
            setActiveScene(7);
          } else if (experienceTop !== null && scrollPos >= experienceTop - 300) {
            setActiveSectorState("cloudx");
            setActiveAgentId("cloudx");
            setActiveScene(6);
          } else if (skillsTop !== null && scrollPos >= skillsTop - 300) {
            // Determine skills subsection based on scroll progress inside skills
            setActiveSectorState("codex");
            setActiveAgentId("codex");
            setActiveScene(3);
          } else if (aboutTop !== null && scrollPos >= aboutTop - 300) {
            setActiveSectorState("nova");
            setActiveAgentId("nova");
            setActiveScene(2);
          } else {
            setActiveSectorState("nova");
            setActiveAgentId("nova");
            setActiveScene(1);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <RobotCompanionContext.Provider
      value={{
        state,
        activeField,
        modelType,
        isEnabled,
        setState,
        setActiveField,
        setModelType,
        setIsEnabled,
        triggerSuccess,
        triggerError,
        triggerTyping,
        activeScene,
        navigationMode,
        activeAgentId,
        activeSector,
        soundEnabled,
        isTourPlaying,
        activeSkillCategory,
        projectShiftCounter,
        robots,
        goToScene,
        setNavigationMode,
        toggleTourPlayPause,
        setSoundEnabled,
        toggleSound,
        setActiveSector,
        setActiveSkillCategory,
        triggerProjectShift,
        warpToSector,
        playSound,
      }}
    >
      {children}
    </RobotCompanionContext.Provider>
  );
}

export function useRobotCompanion() {
  const ctx = useContext(RobotCompanionContext);
  if (!ctx) {
    return {
      state: "idle" as RobotUiState,
      activeField: "none" as ActiveFormField,
      modelType: "squad" as RobotModelType,
      isEnabled: true,
      soundEnabled: true,
      activeScene: 1,
      navigationMode: "explore" as const,
      activeAgentId: "nova" as RobotAgentId,
      activeSector: "nova" as RobotAgentId,
      isTourPlaying: false,
      activeSkillCategory: "All",
      projectShiftCounter: 0,
      robots: [] as RobotCMSDoc[],
      setState: () => {},
      setActiveField: () => {},
      setModelType: () => {},
      setIsEnabled: () => {},
      setSoundEnabled: () => {},
      toggleSound: () => {},
      setActiveSector: () => {},
      setActiveSkillCategory: () => {},
      goToScene: () => {},
      setNavigationMode: () => {},
      toggleTourPlayPause: () => {},
      triggerSuccess: () => {},
      triggerError: () => {},
      triggerTyping: () => {},
      triggerProjectShift: () => {},
      warpToSector: () => {},
      playSound: () => {},
    };
  }
  return ctx;
}

export const useRobotverse = useRobotCompanion;
