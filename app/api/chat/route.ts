import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export type ChatBody = {
  message?: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
};

const CHAT_SYSTEM = `You are an insurance assistant for InsurX. You help with climate risk, underwriting, and client questions. Answer in a professional, concise way. Keep responses under 400 words unless more detail is needed.`;

const MOCK_REPLY =
  "This is a mocked response. Set GEMINI_API_KEY in .env.local to get real answers.";

/**
 * POST /api/chat
 * Accepts a message (and optional history) and returns a Gemini reply.
 * Uses Gemini when GEMINI_API_KEY is set; otherwise returns a mock.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatBody;
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const history = Array.isArray(body.history) ? body.history : [];

    console.log("[chat] Request:", {
      messageLength: message.length,
      historyCount: history.length,
    });

    if (!message) {
      console.log("[chat] Validation failed: message missing");
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    console.log(
      "[chat] GEMINI_API_KEY present:",
      !!apiKey,
      "(length:",
      apiKey?.length ?? 0,
      ")",
    );

    if (!apiKey) {
      console.log("[chat] No GEMINI_API_KEY, returning mock");
      return NextResponse.json({ text: MOCK_REPLY });
    }

    try {
      console.log("[chat] Calling Gemini (model: gemini-3-flash-preview)...");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

      // Build contents: history as alternating user/model, then current message
      let contents: string;
      if (history.length > 0) {
        const parts = history
          .slice(-10)
          .map((m) =>
            m.role === "user"
              ? `User: ${m.content}`
              : `Assistant: ${m.content}`,
          );
        contents = parts.join("\n\n") + "\n\nUser: " + message;
      } else {
        contents = message;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: contents }],
          },
        ],
        config: {
          systemInstruction: CHAT_SYSTEM,
          maxOutputTokens: 1024,
        },
      });

      const text =
        (
          response as { response?: { text?: () => string } }
        )?.response?.text?.() ?? response?.text?.trim();
      const textTrimmed = typeof text === "string" ? text.trim() : "";
      console.log("[chat] Gemini response:", {
        hasResponse: !!response,
        hasText: !!textTrimmed,
        textLength: textTrimmed?.length ?? 0,
      });
      if (textTrimmed) {
        return NextResponse.json({ text: textTrimmed });
      }
      console.log("[chat] Gemini returned no text, falling back to mock");
    } catch (err) {
      const error = err as Error;
      console.error("[chat] Gemini error:", {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
      });
    }

    return NextResponse.json({ text: MOCK_REPLY });
  } catch (err) {
    const error = err as Error;
    console.error("[chat] Request error:", error?.message, error?.stack);
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }
}
