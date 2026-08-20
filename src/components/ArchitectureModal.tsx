import React from "react";
import { X, Cpu, CheckCircle2, ArrowDown, Database, Search, Brain, Award, ShieldAlert } from "lucide-react";

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">
                Multi-Stage Verification Architecture Blueprint
              </h3>
              <p className="text-xs text-slate-500">
                System design overview for portfolio presentation & technical interviews
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Architecture Flow Diagram */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              End-to-End Pipeline Execution Flow
            </h4>

            {/* Stage 1 */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-1">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                <span>Stage 1: Claim Extraction & Bias De-noising</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Input:</strong> Raw unformatted headline, tweet, or article excerpt.<br/>
                <strong>Transformation:</strong> Uses Gemini with structured schema output to extract discrete, testable factual propositions while stripping emotive buzzwords, hyperbole, and clickbait bias. Computes an emotional sensationalism index (0–100%).
              </p>
            </div>

            <div className="flex justify-center text-slate-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            {/* Stage 2 */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm mb-1">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                <span>Stage 2: Live Grounding & Credibility Cross-Check</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Mechanism:</strong> Invokes Google Search Grounding with Gemini 3.7 Flash.<br/>
                <strong>Source Tiering:</strong> Classifies domain trustworthiness (IFCN Fact-Checkers, Official .gov/.edu, Top-tier Journalism, General Web) and extracts verifiable source URLs, snippets, and initial stance.
              </p>
            </div>

            <div className="flex justify-center text-slate-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            {/* Stage 3 */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm mb-1">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                <span>Stage 3: AI Evidence Cross-Examination & Fallacy Analysis</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Synthesis:</strong> Cross-examines extracted claims directly against retrieved sources.<br/>
                <strong>Heuristics:</strong> Identifies logical fallacies (cherry-picking, false causality), highlights direct factual contradictions, and determines consensus strength (Strong Consensus vs Conflicting vs Unsubstantiated).
              </p>
            </div>

            <div className="flex justify-center text-slate-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            {/* Stage 4 */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">4</span>
                <span>Stage 4: Verdict Synthesis & Confidence Calibration</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Final Labels:</strong> True / False / Misleading / Unverified.<br/>
                <strong>Strict Fallback Safeguard:</strong> If zero corroborating sources exist in Stage 2, the pipeline guarantees an 'Unverified' label rather than hallucinating. Produces a 2-3 line executive summary and reader recommendations.
              </p>
            </div>
          </div>

          {/* Key Portfolio Highlights */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Key Engineering Talking Points for Interviews
            </h4>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
              <li><strong>Modular Separation of Concerns:</strong> Each stage is an independent module with typed interfaces, enabling plug-and-play swapping of retrieval providers or LLM models.</li>
              <li><strong>Hallucination Defense:</strong> Grounded in live web citations; automatically defaults to "Unverified" when evidence is lacking.</li>
              <li><strong>Observability:</strong> Latency metrics are recorded per stage for performance profiling and bottleneck monitoring.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
