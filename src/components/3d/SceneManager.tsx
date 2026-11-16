"use client";

import { Lighting } from "./Lighting";
import { CameraRig } from "./CameraRig";
import { CelestialNebula } from "./CelestialNebula";

export function SceneManager() {
  return (
    <>
      <Lighting />
      <CameraRig />
      <CelestialNebula />
    </>
  );
}
