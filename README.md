# ⚡ Hrishi Bhattacharyya — 3D Robotverse Developer Portfolio & Systems Portal

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Payload CMS 3](https://img.shields.io/badge/Payload_CMS-3.0-white?style=for-the-badge&logo=payloadcms)](https://payloadcms.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> An enterprise-grade, high-performance developer portal and interactive 3D WebGL portfolio engineered with **Next.js 16**, **React 19**, **Three.js**, **Payload 3.x CMS**, and **Tailwind CSS 4**. Features an autonomous **7-Agent 3D Robotverse Companion** with real-time **Bilateral Inverse Kinematics (IK)**, a **Holographic Laser Reticle**, a **Direct WhatsApp Quick-Chat Drawer**, **Dual-Provider AI Assistant (Google Gemini & Groq Llama 3.3)**, and **Pixel-Perfect Multi-Device Mobile Responsiveness (320px to 4K)**.

---

## 🌟 Key Features & Architectural Highlights

### 🦾 1. Autonomous 3D Robotverse Companion & Procedural IK
- **7 Specialized Autonomous Agents + Sentinel Coordinator**: As the visitor scrolls through the portfolio, the 3D companion smoothly morphs character, role, dialogue transmission, and shader glow:
  1. `NOVA-01` (Cyan `#00f0ff`) — UI & Systems Navigator (`#hero`)
  2. `CODEX-02` (Sky Blue `#38bdf8`) — Core Architecture (`#about`, `#impact`)
  3. `MATRIX-03` (Emerald `#10b981`) — Systems & Cloud Architect (`#skills`)
  4. `ORBIT-04` (Purple `#a855f7`) — Career & Experience Navigator (`#experience`)
  5. `CLOUDX-05` (Amber/Orange `#f97316`) — Distributed Cloud & DevOps (`#projects`)
  6. `NEURA-06` (Cyan/Purple `#06b6d4`) — Telemetry & Data Intelligence (`#reviews`, `#analytics`)
  7. `TITAN-07` (Gold/Amber `#f59e0b`) — Academic & Credentials Vault (`#education`)
  8. `SENTINEL-X` — Full-Stack Division Coordinator with all 7 agents in finale formation (`#contact`)
- **Bilateral Two-Bone Inverse Kinematics (IK)**: Real-time closed-form IK solver in `src/lib/RobotProceduralLayer.ts` controlling shoulder pitch/roll, constrained elbow flexion (`0.0` to `2.4` rad), and wrist orientation. Automatically alternates between right and left arms based on target screen coordinates.
- **Holographic Laser Reticle**: Hand-attached emitter fires a pulsating neon laser beam directly at the visitor's cursor across every section of the portfolio.
- **Storyline Scene Director & Timelines**: Scripted entrance sequences (jump, wave, scan, inspect) that smoothly transition into dynamic mouse roaming via mandatory `idle_reset` steps in `src/lib/sceneActivities.ts`.
- **Zero-Asset Procedural Audio FX**: Real-time sound synthesis in `src/utils/audioFX.ts` using the browser's native Web Audio API (lasers, warps, wake chirps, error pulses) with 0 external audio file overhead.

### 📱 2. Extreme Multi-Device Responsiveness (320px to 4K)
- **Fluid Multi-Viewport Adaptability**: Tested and perfected for compact smartphones (320px–375px), modern mobile devices (390px–480px), tablets (768px–1024px), laptops, and ultra-wide 4K displays.
- **Touch-Friendly Controls**: Interactive buttons, form inputs, rating stars, and channel selectors meet WCAG AA minimum 40px+ tap target guidelines.
- **Mobile Touch-to-Aim**: Tapping or dragging on touchscreen devices immediately drives the 3D robot's gaze, IK arm pointing, and holographic laser reticle.
- **Responsive Modals & Drawers**:
  - `Dialog.tsx`: Adaptive container bounds with mobile-safe padding (`p-2.5 sm:p-6`) and `max-h-[92vh]`.
  - `ResumeModal.tsx`: PDF viewer with a dedicated mobile fallback banner for iOS Safari and mobile Chrome.
  - `Hero.tsx`: Tech Stack Video Showcase modal with auto-wrapping stream channels and controls.
  - `Reviews.tsx`: Testimonial submission form with touch-sized star rating buttons.

### 💬 3. Direct WhatsApp Quick-Chat Drawer
- **Instant Connection**: Floating interactive WhatsApp toggle button (`bottom-20 sm:bottom-24 right-3.5 sm:right-6`).
- **One-Tap Starters**: Preset conversation chips (*Discuss a New Project*, *Contract / Full-Time Role*, *3D & AI Web Application*, *Book a Consultation*).
- **Custom Message Composer**: In-app message textarea with instant WhatsApp deep-link generation (`wa.me`) and direct phone copy option.

### 🤖 4. Multi-Provider AI Assistant & Requirement Refiner
- **Autonomous Chatbot**: Integrated floating AI Assistant that can converse about career history, technical stack, architecture, and live projects.
- **Multi-LLM Architecture**: Supports **Google Gemini 1.5 Flash** and **Groq Cloud (Llama 3.3 70B)** with automatic fallback.
- **Requirement Refinement Tool**: Transforms draft project scopes into structured, executive-ready technical specifications with budget scoping.
- **AXIOM 3D Mini-Companion**: Dedicated mini 3D robot embedded inside the chatbot drawer that animates based on conversation state (`idle`, `listening`, `responding`).

### 📦 5. 3D Spatial Coverflow Projects Showcase
- **Spatial 3D Perspective**: Interactive coverflow deck displaying enterprise software architectures managed via Payload CMS and synchronized with GitHub.
- **Instant Tag Filters & Live Search**: Filter by *TypeScript*, *Next.js*, *Python*, *PostgreSQL*, *Docker*, or search by keyword with real-time reactive feedback.
- **Touch Gestures & Tilt Depth**: Smooth drag/swipe navigation with Framer Motion elastic constraints and 3D card tilt.

### 📊 6. Real-Time Telemetry & Client Feedback System
- **MongoDB Atlas Telemetry**: Live page view logging and active 15-minute visitor session tracking.
- **Mission Control Dashboard**: Live stats showcasing GitHub star counts, public repositories, and verified uptime availability (99.98%).
- **Interactive Client Endorsements**: Real-time review submissions stored in MongoDB with rating moderation and auto-playing carousel.

### 📬 7. Responsive HTML Email Notification Engine
- **Automated Nodemailer Transport**: Sends structured notifications to the developer and branded confirmation emails to the client upon form submission.
- **Responsive Email Templates**: Clean, inline-styled HTML templates in `src/lib/emailTemplates/` optimized for Gmail, Apple Mail, and Outlook.

---

## 🏗️ Architecture & Directory Structure

```
My-Portfulio/
├── src/
│   ├── app/
│   │   ├── (frontend)/           # Public-facing portfolio
│   │   │   ├── layout.tsx        # HTML shell, metadata, theme provider
│   │   │   └── page.tsx          # Single-page developer portal with 3D canvas
│   │   ├── (payload)/            # Payload 3.x Headless CMS Admin Portal
│   │   │   ├── admin/            # CMS Dashboard routes
│   │   │   └── api/              # Payload GraphQL & REST APIs
│   │   ├── api/
│   │   │   ├── analytics/        # MongoDB telemetry & visitor tracking
│   │   │   ├── chat/             # Multi-model AI assistant endpoint
│   │   │   ├── contact/          # Inbound client inquiries with Nodemailer
│   │   │   ├── projects/         # Dynamic Payload CMS / GitHub project fetcher
│   │   │   ├── refine-requirements/ # AI scope refinement endpoint
│   │   │   └── reviews/          # Verified client testimonials (MongoDB)
│   │   └── globals.css           # Tailwind 4 tokens, aurora mesh & animations
│   ├── components/
│   │   ├── 3d/                   # Three.js 3D Robotverse layer
│   │   │   ├── ThreeRobotCompanion.tsx  # Master 3D WebGL scene & render loop
│   │   │   ├── Hero3DCore.tsx           # Hero section 3D visual anchor
│   │   │   ├── TiltCard.tsx             # Interactive 3D mouse parallax cards
│   │   │   ├── RobotStoryBanner.tsx     # Floating storyline HUD banner
│   │   │   ├── RobotTourGuide.tsx       # Auto-tour and stop navigation drawer
│   │   │   ├── RobotCompanionHUD.tsx    # Master 7-agent squad control HUD
│   │   │   └── ChatbotRobotCompanion.tsx# Axiom companion for AI Chatbot
│   │   ├── common/               # Toast notifications, modals
│   │   ├── layout/               # Header, Navigation drawer, Footer
│   │   ├── sections/             # All portfolio sections
│   │   │   ├── Hero.tsx                 # System telemetry ribbon & video stream modal
│   │   │   ├── About.tsx                # Bio, traits, and core technical pillars
│   │   │   ├── ImpactSlider.tsx         # Architectural evolution telemetry
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
│   │   └── ParticleBackground.tsx# Interactive canvas particle mesh
│   ├── context/
│   │   └── RobotCompanionContext.tsx    # Global Zustand/React Context for 3D robots
│   ├── lib/
│   │   ├── RobotProceduralLayer.ts      # Bilateral IK arm solver & skeletal animation
│   │   ├── sceneActivities.ts           # 9-scene activity sequences & idle_reset
│   │   ├── Robot360SpinDirector.ts      # Section entrance jump & 360 spin director
│   │   ├── email.ts                     # Nodemailer transport & HTML email templates
│   │   ├── emailTemplates/              # Responsive HTML templates (inquiry, confirmation)
│   │   ├── mongodb.ts                   # MongoDB Atlas singleton connection
│   │   └── security.ts                  # Input sanitization and XSS prevention
│   ├── config/
│   │   ├── portfolioConfig.json         # Static resume, stats & developer data
│   │   └── portfolioConfig.ts           # TypeScript schema & data contracts
│   └── utils/
│       └── audioFX.ts                   # Web Audio API sound synthesis (lasers, chirps)
└── public/
    ├── models/                          # Optimized 3D GLB/GLTF models
    ├── resume/                          # Hrishi Bhattacharyya Resume PDF
    └── textures/                        # Canvas materials & particle textures
```

---

## 🚀 Quick Start & Development Setup

### 1. Prerequisites
- **Node.js** >= 18.17.0 (Recommended: Node 20 LTS)
- **npm**, **pnpm**, or **yarn**
- **MongoDB** (Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 2. Clone the Repository
```bash
git clone https://github.com/Hrishi1176/My-Portfulio.git
cd My-Portfulio
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create your local `.env.local` file:
```bash
cp .env.example .env.local
```

Populate the required environment variables:
```env
# MongoDB Atlas Database Connection (Required for live telemetry & reviews)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio?retryWrites=true&w=majority

# Payload 3.x CMS Secret
PAYLOAD_SECRET=your_super_secret_payload_key_min_32_characters

# AI Assistant Orchestration (Optional - Keyless local knowledge fallback available)
GEMINI_API_KEY=your_google_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# Email SMTP Delivery (Optional for inquiry dispatch & confirmations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
FROM_EMAIL=your_email@gmail.com

# GitHub Access Token (Optional - Increases rate limit from 60 to 5,000 req/hr)
GITHUB_TOKEN=ghp_your_github_personal_access_token
```

### 5. Run the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the interactive 3D portal.  
Access the Payload CMS Admin Dashboard at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 📦 Production Verification & Deployment

### Build Verification
Always run these checks before deploying or creating a pull request:
```bash
# 1. Typecheck the entire project
npx tsc --noEmit

# 2. Production build with Next.js Turbopack
npx next build
```

### Deploy to Vercel
1. Push your code to GitHub:
   ```bash
   git push origin main
   ```
2. Import the repository in [Vercel Dashboard](https://vercel.com/new).
3. Set your **Environment Variables** in Project Settings.
4. Deploy!

---

## 🛡️ Maintenance & Codebase Safety Rules

If you are an engineer or AI agent extending this codebase in the future, adhere to the guidelines documented in **[AGENTS.md](AGENTS.md)** and **[Skills/SKILL.md](Skills/SKILL.md)**:

- **Never break procedural IK**: The 3D robot arm solver in `src/lib/RobotProceduralLayer.ts` relies on bilateral humanoid bone hierarchies.
- **Never remove `idle_reset`**: Every activity timeline in `src/lib/sceneActivities.ts` must conclude with `{ at: ..., action: "idle_reset" }` to restore cursor tracking.
- **Preserve Z-Index Hierarchy**: Modal dialogs live at `z-[100]`, drawers at `z-50`, floating action buttons at `z-40`, and story banners at `z-30`.
- **Test on Mobile**: Ensure 320px–375px screens have no horizontal scrollbars, clipped text, or overlapping buttons.

---

## 👨‍💻 Author & Engineering Profile

**Hrishi Bhattacharyya**  
- **Role**: Senior Full Stack Engineer & System Architect  
- **Experience**: 4.4+ Years in Scalable SaaS, Micro-Frontends & Cloud Engineering  
- **GitHub**: [@Hrishi1176](https://github.com/Hrishi1176)  
- **LinkedIn**: [linkedin.com/in/hrishi-bhattacharyya](https://linkedin.com/in/hrishi-bhattacharyya)  
- **Email**: [hrishisgp97@gmail.com](mailto:hrishisgp97@gmail.com)  
- **WhatsApp**: [+91 62946 60141](https://wa.me/916294660141)  

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
