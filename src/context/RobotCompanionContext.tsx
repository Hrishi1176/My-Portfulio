"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";

export type RobotUiState = "idle" | "typing" | "verifying" | "success" | "error";
export type ActiveFormField = "name" | "email" | "requirements" | "chat" | "none";
export type RobotModelType = "squad" | "sentinel" | "eve" | "scout";

interface RobotCompanionContextType {
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
}

const RobotCompanionContext = createContext<RobotCompanionContextType | null>(null);

export function RobotCompanionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<RobotUiState>("idle");
  const [activeField, setActiveField] = useState<ActiveFormField>("none");
  const [modelType, setModelType] = useState<RobotModelType>("squad");
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerSuccess = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState("success");
    timerRef.current = setTimeout(() => {
      setState("idle");
    }, 4500);
  }, []);

  const triggerError = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState("error");
    timerRef.current = setTimeout(() => {
      setState("idle");
    }, 3800);
  }, []);

  const triggerTyping = useCallback((field?: ActiveFormField) => {
    if (field) setActiveField(field);
    setState("typing");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setState("idle");
    }, 1400);
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
      }}
    >
      {children}
    </RobotCompanionContext.Provider>
  );
}

export function useRobotCompanion() {
  const ctx = useContext(RobotCompanionContext);
  if (!ctx) {
    // Provide a safe fallback if used outside provider
    return {
      state: "idle" as RobotUiState,
      activeField: "none" as ActiveFormField,
      modelType: "squad" as RobotModelType,
      isEnabled: true,
      setState: () => {},
      setActiveField: () => {},
      setModelType: () => {},
      setIsEnabled: () => {},
      triggerSuccess: () => {},
      triggerError: () => {},
      triggerTyping: () => {},
    };
  }
  return ctx;
}
