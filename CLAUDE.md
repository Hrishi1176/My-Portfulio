# CLAUDE.md — Operating Instructions for Claude Code

@AGENTS.md

## 🚀 Quick Reference Commands

```bash
# Development Server
npm run dev              # Starts Next.js 16 Turbopack on http://localhost:3000

# Verification & Build (Always run before completing tasks)
npx tsc --noEmit         # Full TypeScript typecheck (Must pass with 0 errors)
npx next build           # Production build & static page pre-rendering (15/15 routes)

# Git & Code Quality
git status --short       # Review modified files
git diff                 # Inspect line-by-line changes
```

---

## 🧭 Codebase Orientation & Architecture Cheat Sheet

- **Framework**: Next.js 16 (App Router with Turbopack), React 19, TypeScript 5.
- **Styling**: Tailwind CSS 4, custom CSS variables in `src/app/globals.css`, glassmorphism design system.
- **3D Engine**: Vanilla Three.js WebGL canvas layered behind DOM content in `src/components/3d/ThreeRobotCompanion.tsx`.
- **Procedural Layer**: Inverse Kinematics (IK), bilateral arm aiming, and spine leaning in `src/lib/RobotProceduralLayer.ts`.
- **Headless CMS**: Payload 3.x configured in `src/app/(payload)/` for content management.
- **Database**: MongoDB Atlas with singleton client in `src/lib/mongodb.ts`.
- **Audio Engine**: Synthesized Web Audio API sound effects in `src/utils/audioFX.ts` (zero external mp3 asset overhead).
- **AI Engine**: Multi-provider LLM orchestration in `src/app/api/chat/route.ts` and `src/app/api/refine-requirements/route.ts` (Google Gemini 1.5 & Groq Llama 3.3).

---

## 🛡️ Critical Guidelines for Claude

1. **Do Not Break 3D & Procedural IK**:
   - The robot relies on bone hierarchy `upper_arm.R`, `forearm.R`, `hand.R`, and corresponding `.L` bones.
   - Laser targeting calculates real-time screen-to-world coordinates via `screenToWorld()`. Never replace dynamic targets with hardcoded vector values.
   - When modifying scene sequences in `src/lib/sceneActivities.ts`, every scene **must** end with `{ at: ..., action: "idle_reset" }`.
2. **Ensure Multi-Device Mobile Responsiveness**:
   - Always verify responsive layouts on viewports from `320px` to `1920px+`.
   - Modals must use `max-h-[90vh]` or `max-h-[92vh]` with `overflow-y-auto` and mobile-safe padding (`p-3 sm:p-6`).
   - Drawers (WhatsApp and AI Chatbot) must stay within `w-[calc(100vw-1rem)]` on mobile.
3. **TypeScript Discipline**:
   - Never use `any` unless strictly wrapping an untyped 3rd-party library.
   - Always run `npx tsc --noEmit` after changing code to ensure zero compilation regressions.
4. **Environment Variables**:
   - Check `.env.example` before referencing new env keys.
   - Handle missing env keys gracefully with fallback mock data or safe error responses.
