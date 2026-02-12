import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export type AnalyzeRiskBody = {
  address?: string;
  city?: string;
  postalCode?: string;
};

const RISK_ANALYSIS_SYSTEM = `You are an insurance risk analyst. Given a client's address, city, and optional postal code, you must provide a climate risk analysis for the zone.

Your response MUST follow this structure:
1. First line: give a single "Climate risk (zone): X%" where X is a percentage between 0 and 100 for the overall climate risk in that area (flood, storm, drought, fire, etc.). Be consistent and base it on typical exposure for such a location.
2. Then in plain text, briefly explain: main exposure factors (flood, storm, etc.), any notable natural hazards, and a short recommendation on coverage or pricing (1–2 sentences).
Keep the full response under 300 words, professional, and in English.`;

function buildMockAnalysis(address: string, city: string, postalCode: string) {
  const locationLabel = [address, city, postalCode].filter(Boolean).join(", ");
  return [
    `**Risk analysis for:** ${locationLabel}`,
    "",
    "Climate risk (zone): —%",
    "",
    "This is a mocked response. Set GEMINI_API_KEY in .env.local for real risk analysis based on client address and zone data.",
    "",
    "Once Gemini is configured, the analysis will include a climate risk percentage for the zone and the factors above.",
  ].join("\n");
}

/**
 * POST /api/analyze-risk
 * Accepts client location (address, city, postalCode) and returns a risk analysis.
 * Uses Gemini when GEMINI_API_KEY is set; otherwise returns a mock response.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AnalyzeRiskBody;
    const address = typeof body.address === "string" ? body.address.trim() : "";
    const city = typeof body.city === "string" ? body.city.trim() : "";
    const postalCode =
      typeof body.postalCode === "string" ? body.postalCode.trim() : "";

    console.log("[analyze-risk] Request body:", { address, city, postalCode });

    if (!address || !city) {
      console.log("[analyze-risk] Validation failed: address or city missing");
      return NextResponse.json(
        { error: "Address and city are required." },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    console.log(
      "[analyze-risk] GEMINI_API_KEY present:",
      !!apiKey,
      "(length:",
      apiKey?.length ?? 0,
      ")",
    );

    if (!apiKey) {
      console.log("[analyze-risk] No GEMINI_API_KEY, returning mock");
      const mockAnalysis = buildMockAnalysis(address, city, postalCode);
      return NextResponse.json({ analysis: mockAnalysis });
    }

    try {
      console.log(
        "[analyze-risk] Calling Gemini (model: gemini-3-flash-preview)...",
      );
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const locationLabel = [address, city, postalCode]
        .filter(Boolean)
        .join(", ");
      const userPrompt = `Provide a climate risk analysis for this location. Address: ${address}. City: ${city}.${postalCode ? ` Postal code: ${postalCode}.` : ""} Location: ${locationLabel}. Your response must start with "Climate risk (zone): X%" then briefly explain the main risk factors and a short recommendation.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
          },
        ],
        config: {
          systemInstruction: RISK_ANALYSIS_SYSTEM,
          maxOutputTokens: 1024,
        },
      });

      const text =
        (
          response as { response?: { text?: () => string } }
        )?.response?.text?.() ?? response?.text?.trim();
      const textTrimmed = typeof text === "string" ? text.trim() : "";
      console.log("[analyze-risk] Gemini response:", {
        hasResponse: !!response,
        hasText: !!textTrimmed,
        textLength: textTrimmed?.length ?? 0,
      });
      if (textTrimmed) {
        return NextResponse.json({ analysis: textTrimmed });
      }
      console.log(
        "[analyze-risk] Gemini returned no text, falling back to mock",
      );
    } catch (err) {
      const error = err as Error;
      console.error("[analyze-risk] Gemini error:", {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
      });
    }

    const mockAnalysis = buildMockAnalysis(address, city, postalCode);
    return NextResponse.json({ analysis: mockAnalysis });
  } catch (err) {
    const error = err as Error;
    console.error(
      "[analyze-risk] Request error:",
      error?.message,
      error?.stack,
    );
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }
}
