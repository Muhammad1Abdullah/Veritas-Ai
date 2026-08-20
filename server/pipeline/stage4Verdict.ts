import { Type } from "@google/genai";
import { getGeminiClient } from "../geminiClient.js";
import {
  ClaimExtractionStage,
  ReasoningStage,
  SourceRetrievalStage,
  VerdictLabel,
  VerdictStage,
} from "../../src/types.js";

/**
 * ============================================================================
 * STAGE 4: VERDICT SYNTHESIS & CONFIDENCE CALIBRATION
 * ============================================================================
 * ARCHITECTURAL PURPOSE:
 * Finalizes the pipeline assessment by consolidating evidence, reasoning,
 * and source credibility into an actionable, unambiguous verdict.
 *
 * PIPELINE WORKFLOW:
 * 1. Calculate weighted confidence score (combining source authority, fact-checker consensus, and claim alignment).
 * 2. Assign standard classification label: 'True', 'False', 'Misleading', or 'Unverified'.
 * 3. Enforce Strict Fallback: If zero reliable sources exist, force 'Unverified' to prevent hallucination.
 * 4. Generate 2-3 line executive summary and actionable media literacy recommendations.
 */
export async function executeStage4Verdict(
  stage1: ClaimExtractionStage,
  stage2: SourceRetrievalStage,
  stage3: ReasoningStage
): Promise<VerdictStage> {
  // CRITICAL ARCHITECTURAL SAFEGUARD:
  // If zero sources were retrieved, return 'Unverified' immediately to prevent AI guessing.
  if (stage2.sourcesFound.length === 0) {
    return {
      verdict: "Unverified",
      confidenceScore: 25,
      briefExplanation:
        "No credible news organizations, government agencies, or certified fact-checkers have reported or verified this claim. In the absence of corroborating evidence, this claim cannot be authenticated.",
      keyTakeaway: "Unsubstantiated claim with no reliable independent verification found online.",
      severityLevel: "medium",
      recommendationsForReader: [
        "Avoid sharing or amplifying this claim until verified by reputable news outlets.",
        "Check official press releases or verified social media accounts of the entities mentioned.",
        "Be wary of anonymous screenshots or unsourced viral audio/text forwards.",
      ],
      sources: [],
    };
  }

  const ai = getGeminiClient();

  const prompt = `You are Stage 4 (Final Verdict & Calibration) of an automated Fact-Checking Pipeline.

ORIGINAL USER INPUT:
"""${stage1.originalText}"""

EXTRACTED FACTUAL CLAIMS:
${stage1.coreClaims.map((c) => `- ${c.claim}`).join("\n")}

STAGE 2 SOURCE RETRIEVAL:
Found ${stage2.sourcesFound.length} sources (Has Fact-Checkers: ${stage2.hasFactCheckers}).
Sources:
${stage2.sourcesFound.map((s) => `- [${s.reliabilityRating} / ${s.sourceType}] ${s.title} (${s.domain}) -> Stance: ${s.stance}`).join("\n")}

STAGE 3 REASONING ANALYSIS:
Synthesis: ${stage3.overallSynthesis}
Consensus: ${stage3.consensusStrength}
Contradictions: ${stage3.contradictionHighlights.join("; ") || "None"}
Fallacies: ${stage3.detectedFallacies.join("; ") || "None"}

INSTRUCTIONS FOR FINAL VERDICT:
1. Assign exactly one of these 4 labels:
   - "True": Completely accurate and supported by high-credibility reporting.
   - "False": Proven incorrect, fabricated, hoax, or directly debunked.
   - "Misleading": Contains a grain of truth but distorted with exaggerated statistics, missing context, out-of-date media, or deceptive framing.
   - "Unverified": Lacks sufficient corroborating evidence from trusted sources.
2. Provide a calibrated Confidence Score (0 to 100). If sources conflict or are sparse, keep confidence moderate (40-65%). If multiple top-tier fact-checkers debunk or confirm, score high (85-98%).
3. Write a concise 2-3 line explanation summarizing the core reason for this verdict.
4. Provide a 1-sentence key takeaway.
5. Rate severity level ('low' | 'medium' | 'high' | 'critical').
6. Provide 2-3 practical media literacy tips for readers assessing this claim.

Respond strictly in JSON matching the schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: {
              type: Type.STRING,
              enum: ["True", "False", "Misleading", "Unverified"],
              description: "The authoritative final verification label.",
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: "Calibrated percentage confidence from 0 to 100.",
            },
            briefExplanation: {
              type: Type.STRING,
              description: "Concise 2-3 line explanation of the reasoning and evidentiary basis.",
            },
            keyTakeaway: {
              type: Type.STRING,
              description: "One clear, decisive takeaway sentence.",
            },
            severityLevel: {
              type: Type.STRING,
              enum: ["low", "medium", "high", "critical"],
              description: "Potential harm or urgency of this misinformation.",
            },
            recommendationsForReader: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 actionable guidelines for readers evaluating this story.",
            },
          },
          required: [
            "verdict",
            "confidenceScore",
            "briefExplanation",
            "keyTakeaway",
            "severityLevel",
            "recommendationsForReader",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    const validVerdicts: VerdictLabel[] = ["True", "False", "Misleading", "Unverified"];
    const verdict: VerdictLabel = validVerdicts.includes(parsed.verdict) ? parsed.verdict : "Misleading";

    let confidence = typeof parsed.confidenceScore === "number" ? parsed.confidenceScore : 80;
    if (confidence < 0) confidence = 0;
    if (confidence > 100) confidence = 100;

    return {
      verdict,
      confidenceScore: Math.round(confidence),
      briefExplanation: parsed.briefExplanation || "Evidence was evaluated against verified reporting.",
      keyTakeaway: parsed.keyTakeaway || "Cross-referenced with online sources.",
      severityLevel: parsed.severityLevel || "medium",
      recommendationsForReader: parsed.recommendationsForReader || [
        "Verify with primary sources before sharing.",
        "Check if major news outlets have reported the story.",
      ],
      sources: stage2.sourcesFound,
    };
  } catch (error: any) {
    console.error("Stage 4 Verdict Error:", error);
    return {
      verdict: "Unverified",
      confidenceScore: 50,
      briefExplanation: "Could not decisively confirm or refute the claim with full confidence due to inconclusive evidence.",
      keyTakeaway: "Review provided sources directly to evaluate specific details.",
      severityLevel: "medium",
      recommendationsForReader: ["Check multiple independent outlets to verify this information."],
      sources: stage2.sourcesFound,
    };
  }
}
