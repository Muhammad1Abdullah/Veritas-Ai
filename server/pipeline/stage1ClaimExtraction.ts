import { Type } from "@google/genai";
import { getGeminiClient } from "../geminiClient.js";
import { ClaimExtractionStage } from "../../src/types.js";

/**
 * ============================================================================
 * STAGE 1: CLAIM EXTRACTION & BIAS DE-NOISING
 * ============================================================================
 * ARCHITECTURAL PURPOSE:
 * Raw user input often contains hyperbole, sensationalism, rhetorical questions,
 * or emotionally charged framing. To fact-check objectively, we isolate the
 * testable, falsifiable factual claims from sentiment/opinion.
 *
 * PIPELINE WORKFLOW:
 * 1. Parse raw text for discrete factual propositions (who, what, where, when).
 * 2. Strip out emotional modifiers (e.g. "SHOCKING!", "disaster", "they don't want you to know").
 * 3. Quantify emotional sensationalism index (0-100%).
 * 4. Return normalized claims ready for automated search retrieval.
 */
export async function executeStage1ClaimExtraction(rawText: string): Promise<ClaimExtractionStage> {
  const ai = getGeminiClient();

  const prompt = `You are Stage 1 of an automated Fact-Checking & Misinformation Detection Pipeline.
Your task is to analyze the following user-provided news headline, article excerpt, or social claim:

"""${rawText}"""

Perform the following:
1. Extract 1 to 4 distinct, atomic factual assertions that can be independently verified.
2. Strip out emotional language, loaded adjectives, clickbait expressions, or subjective opinion from the core claim.
3. Identify what emotional words or biases were stripped.
4. Calculate an "emotionalSensationalismScore" from 0 to 100 representing how clickbait/sensational the raw text is.
5. Provide the main theme and a short sentiment summary.

Respond in structured JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mainTheme: {
              type: Type.STRING,
              description: "Main topic or subject matter of the input text.",
            },
            emotionalSensationalismScore: {
              type: Type.NUMBER,
              description: "Sensationalism score from 0 (completely neutral) to 100 (extreme clickbait).",
            },
            sentimentSummary: {
              type: Type.STRING,
              description: "Brief description of the tone and sentiment of the raw text.",
            },
            coreClaims: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  claim: {
                    type: Type.STRING,
                    description: "The stripped, neutral, testable factual assertion.",
                  },
                  context: {
                    type: Type.STRING,
                    description: "Contextual detail (e.g. timeframe, location, key figures involved).",
                  },
                  strippedBiases: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Emotional, misleading, or loaded words removed from the claim.",
                  },
                  entityFocus: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Primary entities, organizations, or people referenced.",
                  },
                },
                required: ["id", "claim"],
              },
            },
          },
          required: ["mainTheme", "emotionalSensationalismScore", "sentimentSummary", "coreClaims"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");

    return {
      originalText: rawText,
      mainTheme: parsed.mainTheme || "General News",
      emotionalSensationalismScore: typeof parsed.emotionalSensationalismScore === "number" ? parsed.emotionalSensationalismScore : 30,
      sentimentSummary: parsed.sentimentSummary || "Analyzed text content.",
      coreClaims: (parsed.coreClaims && parsed.coreClaims.length > 0)
        ? parsed.coreClaims.map((c: any, index: number) => ({
            id: c.id || `claim-${index + 1}`,
            claim: c.claim || rawText,
            context: c.context || "",
            strippedBiases: c.strippedBiases || [],
            entityFocus: c.entityFocus || [],
          }))
        : [
            {
              id: "claim-1",
              claim: rawText.trim(),
              context: "Direct assertion from input",
              strippedBiases: [],
              entityFocus: [],
            },
          ],
    };
  } catch (error: any) {
    console.error("Stage 1 Error:", error);
    // Graceful fallback if model parsing fails
    return {
      originalText: rawText,
      mainTheme: "Extracted Claim",
      emotionalSensationalismScore: 50,
      sentimentSummary: "Direct text extraction fallback",
      coreClaims: [
        {
          id: "claim-1",
          claim: rawText.trim(),
          context: "Direct input",
          strippedBiases: [],
          entityFocus: [],
        },
      ],
    };
  }
}
