import { GoogleGenerativeAI } from "@google/generative-ai";
import { GitHubProjectsService } from "@/services/GitHubProjectsService";
import { PayloadService } from "@/services/payloadService";

export type AIModelId =
  | "auto"
  | "gemini-2.0-flash"
  | "llama-3.3-70b"
  | "deepseek-r1"
  | "claude-3-5-sonnet"
  | "gpt-4o-mini";

export interface AIServiceResponse {
  success: boolean;
  reply: string;
  provider: string;
  modelId?: string;
  latencyMs?: number;
}

export interface AIRefineResponse {
  success: boolean;
  refinedRequirements: string;
  provider: string;
}

/**
 * OOP Class: AIService
 * Multi-Provider Frontier AI Matrix (Gemini 2.0, Groq Llama 3.3, DeepSeek R1, Claude 3.5, GPT-4o)
 * Driven dynamically by portfolio configuration and dynamic GitHub repositories.
 */
export class AIService {
  private geminiKey: string | undefined;
  private groqKey: string | undefined;
  private openaiKey: string | undefined;
  private anthropicKey: string | undefined;
  private deepseekKey: string | undefined;

  constructor() {
    this.geminiKey = process.env.GEMINI_API_KEY;
    this.groqKey = process.env.GROQ_API_KEY;
    this.openaiKey = process.env.OPENAI_API_KEY;
    this.anthropicKey = process.env.ANTHROPIC_API_KEY;
    this.deepseekKey = process.env.DEEPSEEK_API_KEY;
  }

  private async getSystemPrompt(): Promise<string> {
    const siteContent = await PayloadService.getSiteContent();
    const dev = siteContent.developer;
    const experiences = await PayloadService.getExperiences();
    const exp = experiences[0] || {
      company: "Software Systems",
      role: dev.role || "Software Developer",
      period: "Recent",
    };
    let allProjects = await PayloadService.getProjects();
    try {
      const gitHubProjects = await GitHubProjectsService.getDynamicProjects();
      if (gitHubProjects && gitHubProjects.length > 0) {
        allProjects = gitHubProjects;
      }
    } catch {
      // Keep CMS projects
    }

    const projectsSummary = allProjects
      .map(
        (p) =>
          `- ${p.title}: ${p.description} (Tech: ${p.tech.join(", ")}) [Demo: ${p.live || "N/A"}, Repo: ${p.github || "N/A"}]`
      )
      .join("\n");

    return `
You are the official Cyber-Avengers AI Portfolio Assistant for ${dev.name}.
DEVELOPER PROFILE:
- Name: ${dev.name}
- Role: ${dev.title}
- Experience: ${dev.experienceYears} years building high-resilience web apps, SaaS platforms, 3D WebGL architectures, and distributed systems.
- Work History: ${exp.company} (${exp.period}, ${exp.role}).
- Active & Public Projects (${allProjects.length} total):
${projectsSummary}
- Contact: ${dev.email} | WhatsApp: ${dev.whatsapp} | GitHub: ${dev.github}
- Tone: Professional, enthusiastic, concise (under 90 words unless details requested), and tech-savvy.
`;
  }

