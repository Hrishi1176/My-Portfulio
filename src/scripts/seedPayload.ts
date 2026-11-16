import { getPayload } from "payload";
import config from "@payload-config";
import portfolioConfig from "../config/portfolioConfig";

const ROBOTVERSE_DEFAULT_AGENTS = [
  {
    agentId: "nova",
    name: "Nova",
    codename: "ROBOT-01 // GUIDE",
    role: "Portfolio Guide",
    sector: "Scene 01 // The Arrival & About",
    sceneNumber: 1,
    targetElementId: "hero",
    modelPath: "/models/robot-mecha.glb",
    glowColor: "#00f0ff",
    glowRgba: "rgba(0, 240, 255, 0.25)",
    voicePitch: 1.15,
    description: "Lead scout and system navigator. Guides visitors across all architectural layers of the portfolio universe.",
    transmission: "Hello, I am Nova! Welcome to Hrishi's digital universe. Let my team show you the scalable architectures we build.",
    status: "NAVIGATING GATEWAY",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    borderColor: "border-cyan-500/30",
    tourSpeech: "👋 Hello! I am Nova, your portfolio guide. Welcome to Hrishi's digital universe. Let my team show you what we build.",
    tourActionLabel: "Explore Frontend Lab",
    order: 0,
  },
  {
    agentId: "codex",
    name: "Codex",
    codename: "ROBOT-02 // FRONTEND",
    role: "Frontend Engineer",
    sector: "Scene 03 // Frontend Development Lab",
    sceneNumber: 3,
    targetElementId: "skills",
    modelPath: "/models/robot-mecha.glb",
    glowColor: "#38bdf8",
    glowRgba: "rgba(56, 189, 248, 0.25)",
    voicePitch: 1.05,
    description: "Architect of responsive user interfaces, fluid animations, Next.js 16 frameworks, and state hydration.",
    transmission: "Assembling floating UI components, Next.js 16 micro-frontends, and responsive design systems with TypeScript.",
    status: "COMPILING UI MESH",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/40",
    borderColor: "border-sky-500/30",
    tourSpeech: "⚡ Codex active. Assembling Next.js 16 reactive interfaces, Tailwind systems, and modular TypeScript components.",
    tourActionLabel: "Inspect Backend Command",
    order: 1,
  },
  {
    agentId: "matrix",
    name: "Matrix",
    codename: "ROBOT-03 // BACKEND",
    role: "Backend Engineer",
    sector: "Scene 04 // Backend Command Center",
    sceneNumber: 4,
    targetElementId: "experience",
    modelPath: "/models/robot-mecha.glb",
    glowColor: "#10b981",
    glowRgba: "rgba(168, 85, 247, 0.25)",
    voicePitch: 0.9,
    description: "Core systems engineer managing distributed microservices, REST endpoints, and asynchronous event streams.",
    transmission: "Synchronizing Node.js microservices, Python distributed tasks, and high-frequency REST API endpoints.",
    status: "ROUTING API PULSES",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    borderColor: "border-emerald-500/30",
    tourSpeech: "🛡️ Matrix online. Connecting microservice server blades, high-throughput REST APIs, and asynchronous message queues.",
    tourActionLabel: "Enter Database Core",
    order: 2,
  },
  {
    agentId: "orbit",
    name: "Orbit",
    codename: "ROBOT-04 // DATABASE",
    role: "Database Engineer",
    sector: "Scene 05 // Database Core",
    sceneNumber: 5,
    targetElementId: "projects",
    modelPath: "/models/robot-mecha.glb",
    glowColor: "#a855f7",
    glowRgba: "rgba(168, 85, 247, 0.25)",
    voicePitch: 0.95,
    description: "Data architect specializing in PostgreSQL relational models, MongoDB clusters, and Redis caching layers.",
    transmission: "Optimizing MongoDB clusters, PostgreSQL relational schemas, and real-time ACID transactions.",
    status: "INDEXING DATA FLOW",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    borderColor: "border-purple-500/30",
    tourSpeech: "🔮 Orbit initialized. Inspecting MongoDB document pipelines, PostgreSQL relational schemas, and real-time cache replication.",
    tourActionLabel: "Check Cloud & DevOps",
    order: 3,
  },
  {
    agentId: "cloudx",
    name: "Cloud-X",
    codename: "ROBOT-05 // DEVOPS",
    role: "DevOps & Cloud Engineer",
    sector: "Scene 06 // Cloud & DevOps Station",
    sceneNumber: 6,
    targetElementId: "reviews",
    modelPath: "/models/robot-mecha.glb",
    glowColor: "#f97316",
    glowRgba: "rgba(249, 115, 22, 0.25)",
    voicePitch: 1.0,
    description: "Site reliability and pipeline specialist overseeing Docker containers, CI/CD automation, and cloud deployments.",
    transmission: "Deploying containerized Docker pods, automated GitHub Actions CI/CD pipelines, and AWS cloud infrastructure.",
    status: "DEPLOYING PODS",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    borderColor: "border-orange-500/30",
    tourSpeech: "🚀 Cloud-X deployed. Automating Docker container pods, AWS serverless deployments, and GitHub Actions CI/CD workflows.",
    tourActionLabel: "Explore AI Foundry",
    order: 4,
  },
  {
    agentId: "neura",
    name: "Neura",
    codename: "ROBOT-06 // AI LAB",
    role: "AI & Automation Engineer",
    sector: "Scene 07 // Artificial Intelligence Universe",
    sceneNumber: 7,
    targetElementId: "analytics",
    modelPath: "/models/robot-mecha.glb",
    glowColor: "#06b6d4",
    glowRgba: "rgba(6, 182, 212, 0.25)",
    voicePitch: 1.2,
    description: "AI specialist developing multi-agent workflows, LLM prompt engineering, and machine learning inference pipelines.",
    transmission: "Conducting vector neural embeddings, Groq Llama inference, and Gemini multi-agent reasoning.",
    status: "INFERRING SYNAPSES",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    borderColor: "border-cyan-500/30",
    tourSpeech: "🧠 Neura connected. Activating deep neural network synapses, intelligent workflow automations, and multi-agent LLM systems.",
    tourActionLabel: "Enter Project Arena",
    order: 5,
  },
  {
    agentId: "titan",
    name: "Titan",
    codename: "ROBOT-07 // ARENA",
    role: "Project Architect",
    sector: "Scene 08 // Project Arena",
    sceneNumber: 8,
    targetElementId: "projects",
    modelPath: "/models/robot-mecha.glb",
    glowColor: "#eab308",
    glowRgba: "rgba(234, 179, 8, 0.25)",
    voicePitch: 0.85,
    description: "Lead solutions architect showcasing enterprise production deployments, SaaS platforms, and client victories.",
    transmission: "Orchestrating multi-tenant SaaS platforms, enterprise ledger engines, and real-time collaboration suites.",
    status: "BENCHMARKING DEPLOYMENTS",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    borderColor: "border-amber-500/30",
    tourSpeech: "🏆 Titan operational. Presenting full-scale enterprise production architectures, SaaS applications, and live deployments.",
    tourActionLabel: "Proceed to Final Mission",
    order: 6,
  },
  {
    agentId: "sentinel",
    name: "Sentinel",
    codename: "ROBOT-08 // ASSEMBLY",
    role: "Mission Commander",
    sector: "Scene 09 // Contact & Final Mission",
    sceneNumber: 9,
    targetElementId: "contact",
    modelPath: "/models/robot-mecha.glb",
    glowColor: "#ec4899",
    glowRgba: "rgba(236, 72, 153, 0.25)",
    voicePitch: 1.1,
    description: "Mission commander coordinating team assembly, telemetry broadcast, and client communication gateway.",
    transmission: "Mission complete. All 7 tactical units assembled at terminal deck. Ready to collaborate with you.",
    status: "SQUAD SYNCHRONIZED",
    badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/40",
    borderColor: "border-pink-500/30",
    tourSpeech: "🤝 All systems synchronized. Thank you for touring Hrishi's technology universe. Drop a message to start building together!",
    tourActionLabel: "Send Dispatch Message",
    order: 7,
  },
];

