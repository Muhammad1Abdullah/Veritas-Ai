import React, { useState } from "react";
import {
  FileText,
  Globe,
  BrainCircuit,
  Award,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  Search,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { VerificationResult } from "../types.js";

interface PipelineStageInspectorProps {
  result: VerificationResult;
}

export const PipelineStageInspector: React.FC<PipelineStageInspectorProps> = ({
  result,
}) => {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4>(1);

  const {
    stage1ClaimExtraction,
    stage2SourceRetrieval,
    stage3Reasoning,
    stage4Verdict,
    stageMetrics,
  } = result;

  const getStageMetric = (stageNum: number) =>
    stageMetrics.find((m) => m.stageNumber === stageNum);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-8">
      {/* Header & Tab navigation */}
      <div className="border-b border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-600" />
              Multi-Stage AI Pipeline Deep Dive
            </h2>
            <p className="text-xs text-slate-500">
              Inspect raw data, extraction metrics, and reasoning chain at each stage of the verification process.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
              Total Latency: {result.totalDurationMs}ms
            </span>
          </div>
        </div>

        {/* Stage Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Tab 1 */}
          <button
            id="tab-stage-1"
            onClick={() => setActiveTab(1)}
            className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
              activeTab === 1
                ? "bg-white border-blue-500 shadow-xs ring-1 ring-blue-500"
                : "bg-white/60 border-slate-200 hover:bg-white text-slate-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Stage 1
              </span>
              <span className="text-[10px] text-slate-400">
                {getStageMetric(1)?.durationMs || 0}ms
              </span>
            </div>
            <div className="font-semibold text-xs text-slate-800 mt-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">Claim Extraction</span>
            </div>
          </button>

          {/* Tab 2 */}
          <button
            id="tab-stage-2"
            onClick={() => setActiveTab(2)}
            className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
              activeTab === 2
                ? "bg-white border-blue-500 shadow-xs ring-1 ring-blue-500"
                : "bg-white/60 border-slate-200 hover:bg-white text-slate-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Stage 2
              </span>
              <span className="text-[10px] text-slate-400">
                {getStageMetric(2)?.durationMs || 0}ms
              </span>
            </div>
            <div className="font-semibold text-xs text-slate-800 mt-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">Source Cross-Check</span>
            </div>
          </button>

          {/* Tab 3 */}
          <button
            id="tab-stage-3"
            onClick={() => setActiveTab(3)}
            className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
              activeTab === 3
                ? "bg-white border-blue-500 shadow-xs ring-1 ring-blue-500"
                : "bg-white/60 border-slate-200 hover:bg-white text-slate-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Stage 3
              </span>
              <span className="text-[10px] text-slate-400">
                {getStageMetric(3)?.durationMs || 0}ms
              </span>
            </div>
            <div className="font-semibold text-xs text-slate-800 mt-1 flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className="truncate">AI Reasoning</span>
            </div>
          </button>

          {/* Tab 4 */}
          <button
            id="tab-stage-4"
            onClick={() => setActiveTab(4)}
            className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
              activeTab === 4
                ? "bg-white border-blue-500 shadow-xs ring-1 ring-blue-500"
                : "bg-white/60 border-slate-200 hover:bg-white text-slate-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Stage 4
              </span>
              <span className="text-[10px] text-slate-400">
                {getStageMetric(4)?.durationMs || 0}ms
              </span>
            </div>
            <div className="font-semibold text-xs text-slate-800 mt-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Verdict Output</span>
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="p-5 sm:p-6">
        {/* ================= STAGE 1 TAB ================= */}
        {activeTab === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Main Topic / Domain
                </span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {stage1ClaimExtraction.mainTheme}
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {stage1ClaimExtraction.sentimentSummary}
                </p>
              </div>

              {/* Sensationalism Score */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 min-w-[170px] shadow-2xs">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                  <span>Sensationalism Index</span>
                  <span className="text-sm font-bold text-slate-900">
                    {stage1ClaimExtraction.emotionalSensationalismScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      stage1ClaimExtraction.emotionalSensationalismScore > 60
                        ? "bg-rose-500"
                        : stage1ClaimExtraction.emotionalSensationalismScore > 30
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${stage1ClaimExtraction.emotionalSensationalismScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Extracted discrete propositions */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Extracted Atomic Factual Propositions ({stage1ClaimExtraction.coreClaims.length})
              </h3>
              <div className="space-y-3">
                {stage1ClaimExtraction.coreClaims.map((claim, idx) => (
                  <div
                    key={claim.id || idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-bold shrink-0 mt-0.5">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            "{claim.claim}"
                          </div>
                          {claim.context && (
                            <div className="text-xs text-slate-500 mt-1">
                              <strong>Context:</strong> {claim.context}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stripped Biases & Entities */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                      {claim.strippedBiases && claim.strippedBiases.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-slate-400 font-medium">Stripped Hyperbole:</span>
                          {claim.strippedBiases.map((bias, bIdx) => (
                            <span
                              key={bIdx}
                              className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px]"
                            >
                              <s>{bias}</s>
                            </span>
                          ))}
                        </div>
                      )}

                      {claim.entityFocus && claim.entityFocus.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap ml-auto">
                          <span className="text-slate-400 font-medium">Entities:</span>
                          {claim.entityFocus.map((ent, eIdx) => (
                            <span
                              key={eIdx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]"
                            >
                              {ent}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= STAGE 2 TAB ================= */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Grounding Search Provider
                </span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {stage2SourceRetrieval.searchProvider}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Queries Used: {stage2SourceRetrieval.searchQueries.join(" • ")}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    stage2SourceRetrieval.hasFactCheckers
                      ? "bg-purple-100 text-purple-800 border border-purple-200"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  {stage2SourceRetrieval.hasFactCheckers
                    ? "✓ Fact-Checkers Included"
                    : "General Media Sources"}
                </span>
              </div>
            </div>

            {/* Sources List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Retrieved & Evaluated Sources ({stage2SourceRetrieval.sourcesFound.length})
                </h3>
              </div>

              {stage2SourceRetrieval.sourcesFound.length === 0 ? (
                <div className="p-6 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 text-sm">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-medium text-slate-700">No matching web sources found</p>
                  <p className="text-xs mt-1">
                    The pipeline detected zero corroborating reports, triggering the safe "Unverified" fallback.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {stage2SourceRetrieval.sourcesFound.map((src, idx) => (
                    <div
                      key={src.id || idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all flex flex-col justify-between shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            {src.domain}
                          </span>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              src.sourceType === "fact_checker"
                                ? "bg-purple-100 text-purple-700"
                                : src.sourceType === "official_gov_edu"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {src.sourceType.replace(/_/g, " ").toUpperCase()}
                          </span>
                        </div>

                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-sm text-slate-900 hover:text-blue-600 transition-colors line-clamp-2"
                        >
                          {src.title}
                        </a>

                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                          {src.snippet}
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span
                          className={`font-medium px-2 py-0.5 rounded text-[11px] ${
                            src.stance === "contradicts"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : src.stance === "supports"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          Stance: {src.stance}
                        </span>

                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                        >
                          Read Source <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= STAGE 3 TAB ================= */}
        {activeTab === 3 && (
          <div className="space-y-6">
            {/* Overall Synthesis */}
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                  AI Cross-Examination & Synthesis
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-200/80 text-purple-900 text-xs font-semibold">
                  {stage3Reasoning.consensusStrength}
                </span>
              </div>
              <p className="text-sm text-purple-950 leading-relaxed">
                {stage3Reasoning.overallSynthesis}
              </p>
            </div>

            {/* Fallacies & Contradictions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fallacies */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Logical Fallacies / Manipulation Detected
                </h4>
                {stage3Reasoning.detectedFallacies.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No overt logical fallacies detected in text phrasing.</p>
                ) : (
                  <ul className="space-y-2">
                    {stage3Reasoning.detectedFallacies.map((fal, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-800 flex items-start gap-2 bg-amber-50/60 p-2 rounded-lg border border-amber-200/60"
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{fal}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Contradictions */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Factual Contradictions Identified
                </h4>
                {stage3Reasoning.contradictionHighlights.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No direct contradictions with empirical reporting.</p>
                ) : (
                  <ul className="space-y-2">
                    {stage3Reasoning.contradictionHighlights.map((con, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-800 flex items-start gap-2 bg-rose-50/60 p-2 rounded-lg border border-rose-200/60"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Claim-by-Claim Evaluation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Proposition-by-Proposition Breakdown
              </h4>
              <div className="space-y-3">
                {stage3Reasoning.claimAssessments.map((ca, idx) => (
                  <div
                    key={ca.claimId || idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-900">
                        {ca.claimText}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          ca.status === "supported"
                            ? "bg-emerald-100 text-emerald-800"
                            : ca.status === "contradicted"
                            ? "bg-rose-100 text-rose-800"
                            : ca.status === "partially_true"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-200 text-slate-800"
                        }`}
                      >
                        {ca.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 mb-2 leading-relaxed">
                      {ca.finding}
                    </p>

                    {ca.keyEvidencePoints && ca.keyEvidencePoints.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-600 space-y-1">
                        {ca.keyEvidencePoints.map((ep, epIdx) => (
                          <div key={epIdx} className="flex items-start gap-1.5">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>{ep}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= STAGE 4 TAB ================= */}
        {activeTab === 4 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Stage 4 Calibration Result
                  </span>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    Verdict: {stage4Verdict.verdict} (Confidence: {stage4Verdict.confidenceScore}%)
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  Severity: <span className="font-semibold capitalize text-slate-800">{stage4Verdict.severityLevel}</span>
                </div>
              </div>
            </div>

            {/* Media Literacy Recommendations */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Actionable Guidelines for Readers
              </h4>
              <div className="space-y-2">
                {stage4Verdict.recommendationsForReader.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs text-slate-800"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pipeline Stage Latency Breakdown */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Pipeline Stage Performance Metrics
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-semibold">
                    <tr>
                      <th className="p-2.5 border-b border-slate-200">Stage</th>
                      <th className="p-2.5 border-b border-slate-200">Pipeline Module</th>
                      <th className="p-2.5 border-b border-slate-200">Latency</th>
                      <th className="p-2.5 border-b border-slate-200">Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {stageMetrics.map((m) => (
                      <tr key={m.stageNumber}>
                        <td className="p-2.5 font-bold text-slate-900">Stage {m.stageNumber}</td>
                        <td className="p-2.5 font-medium text-slate-800">{m.stageName}</td>
                        <td className="p-2.5 text-slate-600 font-mono">{m.durationMs}ms</td>
                        <td className="p-2.5 text-slate-600">{m.summary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
