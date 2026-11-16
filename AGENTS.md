<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 🤖 AGENTS.md — System Architecture & Engineering Standards

> **Canonical Guide for AI Agents and Developers**: Follow these instructions and engineering standards when reading, maintaining, or extending the **Hrishi Bhattacharyya Portfolio & Robotverse Systems Portal**.

---

## ⚠️ Core Invariants & Safety Rules (Read First)

When making any change or adding any new feature to this codebase, you **must adhere to these zero-regression principles**:

1. **Zero TypeScript Errors**:
   - Run `npx tsc --noEmit` after every modification. The codebase must have **0 warnings and 0 errors**.
2. **Production Build Pass**:
   - Run `npx next build` to guarantee that all 15+ static pages and dynamic routes compile and render cleanly.
3. **No Regressions on 3D Robotverse & Procedural IK**:
   - Never break or override the bilateral inverse kinematics (IK) arm system, spine bending, or head tracking in `src/lib/RobotProceduralLayer.ts`.
   - Never delete or modify the `idle_reset` timeline sequence at the end of scene activities in `src/lib/sceneActivities.ts` — without `idle_reset`, the 3D robot locks up and stops tracking the user's cursor.
4. **Strict Mobile Responsiveness**:
   - All modals, drawers, and sections must be tested from **320px (iPhone SE)** up to **3840px (4K)**.
   - Touch targets must be at least **40px × 40px** per WCAG AA standards.
   - Never use fixed pixel widths on root containers; use `w-full max-w-[...]` or `w-[calc(100vw-1rem)]`.
5. **Z-Index Layer Hierarchy**:
   - `z-10`: 3D Canvas Background & Scene Meshes
   - `z-20`: Section Content & Tilt Cards
   - `z-30`: Floating Robot Story Banner (`RobotStoryBanner.tsx`)
   - `z-40`: Floating Action Buttons (`WhatsAppToggle.tsx`, `AIChatbot.tsx`, `RobotTourGuide.tsx`, `RobotCompanionHUD.tsx`)
   - `z-50`: Interactive Quick-Drawers (WhatsApp Chat, AI Chatbot drawer)
   - `z-[100]`: Fullscreen Dialog Modals (`Dialog.tsx`, `ResumeModal.tsx`, Tech Stack Video Showcase)

---

## 🏛️ System Architecture & Codebase Map

