import {
  PipelineStageMetric,
  VerificationResult,
} from "../../src/types.js";
import { executeStage1ClaimExtraction } from "./stage1ClaimExtraction.js";
import { executeStage2SourceRetrieval } from "./stage2SourceRetrieval.js";
import { executeStage3Reasoning } from "./stage3Reasoning.js";
import { executeStage4Verdict } from "./stage4Verdict.js";

/**
 * ============================================================================
 * PIPELINE ORCHESTRATOR
 * ============================================================================
 * ARCHITECTURAL SUMMARY:
 * Implements a sequential, modular multi-stage verification architecture.
 *
 * Pipeline Flow:
 * ┌────────────────────────────────────────────────────────┐
 * │ 1. Claim Extraction: NLP normalization & bias removal  │
 * └──────────────────────────┬─────────────────────────────┘
 *                            │
 * ┌──────────────────────────▼─────────────────────────────┐
 * │ 2. Source Cross-Check: Search Grounding & credibility  │
 * └──────────────────────────┬─────────────────────────────┘
 *                            │
 * ┌──────────────────────────▼─────────────────────────────┐
 * │ 3. AI Reasoning: Evidence cross-examination & fallacies│
 * └──────────────────────────┬─────────────────────────────┘
 *                            │
 * ┌──────────────────────────▼─────────────────────────────┐
 * │ 4. Verdict Generation: Calibrated score & explanation  │
 * └────────────────────────────────────────────────────────┘
 *
 * Key Strengths for System Design & Engineering Discussions:
 * - Decoupled stages: Any stage can be swapped (e.g. custom embedding DB, alternative LLM).
 * - Observability: Stage-by-stage execution latency metrics and transparency logs.
 * - Hallucination Prevention: If Stage 2 finds no reliable sources, Stage 4 enforces 'Unverified'.
 */
export async function runVerificationPipeline(rawInput: string): Promise<VerificationResult> {
  const pipelineStartTime = Date.now();
  const stageMetrics: PipelineStageMetric[] = [];
  const verificationId = `verif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // --------------------------------------------------------------------------
  // STAGE 1: Claim Extraction & Bias Neutralization
  // --------------------------------------------------------------------------
  const stage1Start = Date.now();
  const stage1 = await executeStage1ClaimExtraction(rawInput);
  const stage1Duration = Date.now() - stage1Start;
  stageMetrics.push({
    stageNumber: 1,
    stageName: "Claim Extraction & Bias De-noising",
    durationMs: stage1Duration,
    status: "completed",
    summary: `Extracted ${stage1.coreClaims.length} factual proposition(s). Sensationalism score: ${stage1.emotionalSensationalismScore}%`,
  });

  // --------------------------------------------------------------------------
  // STAGE 2: Live Source Retrieval & Credibility Cross-Check
  // --------------------------------------------------------------------------
  const stage2Start = Date.now();
  const stage2 = await executeStage2SourceRetrieval(stage1);
  const stage2Duration = Date.now() - stage2Start;
  stageMetrics.push({
    stageNumber: 2,
    stageName: "Source Retrieval & Grounding",
    durationMs: stage2Duration,
    status: "completed",
    summary: `Retrieved ${stage2.sourcesFound.length} grounding source(s). Fact-checkers present: ${stage2.hasFactCheckers ? "Yes" : "No"}`,
  });

  // --------------------------------------------------------------------------
  // STAGE 3: AI Evidence Reasoning & Logical Synthesis
  // --------------------------------------------------------------------------
  const stage3Start = Date.now();
  const stage3 = await executeStage3Reasoning(stage1, stage2);
  const stage3Duration = Date.now() - stage3Start;
  stageMetrics.push({
    stageNumber: 3,
    stageName: "AI Evidence Reasoning",
    durationMs: stage3Duration,
    status: "completed",
    summary: `Consensus: ${stage3.consensusStrength}. Fallacies identified: ${stage3.detectedFallacies.length}`,
  });

  // --------------------------------------------------------------------------
  // STAGE 4: Authoritative Verdict & Confidence Calibration
  // --------------------------------------------------------------------------
  const stage4Start = Date.now();
  const stage4 = await executeStage4Verdict(stage1, stage2, stage3);
  const stage4Duration = Date.now() - stage4Start;
  stageMetrics.push({
    stageNumber: 4,
    stageName: "Verdict Generation & Calibration",
    durationMs: stage4Duration,
    status: "completed",
    summary: `Verdict: ${stage4.verdict} (${stage4.confidenceScore}% confidence)`,
  });

  const totalDurationMs = Date.now() - pipelineStartTime;

  return {
    id: verificationId,
    createdAt: new Date().toISOString(),
    rawInput,
    stage1ClaimExtraction: stage1,
    stage2SourceRetrieval: stage2,
    stage3Reasoning: stage3,
    stage4Verdict: stage4,
    totalDurationMs,
    stageMetrics,
  };
}
