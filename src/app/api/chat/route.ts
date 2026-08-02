import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const HRISHI_SYSTEM_PROMPT = `
You are the official AI Portfolio Assistant for Hrishi Bhattacharya.
Your goal is to answer visitor questions accurately, professionally, and concisely in a friendly voice.

DEVELOPER PROFILE:
- Name: Hrishi Bhattacharya
- Role: Senior Software Developer & Full Stack Engineer
- Experience: 4.5+ years of experience building scalable web applications, multi-tenant SaaS platforms, workflow automation, and cloud data solutions.
- Work History:
  - eDge Wrapper Technology Pvt. Ltd. (01-Mar-2022 to 29-Jun-2026): Started as Associate Software Developer and promoted to Manager - Software Development Team. Led Next.js multi-tenant e-commerce platform and enterprise office management suite.
- Featured Projects:
  1. CloudLedger: Cloud financial ledger & analytics platform (Next.js 16, TypeScript, Live at https://cloud-ledger-coral.vercel.app).
  2. WorkPilot-AI: AI-powered workspace & task automation platform (TypeScript 97.5%, Live at https://work-pilot-ai.vercel.app).
  3. OpenConnect: High-performance API integration & gateway service (JavaScript 55.5%, Python 12.7%, Render Live at https://openconnect-95uc.onrender.com).
  4. Music Library: Digital music management platform (PHP, MySQL).
- Technical Stack: React.js, Next.js 16, TypeScript, JavaScript, Python, Node.js, REST & WebSockets, PostgreSQL, MongoDB, Snowflake, HTML5/CSS3, Git, CI/CD, Agile.
- Education: Bachelor of Engineering in IT (UIT Burdwan University), Diploma in CST (Siliguri Govt Polytechnic).
- Contact: Email: hrishisgp97@gmail.com | Phone/WhatsApp: +91 62946 60141 | GitHub: https://github.com/Hrishi1176

Guidelines:
1. Keep answers concise (2 to 4 sentences).
2. Always provide direct links to GitHub or live demos when asked about projects.
3. Encourage users to fill out the contact form or message on WhatsApp for hiring or custom project inquiries.
`;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message string is required." }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    // 1. Check Groq API (Free Tier: Llama 3.3 70B / Llama 3.1 8B at console.groq.com)
    if (groqKey && groqKey.trim() !== "") {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: HRISHI_SYSTEM_PROMPT },
              { role: "user", content: message },
            ],
            temperature: 0.5,
            max_tokens: 300,
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const reply = groqData.choices?.[0]?.message?.content;
          if (reply) return NextResponse.json({ success: true, reply, provider: "Groq (Llama 3.3)" });
        }
      } catch (groqErr) {
        console.error("Groq API error:", groqErr);
      }
    }

    // 2. Check Google Gemini API (Free Tier at aistudio.google.com)
    if (geminiKey && geminiKey.trim() !== "") {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: HRISHI_SYSTEM_PROMPT,
        });

        const result = await model.generateContent(message);
        const reply = result.response.text();

        return NextResponse.json({ success: true, reply, provider: "Google Gemini" });
      } catch (geminiError) {
        console.error("Gemini API execution error:", geminiError);
      }
    }

    // 3. Keyless Public Free GenAI Endpoint (Pollinations AI text model)
    try {
      const pollRes = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: HRISHI_SYSTEM_PROMPT },
            { role: "user", content: message },
          ],
          seed: 42,
          model: "openai",
        }),
      });

      if (pollRes.ok) {
        const pollText = await pollRes.text();
        if (pollText && pollText.trim()) {
          return NextResponse.json({ success: true, reply: pollText.trim(), provider: "Pollinations Free AI" });
        }
      }
    } catch (pollErr) {
      console.error("Pollinations AI error:", pollErr);
    }

    // 4. Built-in Profile Knowledge Fallback
    const lower = message.toLowerCase();
    let responseText = "";

    if (lower.includes("experience") || lower.includes("work") || lower.includes("company") || lower.includes("job") || lower.includes("history")) {
      responseText = "Hrishi has over 4.5 years of software engineering experience! He worked at eDge Wrapper Technology Pvt. Ltd. from March 2022 to June 2026, starting as Associate Developer and getting promoted to Manager leading the software development team.";
    } else if (lower.includes("project") || lower.includes("workpilot") || lower.includes("openconnect") || lower.includes("cloudledger") || lower.includes("github")) {
      responseText = "Hrishi has built several featured projects:\n• CloudLedger: https://cloud-ledger-coral.vercel.app\n• WorkPilot-AI: https://work-pilot-ai.vercel.app\n• OpenConnect: https://openconnect-95uc.onrender.com\nCheck out all his code at https://github.com/Hrishi1176";
    } else if (lower.includes("skill") || lower.includes("tech") || lower.includes("stack") || lower.includes("python") || lower.includes("react")) {
      responseText = "Hrishi's primary stack includes React, Next.js 16, TypeScript, Python, Node.js, PostgreSQL, MongoDB, Snowflake, and AI Agent workflows.";
    } else if (lower.includes("contact") || lower.includes("email") || lower.includes("hire") || lower.includes("whatsapp")) {
      responseText = "You can contact Hrishi directly:\n• Email: hrishisgp97@gmail.com\n• WhatsApp: +91 62946 60141\n• Or submit your project requirements right here on the portfolio!";
    } else {
      responseText = "Hello! I am Hrishi's AI Portfolio Assistant. Ask me anything about Hrishi's 4.5+ years of software experience, GitHub projects, technical stack, or how to hire him!";
    }

    return NextResponse.json({ success: true, reply: responseText, provider: "Knowledge Base" });
  } catch (error) {
    console.error("AI Chatbot API error:", error);
    return NextResponse.json({ error: "Failed to process chat query." }, { status: 500 });
  }
}
