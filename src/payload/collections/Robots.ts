import type { CollectionConfig } from "payload";

export const Robots: CollectionConfig = {
  slug: "robots",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "codename", "role", "sceneNumber", "order"],
  },
  access: {
    read: () => true, // Publicly readable for the 3D portfolio experience
  },
  fields: [
    {
      name: "agentId",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Unique robot identifier (e.g. nova, codex, matrix, orbit, cloudx, neura, titan, sentinel)",
      },
    },
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "codename",
      type: "text",
      required: true,
      admin: {
        placeholder: "ROBOT-01 // GUIDE",
      },
    },
    {
      name: "role",
      type: "text",
      required: true,
    },
    {
      name: "sector",
      type: "text",
      required: true,
      admin: {
        placeholder: "Scene 01 // The Arrival & About",
      },
    },
    {
      name: "sceneNumber",
      type: "number",
      required: true,
      defaultValue: 1,
    },
    {
      name: "targetElementId",
      type: "text",
      defaultValue: "hero",
    },
    {
      name: "modelPath",
      type: "text",
      required: true,
      defaultValue: "/models/robot-mecha.glb",
    },
    {
      name: "glowColor",
      type: "text",
      required: true,
      defaultValue: "#00f0ff",
    },
    {
      name: "glowRgba",
      type: "text",
      defaultValue: "rgba(0, 240, 255, 0.25)",
    },
    {
      name: "voicePitch",
      type: "number",
      defaultValue: 1.0,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "transmission",
      type: "textarea",
      required: true,
      admin: {
        description: "Storyline dialogue transmitted in the cyber HUD when this robot is active",
      },
    },
    {
      name: "status",
      type: "text",
      required: true,
      defaultValue: "ONLINE",
    },
    {
      name: "badgeColor",
      type: "text",
      defaultValue: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    },
    {
      name: "borderColor",
      type: "text",
      defaultValue: "border-cyan-500/30",
    },
    {
      name: "tourSpeech",
      type: "textarea",
      admin: {
        description: "Guided tour speech for this robot's stop",
      },
    },
    {
      name: "tourActionLabel",
      type: "text",
      defaultValue: "Explore Next Lab",
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Order in which robots appear in HUD roster",
      },
    },
  ],
};