```
My-Portfulio/
├── src/
│   ├── app/
│   │   ├── (frontend)/           # Public-facing portfolio pages
│   │   │   ├── layout.tsx        # Root HTML shell, fonts, providers
│   │   │   └── page.tsx          # Single-page developer portal with 3D canvas
│   │   ├── (payload)/            # Payload 3.x Headless CMS Admin Portal
│   │   │   ├── admin/            # CMS Dashboard routes
│   │   │   └── api/              # Payload GraphQL & REST APIs
│   │   ├── api/
│   │   │   ├── analytics/        # Real-time page view logging & active sessions (MongoDB)
│   │   │   ├── chat/             # Multi-model AI assistant endpoint (Gemini / Groq)
│   │   │   ├── contact/          # Inbound client inquiries with Nodemailer autoresponder
│   │   │   ├── projects/         # Dynamic Payload CMS / GitHub project fetcher
│   │   │   ├── refine-requirements/ # AI project specification polisher
│   │   │   └── reviews/          # Verified client testimonials (MongoDB)
│   │   └── globals.css           # Tailwind 4 tokens, glassmorphism, keyframes
│   ├── components/
│   │   ├── 3d/                   # Three.js / WebGL 3D Robotverse components
│   │   │   ├── ThreeRobotCompanion.tsx  # Master 3D scene, renderer & event loop
│   │   │   ├── Hero3DCore.tsx           # Hero section 3D visual anchor
│   │   │   ├── TiltCard.tsx             # Interactive 3D mouse parallax cards
│   │   │   ├── RobotStoryBanner.tsx     # Floating story HUD banner
│   │   │   ├── RobotTourGuide.tsx       # Auto-tour and stop navigation drawer
│   │   │   ├── RobotCompanionHUD.tsx    # Master 7-agent squad control HUD
│   │   │   └── ChatbotRobotCompanion.tsx# Axiom companion for AI Chatbot
│   │   ├── common/               # Toast notifications, modals
│   │   ├── layout/               # Header, Navigation, Footer
│   │   ├── sections/             # All portfolio sections
│   │   │   ├── Hero.tsx                 # System telemetry ribbon & video stream modal
│   │   │   ├── About.tsx                # Bio, traits, and core technical pillars
│   │   │   ├── ImpactSlider.tsx         # Before vs After architectural telemetry
│   │   │   ├── Skills.tsx               # 3D Skills matrix with laser-targeting
│   │   │   ├── ExperienceElevator.tsx   # Floor-by-floor career trajectory
│   │   │   ├── Projects.tsx             # 3D Coverflow showcase with tag filters
│   │   │   ├── Reviews.tsx              # Live testimonial slider & submit modal
│   │   │   ├── LiveAnalytics.tsx        # Real-time MongoDB & GitHub stats
│   │   │   ├── Education.tsx            # Academic vault & credentials
│   │   │   ├── Contact.tsx              # Direct connect, AI Refiner & inquiries
│   │   │   └── ResumeModal.tsx          # PDF viewer with mobile fallback
│   │   ├── ui/                   # Reusable atomic UI (Button, Dialog, Input, Badge, Textarea)
│   │   ├── AIChatbot.tsx         # Floating AI portfolio chatbot drawer
│   │   ├── WhatsAppToggle.tsx    # Direct WhatsApp quick-chat drawer
│   │   └── ParticleBackground.tsx# Interactive background particle mesh
│   ├── context/
│   │   └── RobotCompanionContext.tsx    # Global Zustand/React Context for 3D robots
│   ├── lib/
│   │   ├── RobotProceduralLayer.ts      # Bilateral IK arm solver & skeletal animation
│   │   ├── sceneActivities.ts           # 9-scene activity sequences & idle_reset
│   │   ├── Robot360SpinDirector.ts      # Section entrance jump & 360 spin director
│   │   ├── email.ts                     # Responsive Nodemailer transport & HTML emails
│   │   ├── emailTemplates/              # Responsive HTML templates (inquiry, confirmation)
│   │   ├── mongodb.ts                   # MongoDB Atlas singleton connection
│   │   └── security.ts                  # Input sanitization and XSS prevention
│   ├── config/
│   │   ├── portfolioConfig.json         # Static resume, stats & developer data
│   │   └── portfolioConfig.ts           # TypeScript schema & data contracts
│   └── utils/
│       └── audioFX.ts                   # Web Audio API sound synthesis (beeps, chirps, lasers)
└── public/
    ├── models/                          # Optimized 3D GLB/GLTF models
    ├── resume/                          # Hrishi Bhattacharyya Resume PDF
    └── textures/                        # Textures & canvas materials
```

---

## 🦾 The 3D Robotverse Ecosystem Guide

The 3D companion layer is one of the most sophisticated aspects of this portfolio. It is **not** a video or static model; it is a live WebGL Three.js skeletal mesh with real-time inverse kinematics and procedural animation.

### 1. The 7 Specialized Agents & Sentinel Coordinator
| Agent ID | Codename | Role | Sector / Section | Accent Glow |
|---|---|---|---|---|
| `nova` | NOVA-01 | UI & Systems Navigator | 01 // Hero (`#hero`) | Cyan `#00f0ff` |
| `codex` | CODEX-02 | Core Architecture | 02 // About & Impact (`#about`, `#impact`) | Sky Blue `#38bdf8` |
| `matrix` | MATRIX-03 | Systems & Cloud Architect | 03 // Skills Matrix (`#skills`) | Emerald `#10b981` |
| `orbit` | ORBIT-04 | Career & Experience Navigator | 04 // Experience (`#experience`) | Purple `#a855f7` |
| `cloudx` | CLOUDX-05 | Distributed Cloud & DevOps | 05 // Projects (`#projects`) | Amber/Orange `#f97316` |
| `neura` | NEURA-06 | Telemetry & Data Intelligence | 06-07 // Reviews & Analytics (`#reviews`, `#analytics`) | Cyan/Purple `#06b6d4` |
| `titan` | TITAN-07 | Academic & Credentials | 08 // Education (`#education`) | Gold/Amber `#f59e0b` |
| `sentinel` | SENTINEL-X | Full-Stack Division Coordinator | 09 // Contact Finale (`#contact`) | Multi-agent formation |