  /**
   * Generates a conversational chat reply using selected or best-available frontier AI provider
   */
  public async generateChatReply(query: string, modelId: string = "auto"): Promise<AIServiceResponse> {
    const startTime = Date.now();
    const systemPrompt = await this.getSystemPrompt();

    // ── Strategy: Route based on requested model with automatic cascade failover ──
    const targetModel = modelId.toLowerCase();

    // 1. Anthropic Claude 3.5 Sonnet
    if (targetModel === "claude-3-5-sonnet" && this.anthropicKey && this.anthropicKey.trim() !== "") {
      const res = await this.callAnthropic(query, systemPrompt, startTime);
      if (res) return res;
    }

    // 2. OpenAI GPT-4o-mini
    if (targetModel === "gpt-4o-mini" && this.openaiKey && this.openaiKey.trim() !== "") {
      const res = await this.callOpenAI(query, systemPrompt, startTime);
      if (res) return res;
    }

    // 3. DeepSeek R1 (via Groq or DeepSeek API)
    if (targetModel === "deepseek-r1") {
      if (this.groqKey && this.groqKey.trim() !== "") {
        const res = await this.callGroq(query, systemPrompt, "deepseek-r1-distill-llama-70b", "Groq (DeepSeek R1)", startTime);
        if (res) return res;
      }
      if (this.deepseekKey && this.deepseekKey.trim() !== "") {
        const res = await this.callDeepSeek(query, systemPrompt, startTime);
        if (res) return res;
      }
    }

    // 4. Google Gemini 2.0 / 1.5 Flash
    if (targetModel === "gemini-2.0-flash" && this.geminiKey && this.geminiKey.trim() !== "") {
      const res = await this.callGemini(query, systemPrompt, startTime);
      if (res) return res;
    }

    // 5. Groq Llama 3.3 70B (Explicit or Auto Primary)
    if (this.groqKey && this.groqKey.trim() !== "") {
      const res = await this.callGroq(query, systemPrompt, "llama-3.3-70b-versatile", "Groq (Llama 3.3)", startTime);
      if (res) return res;
    }

    // 6. Gemini Failover
    if (this.geminiKey && this.geminiKey.trim() !== "") {
      const res = await this.callGemini(query, systemPrompt, startTime);
      if (res) return res;
    }

    // 7. OpenAI Failover
    if (this.openaiKey && this.openaiKey.trim() !== "") {
      const res = await this.callOpenAI(query, systemPrompt, startTime);
      if (res) return res;
    }

    // 8. Deterministic Local Knowledge Base Fallback
    const fallback = await this.getKnowledgeBaseFallback(query);
    return {
      ...fallback,
      latencyMs: Date.now() - startTime,
    };
  }

