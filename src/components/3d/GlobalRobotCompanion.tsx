"use client";

import React, { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useRobotCompanion } from "@/context/RobotCompanionContext";

// Dynamically import ThreeRobotCompanion to ensure zero SSR hydration issues
const ThreeRobotCompanion = dynamic(
  () => import("./ThreeRobotCompanion").then((mod) => mod.ThreeRobotCompanion),
  { ssr: false }
);

const emptySubscribe = () => () => {};

export function GlobalRobotCompanion() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const { state, activeField, modelType, isEnabled } = useRobotCompanion();

  if (!mounted || !isEnabled) {
    return null;
  }

  return (
    <ThreeRobotCompanion
      state={state}
      activeField={activeField}
      modelType={modelType}
      mode="screen-roam"
    />
  );
}

export default GlobalRobotCompanion;
