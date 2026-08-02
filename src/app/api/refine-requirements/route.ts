import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { draftRequirements, subject, budget } = await request.json();

    if (!draftRequirements || typeof draftRequirements !== "string" || !draftRequirements.trim()) {
      return NextResponse.json(
        { error: "Please enter your initial project draft requirements first before refining." },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert technical product manager and software architect.
Refine, polish, and structure the following client project requirements into a clean, professional, concise project specification statement.

Client Subject / Topic: ${subject || "Software Application Development"}
Target Budget: ${budget || "Not Specified"}
Raw Draft Requirements:
"${draftRequirements}"

Instructions:
- Keep the output clean, structured, concise, and professional (under 120 words).
- Use bullet points or short clear paragraphs.
- Highlight core features, target tech stack suggestions, and technical goals.
- Output ONLY the refined text directly without conversational meta text.
`;

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    // 1. Try Groq Free API (Llama 3.3 70B)
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
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            max_tokens: 300,
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const refined = groqData.choices?.[0]?.message?.content;
          if (refined) return NextResponse.json({ success: true, refinedRequirements: refined.trim() });
        }
      } catch (groqErr) {
        console.error("Groq refine error:", groqErr);
      }
    }

    // 2. Try Google Gemini Free API (Gemini 1.5 Flash)
    if (geminiKey && geminiKey.trim() !== "") {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const refinedText = result.response.text();

        return NextResponse.json({ success: true, refinedRequirements: refinedText.trim() });
      } catch (geminiErr) {
        console.error("Gemini Refine Requirements error:", geminiErr);
      }
    }

    // 3. Try Pollinations Keyless Free AI
    try {
      const pollRes = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          seed: 42,
          model: "openai",
        }),
      });

      if (pollRes.ok) {
        const pollText = await pollRes.text();
        if (pollText && pollText.trim()) {
          return NextResponse.json({ success: true, refinedRequirements: pollText.trim() });
        }
      }
    } catch (pollErr) {
      console.error("Pollinations AI refine error:", pollErr);
    }

    // 4. Smart formatting fallback
    const cleaned = draftRequirements.trim();
    const formattedFallback = `• Project Objective: ${subject || "Custom Development"}\n• Scope & Specifications: ${cleaned}\n• Estimated Budget: ${budget || "Flexible"}\n• Target Architecture: Scalable, high-performance web application with secure backend API & database integration.`;

    return NextResponse.json({ success: true, refinedRequirements: formattedFallback });
  } catch (error) {
    console.error("Refine requirements error:", error);
    return NextResponse.json(
      { error: "Failed to refine requirements. Please try again." },
      { status: 500 }
    );
  }
}