  private async callGroq(
    query: string,
    systemPrompt: string,
    model: string,
    providerLabel: string,
    startTime: number
  ): Promise<AIServiceResponse | null> {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.groqKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: query },
          ],
          temperature: 0.5,
          max_tokens: 320,
        }),
      });

      if (groqRes.ok) {
        const data = await groqRes.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          // Clean any <think> tags if DeepSeek R1 emitted reasoning tokens
          const cleanReply = reply.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
          return {
            success: true,
            reply: cleanReply,
            provider: providerLabel,
            modelId: model,
            latencyMs: Date.now() - startTime,
          };
        }
      }
    } catch (err) {
      console.error("AIService Groq error:", err);
    }
    return null;
  }

  private async callGemini(
    query: string,
    systemPrompt: string,
    startTime: number
  ): Promise<AIServiceResponse | null> {
    try {
      const genAI = new GoogleGenerativeAI(this.geminiKey!);
      // Try Gemini 2.0 Flash first, fall back to 1.5 Flash
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: systemPrompt,
      });

      const result = await model.generateContent(query);
      const reply = result.response.text();
      return {
        success: true,
        reply: reply.trim(),
        provider: "Google Gemini 2.0",
        modelId: "gemini-2.0-flash",
        latencyMs: Date.now() - startTime,
      };
    } catch {
      // Fallback to gemini-1.5-flash
      try {
        const genAI = new GoogleGenerativeAI(this.geminiKey!);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: systemPrompt,
        });
        const result = await model.generateContent(query);
        return {
          success: true,
          reply: result.response.text().trim(),
          provider: "Google Gemini 1.5",
          modelId: "gemini-1.5-flash",
          latencyMs: Date.now() - startTime,
        };
      } catch (err) {
        console.error("AIService Gemini error:", err);
      }
    }
    return null;
  }

  private async callOpenAI(
    query: string,
    systemPrompt: string,
    startTime: number
  ): Promise<AIServiceResponse | null> {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: query },
          ],
          temperature: 0.5,
          max_tokens: 320,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          return {
            success: true,
            reply: reply.trim(),
            provider: "OpenAI GPT-4o Mini",
            modelId: "gpt-4o-mini",
            latencyMs: Date.now() - startTime,
          };
        }
      }
    } catch (err) {
      console.error("AIService OpenAI error:", err);
    }
    return null;
  }

  private async callAnthropic(
    query: string,
    systemPrompt: string,
    startTime: number
  ): Promise<AIServiceResponse | null> {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.anthropicKey!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          system: systemPrompt,
          messages: [{ role: "user", content: query }],
          max_tokens: 320,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.content?.[0]?.text;
        if (reply) {
          return {
            success: true,
            reply: reply.trim(),
            provider: "Claude 3.5 Sonnet",
            modelId: "claude-3-5-sonnet",
            latencyMs: Date.now() - startTime,
          };
        }
      }
    } catch (err) {
      console.error("AIService Anthropic error:", err);
    }
    return null;
  }

  private async callDeepSeek(
    query: string,
    systemPrompt: string,
    startTime: number
  ): Promise<AIServiceResponse | null> {
    try {
      const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.deepseekKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: query },
          ],
          temperature: 0.5,
          max_tokens: 320,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          return {
            success: true,
            reply: reply.trim(),
            provider: "DeepSeek V3",
            modelId: "deepseek-chat",
            latencyMs: Date.now() - startTime,
          };
        }
      }
    } catch (err) {
      console.error("AIService DeepSeek error:", err);
    }
    return null;
  }

  /**
   * Refines draft client requirements into a structured technical scope
   */
  public async refineProjectRequirements(
    draft: string,
    subject: string,
    budget: string,
    preferredProvider?: string
  ): Promise<AIRefineResponse> {
    const prompt = `
You are an expert technical product manager and software architect.
Refine the following project requirements into a clean, professional, concise specification statement under 120 words.
Subject: ${subject}
Budget: ${budget}
Raw Draft: "${draft}"
Instructions: Use bullet points, highlight core features, target tech stack, and goals. Output ONLY refined text directly.
`;

    // Try Groq if selected or available
    if ((preferredProvider === "groq" || !this.geminiKey) && this.groqKey) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            max_tokens: 300,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const refined = data.choices?.[0]?.message?.content;
          if (refined) return { success: true, refinedRequirements: refined.trim(), provider: "Groq (Llama 3.3)" };
        }
      } catch (err) {
        console.error("AIService Refine Groq error:", err);
      }
    }

    // Try Gemini if available
    if (this.geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(this.geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        return { success: true, refinedRequirements: result.response.text().trim(), provider: "Google Gemini" };
      } catch (err) {
        console.error("AIService Refine Gemini error:", err);
      }
    }

    // Fallback template
    const fallbackText = `• Project Objective: ${subject || "Custom Development"}\n• Scope & Specifications: ${draft.trim()}\n• Estimated Budget: ${budget || "Flexible"}\n• Target Architecture: Scalable, high-performance web application with secure backend API & database integration.`;

    return { success: true, refinedRequirements: fallbackText, provider: "Smart Template" };
  }

  private async getKnowledgeBaseFallback(query: string): Promise<AIServiceResponse> {
    const lower = query.toLowerCase();
    const siteContent = await PayloadService.getSiteContent();
    const dev = siteContent.developer;
    const experiences = await PayloadService.getExperiences();
    const exp = experiences[0] || { company: "Software Systems", role: dev.role, period: "Recent" };
    let reply = "";

    if (lower.includes("experience") || lower.includes("work") || lower.includes("company")) {
      reply = `${dev.name} has ${dev.experienceYears} years of software engineering experience, progressing from Associate Developer to ${exp.role} at ${exp.company}.`;
    } else if (lower.includes("project") || lower.includes("workpilot") || lower.includes("cloudledger")) {
      reply = `${dev.firstName} built advanced enterprise systems and software solutions. Explore all projects at ${dev.github}`;
    } else if (lower.includes("contact") || lower.includes("email") || lower.includes("whatsapp")) {
      reply = `Reach ${dev.firstName} at ${dev.email}, WhatsApp ${dev.whatsapp}, or fill out the portfolio contact form.`;
    } else {
      reply = `Hello! I am ${dev.firstName}'s AI Portfolio Assistant. Ask me anything about ${dev.name}'s software experience, GitHub projects, or technical skills!`;
    }

    return { success: true, reply, provider: "Knowledge Base (Offline Core)", modelId: "smart-fallback" };
  }
}
