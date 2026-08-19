# ⚡ Hrishi Bhattacharyya — Developer Portfolio & Systems Portal

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-ff0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> An enterprise-grade, high-performance developer portal and interactive portfolio engineered with **Next.js 16**, **React 19**, and **Framer Motion**. Features **ultra-responsive multi-device adaptability (Mobile, Tablet, Laptop, 4K Desktop)**, **zero-maintenance dynamic GitHub project auto-synchronization**, **real-time MongoDB telemetry**, and a **multi-model AI Assistant (Google Gemini & Groq Llama 3.3)**.

---

## 🌟 Key Features & Highlights

### 📱 1. Extreme Multi-Device Responsiveness
- **Pixel-Perfect Adaptive Layouts**: Tailored for **Mobile Phones (320px - 640px)**, **Tablets (640px - 1024px)**, **Laptops (1024px - 1440px)**, and **Ultra-Wide 4K Desktops (1440px+)**.
- **Mobile Navigation Drawer**: Smooth spring-animated slide-in navigation drawer with safe-area spacing and quick-tap action buttons.
- **Adaptive Grid & Card Sizing**: Auto-scaling cards with fluid typography that ensure zero awkward line wraps or overflow on compact smartphone viewports.
- **Touch-Friendly Controls**: Interactive elements with 44px+ touch targets, swipe-friendly sliders, and responsive search inputs.