const DEFAULT_IMPACT_METRICS = [
  {
    label: "API Response Latency",
    before: "480",
    after: "38",
    unit: "ms",
    detail: "Redis caching & edge compute routing",
  },
  {
    label: "System Throughput",
    before: "12k",
    after: "450k",
    unit: "req/min",
    detail: "Stateless horizontally scalable cluster",
  },
  {
    label: "Deployment Frequency",
    before: "Bi-weekly",
    after: "Continuous",
    unit: "CI/CD",
    detail: "Zero-downtime blue/green rollouts",
  },
  {
    label: "Production Uptime",
    before: "98.2%",
    after: "99.99%",
    unit: "SLA",
    detail: "Multi-region failover & automated healing",
  },
];

export async function seedPayloadDatabase() {
  console.log("Starting Payload CMS database seeding from config & ROBOTVERSE schemas...");
  const payload = await getPayload({ config });

  // 1. Seed Projects
  const existingProjects = await payload.find({ collection: "projects", limit: 1 });
  if (existingProjects.totalDocs === 0) {
    console.log(`Seeding ${portfolioConfig.projects.length} projects...`);
    for (let i = 0; i < portfolioConfig.projects.length; i++) {
      const p = portfolioConfig.projects[i];
      await payload.create({
        collection: "projects",
        data: {
          title: p.title,
          number: p.number,
          description: p.description,
          featured: p.featured || false,
          isPrivate: p.isPrivate || false,
          stars: p.stars || 0,
          github: p.github || "",
          live: p.live || "",
          tech: p.tech.map((t) => ({ name: t })),
          language: p.language || "",
          gradient: p.gradient || "from-purple-600/20 via-indigo-600/20 to-blue-600/20",
          tagColor: p.tagColor || "text-purple-600 dark:text-purple-300 border-purple-500/30",
          order: i,
        },
      });
    }
    console.log("✓ Projects seeded successfully.");
  } else {
    console.log("Projects already exist in database, skipping.");
  }

  // 2. Seed Experiences
  const existingExp = await payload.find({ collection: "experiences", limit: 1 });
  if (existingExp.totalDocs === 0) {
    console.log(`Seeding ${portfolioConfig.experience.roles.length} experiences...`);
    for (let i = 0; i < portfolioConfig.experience.roles.length; i++) {
      const r = portfolioConfig.experience.roles[i];
      await payload.create({
        collection: "experiences",
        data: {
          company: r.company,
          role: r.role,
          period: r.period,
          location: r.location || "",
          badge: r.badge || "Full-Time",
          summary: "",
          responsibilities: (r.responsibilities || []).map((item: string) => ({ item })),
          tech: (r.tech || []).map((name: string) => ({ name })),
          order: i,
        },
      });
    }
    console.log("✓ Experiences seeded successfully.");
  }

  // 3. Seed Skills
  const existingSkills = await payload.find({ collection: "skills", limit: 1 });
  if (existingSkills.totalDocs === 0) {
    console.log(`Seeding ${portfolioConfig.skills.categories.length} skill categories...`);
    for (let i = 0; i < portfolioConfig.skills.categories.length; i++) {
      const cat = portfolioConfig.skills.categories[i];
      await payload.create({
        collection: "skills",
        data: {
          title: cat.title,
          categoryIcon: cat.icon || "",
          order: i,
          skillsList: (cat.skills || []).map((s) => ({
            name: s.name,
            icon: s.icon,
            color: s.color || "",
          })),
        },
      });
    }
    console.log("✓ Skills seeded successfully.");
  }

  // 4. Seed Education
  const existingEdu = await payload.find({ collection: "education", limit: 1 });
  if (existingEdu.totalDocs === 0) {
    console.log(`Seeding ${portfolioConfig.education.length} education entries...`);
    for (let i = 0; i < portfolioConfig.education.length; i++) {
      const edu = portfolioConfig.education[i];
      await payload.create({
        collection: "education",
        data: {
          degree: edu.title,
          field: edu.field,
          institution: edu.school,
          period: edu.period || "",
          score: edu.grade || "",
          order: i,
        },
      });
    }
    console.log("✓ Education seeded successfully.");
  }

  // 5. Seed Robots Collection (ROBOTVERSE Multi-Agent System)
  const existingRobots = await payload.find({ collection: "robots", limit: 1 });
  if (existingRobots.totalDocs === 0) {
    console.log(`Seeding ${ROBOTVERSE_DEFAULT_AGENTS.length} ROBOTVERSE agents...`);
    for (const bot of ROBOTVERSE_DEFAULT_AGENTS) {
      await payload.create({
        collection: "robots",
        data: bot,
      });
    }
    console.log("✓ Robots collection seeded successfully.");
  } else {
    console.log("Robots collection already populated, skipping.");
  }

  // 6. Seed SiteContent Global (including Impact Metrics)
  try {
    const existingSiteContent = (await payload.findGlobal({ slug: "site-content" })) as Record<string, unknown> | null;
    if (!existingSiteContent || !existingSiteContent.name) {
      console.log("Seeding SiteContent Global from config...");
      await payload.updateGlobal({
        slug: "site-content",
        data: {
          name: portfolioConfig.developer.name,
          firstName: portfolioConfig.developer.firstName,
          lastName: portfolioConfig.developer.lastName,
          role: portfolioConfig.developer.role,
          title: portfolioConfig.developer.title,
          experienceYears: portfolioConfig.developer.experienceYears,
          email: portfolioConfig.developer.email,
          phone: portfolioConfig.developer.phone,
          whatsapp: portfolioConfig.developer.whatsapp,
          location: portfolioConfig.developer.location,
          socials: {
            github: portfolioConfig.developer.github,
            linkedin: portfolioConfig.developer.linkedin,
            instagram: portfolioConfig.developer.instagram,
            facebook: portfolioConfig.developer.facebook,
          },
          availabilityBadge: portfolioConfig.hero.availabilityBadge,
          tagline: portfolioConfig.hero.tagline,
          stats: portfolioConfig.hero.stats.map((s) => ({ value: s.value, label: s.label })),
          floatingBadges: portfolioConfig.hero.floatingBadges.map((b) => ({
            label: b.label,
            color: b.color,
            border: b.border,
            text: b.text,
            top: b.top,
            left: b.left,
            delay: b.delay,
          })),
          techStreams: portfolioConfig.hero.techStreams.map((ts) => ({
            name: ts.name,
            tag: ts.tag,
            speed: ts.speed,
            color: ts.color,
          })),
          bioParagraphs: portfolioConfig.about.bioParagraphs.map((p) => ({ paragraph: p })),
          traits: portfolioConfig.about.traits.map((t) => ({ trait: t })),
          focusAreas: portfolioConfig.about.focusAreas.map((fa) => ({
            label: fa.label,
            icon: fa.icon || "Cpu",
            color: fa.color,
          })),
          subjectOptions: portfolioConfig.contactOptions.subjectOptions.map((s) => ({ subject: s })),
          budgetRanges: portfolioConfig.contactOptions.budgetRanges.map((b) => ({
            value: b.value,
            label: b.label,
          })),
          aiChat: {
            maxDailyChats: portfolioConfig.aiChat.maxDailyChats,
            maxDailyRefinements: portfolioConfig.aiChat.maxDailyRefinements,
            suggestedPrompts: portfolioConfig.aiChat.suggestedPrompts.map((p) => ({ prompt: p })),
          },
          navigation: portfolioConfig.navigation.map((n) => ({
            name: n.name,
            href: n.href,
          })),
          impactMetrics: DEFAULT_IMPACT_METRICS,
        },
      });
      console.log("✓ SiteContent Global seeded successfully.");
    } else {
      // If SiteContent exists but impactMetrics is missing or empty, update impactMetrics
      const impact = existingSiteContent.impactMetrics as unknown[];
      if (!impact || impact.length === 0) {
        console.log("Updating SiteContent with Impact Metrics...");
        await payload.updateGlobal({
          slug: "site-content",
          data: {
            impactMetrics: DEFAULT_IMPACT_METRICS,
          },
        });
        console.log("✓ Impact Metrics added to SiteContent Global.");
      } else {
        console.log("SiteContent Global already populated with Impact Metrics, skipping.");
      }
    }
  } catch (err) {
    console.error("Error seeding SiteContent Global:", err);
  }

  console.log("Payload database seeding completed successfully!");
}