### 2. Bilateral Inverse Kinematics (`RobotProceduralLayer.ts`)
The robot features procedural arm pointing, head tracking, and spine flexion:
- **Head Tracking**: Smooth slerp rotation towards the mouse coordinate in normalized screen-to-world space.
- **Bilateral Arms**: Both left and right arms feature independent two-bone IK solvers:
  - Upper Arm (Shoulder pitch and roll)
  - Forearm (Elbow bend constraint: `0.0` to `2.4` rad)
  - Wrist (Orientation aligned to laser aim target)
- **Laser Pointer System**: Emitter node attached to the active hand bone. Fires a holographic cylinder laser beam with dynamic distance scaling, pulse opacity, and hit reticle.

### 3. Scene Activity Timeline (`src/lib/sceneActivities.ts`)
Each section transition triggers a scripted timeline:
```typescript
{
  duration: 4.5,
  steps: [
    { at: 0.0, action: "jump_in" },
    { at: 0.4, action: "wave" },
    { at: 1.2, action: "point_screen" },
    { at: 2.5, action: "scan" },
    { at: 4.2, action: "idle_reset" }, // MANDATORY: Returns control to dynamic mouse IK
  ]
}
```
> [!IMPORTANT]
> Always ensure any new timeline ends in `idle_reset`. If `idle_reset` is omitted, `isActivityRunning` remains `true` and mouse pointing will freeze.

---

## 🛠️ Step-by-Step Guide: Adding Features Without Breaking Existing Systems

### How to Add a New Portfolio Section
1. **Define Content in Config**:
   - Add the data structure to `src/config/portfolioConfig.json`.
   - Update TypeScript interfaces in `src/config/portfolioConfig.ts`.
2. **Create the Section Component**:
   - Create `src/components/sections/NewSection.tsx`.
   - Use `SectionHeader` with `number="XX."` and responsive title styling.
   - Wrap interactive cards in `TiltCard` with mobile-safe padding (`p-4 sm:p-8`).
3. **Register Section in Page & Navigation**:
   - Mount `<NewSection />` in `src/app/(frontend)/page.tsx`.
   - Add navigation item in `src/config/portfolioConfig.json` under `navigation`.
4. **Connect to Robot Companion Context**:
   - Register the section's IntersectionObserver target in `ThreeRobotCompanion.tsx` to switch `activeScene` when scrolled into view.
   - If user interaction should trigger audio, use `playSound("laser")` or `soundFX.wakeChirp()`.

### How to Add a New Modal or Drawer
1. **Use the Standard `Dialog` Component**:
   - Import `Dialog` from `@/components/ui/Dialog`.
   - Pass `isOpen`, `onClose`, `title`, and `maxWidth`.
2. **Lock Body Scroll**:
   - Handled automatically by `Dialog.tsx`, but if building a custom drawer like `WhatsAppToggle.tsx`, ensure:
   ```typescript
   useEffect(() => {
     if (isOpen) {
       document.body.style.overflow = "hidden";
       return () => { document.body.style.overflow = ""; };
     }
   }, [isOpen]);
   ```
3. **Ensure Touch Targets & Mobile Bounds**:
   - Max width on phones: `w-[calc(100vw-1rem)]`.
   - Close button hit area: minimum `36px` to `44px`.

### How to Add a New API Route
1. **Follow Next.js 16 App Router Conventions**:
   - Create `src/app/api/your-route/route.ts`.
   - Export typed async handlers: `export async function GET(req: Request)`, `export async function POST(req: Request)`.
   - Sanitize all inbound strings with `sanitizeString()` from `@/lib/security`.
   - Return standard JSON responses: `NextResponse.json({ success: true, data }, { status: 200 })`.

---

## 🧪 Pre-Flight Quality Checklist (Run Before Every Commit)

```bash
# 1. Typecheck the entire project
npx tsc --noEmit

# 2. Test the Next.js production build & static rendering
npx next build

# 3. Check git diff for unintended changes
git status --short
```

If all 3 pass with 0 errors, your feature is production-ready and fully integrated with the portfolio's architectural standards.