### ✨ 2. Rich Motion & Animation Architecture
- **Ambient Video Motion Layer**: Integrated [Background.mp4](file:///d:/My-Portfulio/public/Background.mp4) looped video background with glassmorphism gradient blend modes, dark/light adaptive masks, and interactive play/pause controls.
- **Framer Motion Micro-Interactions**: Hardware-accelerated transitions, interactive hover lifts (`whileHover={{ y: -6 }}`), and stagger scroll reveals (`viewport={{ once: true }}`).
- **Interactive Particle Background**: Real-time canvas particle mesh that dynamically connects nearby nodes and responds to user interaction.
- **Aurora Ambient Mesh & Pulsing Orbs**: Multilayered ambient glowing background orbs with smooth color shifts and blur filters.
- **Shimmer & Neon Cyberpunk Accents**: Dynamic gradient glow borders, animated badge pings, and rotating dual orbital rings surrounding the developer avatar.
- **Infinite Skills Marquee**: Smooth GPU-accelerated horizontal marquee animation with pause-on-hover capability.

### 🔄 3. Dynamic Zero-Code GitHub Project Auto-Sync
- **Real-Time API Synchronization**: Directly queries [GitHub REST API](https://api.github.com/users/Hrishi1176) to retrieve public repositories, star counts (`⭐`), forks (`🍴`), and latest commit timestamps.
- **Zero Code Maintenance**: Any new public repository pushed to GitHub automatically shows up on the portfolio within 60 seconds with no redeployment needed.
- **Smart Metadata Parsing**: Automatically derives readable titles, extracts repo descriptions, aggregates topics into tech tags, and links live website demos (`homepage`).
- **Dynamic Palette Generator**: Automatically assigns coordinated neon glassmorphism gradients and borders.
- **Filter & Search Engine**: Live keyword search and dynamic technology pill filters (*TypeScript*, *JavaScript*, *Next.js*, *Python*, *PHP*, etc.).
- **Dual Presentation Modes**: Switch effortlessly between an auto-playing **Slider View** and multi-column **Grid View**.

### 🤖 4. Multi-Provider AI Assistant & Requirement Refiner
- **Autonomous Chatbot**: Integrated floating AI Assistant that can converse about career history, technical stack, and dynamically loaded GitHub projects.
- **Multi-LLM Architecture**: Supports **Groq Cloud (Llama 3.3 70B)** and **Google Gemini 1.5 Flash**, with automatic keyless knowledge base fallback.
- **Requirement Refinement Tool**: Refines rough client inquiries into concise technical specifications with budget scoping.

### 📊 5. Live Telemetry & Analytics Engine
- **MongoDB Visitor Tracking**: Records real page visits and computes active 15-minute visitor sessions.
- **Live Stats Dashboard**: Displays real-time GitHub stars, public repository count, inquiry metrics, and infrastructure availability uptime.
- **Client Reviews & Feedback System**: Real-time review submissions stored in MongoDB with rating moderation.

### 📬 6. Secure Contact & Email Notification System
- **Nodemailer Integration**: Handles direct inquiries with automated client confirmations and developer email notifications.
- **Input Sanitization & Rate Limiting**: Built-in protection against spam and payload attacks.

---

## 🏗️ Architecture & Directory Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analytics/            # MongoDB telemetry & visitor tracking route
│   │   ├── chat/                 # AI Assistant conversation endpoint
│   │   ├── contact/              # Contact form & email dispatcher
│   │   ├── projects/             # Dynamic GitHub repo synchronization endpoint
│   │   ├── refine-requirements/  # AI scope refinement endpoint
│   │   └── reviews/              # Client feedback & rating API
│   ├── globals.css               # Design system tokens, aurora mesh & animations
│   ├── layout.tsx                # Root layout with ThemeProvider & Metadata
│   └── page.tsx                  # Interactive single-page developer portal
├── components/
│   ├── AIChatbot.tsx             # Floating responsive AI Chatbot assistant
│   ├── ParticleBackground.tsx    # Interactive canvas particle mesh
│   ├── SocialIcons.tsx           # Vector social brand icons
│   ├── ThemeToggle.tsx           # Light / Dark mode toggle
│   ├── layout/                   # Header, Navigation, and Footer
│   └── sections/                 # Hero, About, Skills, Experience, Projects, Reviews, LiveAnalytics, Contact
├── config/
│   ├── portfolioConfig.json      # Structured portfolio configuration & resume data
│   └── portfolioConfig.ts        # TypeScript interfaces & config parser
├── lib/
│   ├── email.ts                  # Nodemailer transport & HTML email templates
│   ├── mongodb.ts                # MongoDB client singleton connection
│   └── security.ts               # Input sanitization & security helpers
└── services/
    ├── AIService.ts              # Gemini / Groq multi-model orchestration
    └── GitHubProjectsService.ts  # GitHub REST API fetcher, parser & color styler
```

---

## 🚀 Quick Start & Development Setup

### 1. Prerequisites
- **Node.js** >= 18.17.0
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
Copy `.env.example` to create your local `.env.local` file:
```bash
cp .env.example .env.local
```

Populate your desired environment variables:
```env
# Optional GitHub Personal Access Token (Increases rate limit from 60 to 5,000 req/hr)
GITHUB_TOKEN=ghp_your_github_token_here

# AI Assistant API Keys (Optional)
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# MongoDB Connection String (Optional for live telemetry & reviews)
MONGODB_URI=mongodb://127.0.0.1:27017/portfolio

# Email SMTP Delivery (Optional for contact form autoresponder)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=your_email@gmail.com
```

### 5. Run the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore your responsive, animated developer portal.

---

## 📦 Production Build & Deployment

### Production Build
```bash
npm run build
npm run start
```

### Deploy to Vercel
1. Push your code to GitHub:
   ```bash
   git push origin main
   ```
2. Import the repository in [Vercel Dashboard](https://vercel.com/new).
3. Set your **Environment Variables** in Project Settings.
4. Click **Deploy** for automatic global edge deployment.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Hrishi Bhattacharyya**  
- **Role**: Senior Full Stack Engineer & System Architect  
- **GitHub**: [@Hrishi1176](https://github.com/Hrishi1176)  
- **LinkedIn**: [Hrishi Bhattacharyya](https://www.linkedin.com/in/hrishi-bhattacharyya-b78332204/)  
- **Live Portfolio**: [my-portfulio-ten.vercel.app](https://my-portfulio-ten.vercel.app)  
- **Email**: [hrishisgp97@gmail.com](mailto:hrishisgp97@gmail.com)