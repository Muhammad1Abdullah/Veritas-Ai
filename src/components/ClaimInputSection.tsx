import React from "react";
import { Search, Sparkles, X, ArrowRight, Loader2 } from "lucide-react";
import { SampleClaim } from "../types.js";

interface ClaimInputSectionProps {
  inputText: string;
  setInputText: (val: string) => void;
  onVerify: () => void;
  isLoading: boolean;
  activeStageStep: number; // 0 (idle) or 1..4
  samples: SampleClaim[];
  onSelectSample: (sample: SampleClaim) => void;
  error: string | null;
}

const STAGE_LABELS: Record<number, string> = {
  1: "Stage 1: Extracting core factual claims & stripping bias...",
  2: "Stage 2: Cross-referencing credible news & fact-check sources...",
  3: "Stage 3: Synthesizing evidence & evaluating logical consistency...",
  4: "Stage 4: Calibrating confidence & generating final verdict...",
};

export const ClaimInputSection: React.FC<ClaimInputSectionProps> = ({
  inputText,
  setInputText,
  onVerify,
  isLoading,
  activeStageStep,
  samples,
  onSelectSample,
  error,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      if (!isLoading && inputText.trim().length > 0) {
        onVerify();
      }
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 mb-8">
      {/* Title & guidance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            Verify News Headline, Claim, or Article
          </h2>
          <p className="text-xs text-slate-500">
            Paste any text to run through the 4-stage verification pipeline with live web grounding.
          </p>
        </div>

        {inputText.length > 0 && !isLoading && (
          <button
            onClick={() => setInputText("")}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 self-end sm:self-center"
          >
            <X className="w-3.5 h-3.5" /> Clear text
          </button>
        )}
      </div>

      {/* Text Area */}
      <div className="relative">
        <textarea
          id="claim-input-textarea"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={4}
          placeholder="e.g. 'Drinking boiled garlic water cures coronavirus in 12 hours' or paste a breaking news tweet / headline..."
          className="w-full rounded-xl border border-slate-300 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y transition-all disabled:bg-slate-50 disabled:text-slate-500 leading-relaxed font-sans"
        />

        <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
          <span>Press Ctrl+Enter (Cmd+Enter) to verify</span>
          <span>{inputText.length} / 5,000 chars</span>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between">
          <span>{error}</span>
        </div>
      )}

      {/* Loading pipeline animation */}
      {isLoading && (
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-blue-900">
                {STAGE_LABELS[activeStageStep] || "Processing verification pipeline..."}
              </div>
              <div className="w-full bg-blue-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${(activeStageStep / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Sample claims pills */}
        <div className="flex-1 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
            <span className="font-medium text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Try sample:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {samples.slice(0, 4).map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample)}
                  disabled={isLoading}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors truncate max-w-[200px]"
                  title={sample.snippet}
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Primary verify button */}
        <button
          id="btn-verify-claim"
          onClick={onVerify}
          disabled={isLoading || inputText.trim().length === 0}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Evidence...</span>
            </>
          ) : (
            <>
              <span>Verify Claim</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </section>
  );
};
