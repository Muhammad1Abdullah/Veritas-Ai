import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Share2,
  Check,
  Percent,
  Clock,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { VerdictLabel, VerdictStage } from "../types.js";

interface VerdictHeroCardProps {
  verdictData: VerdictStage;
  totalDurationMs: number;
  rawInput: string;
}

const VERDICT_CONFIG: Record<
  VerdictLabel,
  {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    barColor: string;
    icon: React.FC<{ className?: string }>;
    tagline: string;
  }
> = {
  True: {
    bg: "bg-emerald-50/70",
    border: "border-emerald-200",
    text: "text-emerald-950",
    badgeBg: "bg-emerald-600",
    badgeText: "text-white",
    barColor: "bg-emerald-500",
    icon: CheckCircle2,
    tagline: "Supported by credible reporting & authoritative verification.",
  },
  False: {
    bg: "bg-rose-50/70",
    border: "border-rose-200",
    text: "text-rose-950",
    badgeBg: "bg-rose-600",
    badgeText: "text-white",
    barColor: "bg-rose-500",
    icon: XCircle,
    tagline: "Debunked or contradicted by empirical evidence & fact-checkers.",
  },
  Misleading: {
    bg: "bg-amber-50/70",
    border: "border-amber-200",
    text: "text-amber-950",
    badgeBg: "bg-amber-500",
    badgeText: "text-white",
    barColor: "bg-amber-500",
    icon: AlertTriangle,
    tagline: "Contains partial truths distorted by deceptive framing or cherry-picking.",
  },
  Unverified: {
    bg: "bg-slate-50/80",
    border: "border-slate-300",
    text: "text-slate-900",
    badgeBg: "bg-slate-700",
    badgeText: "text-white",
    barColor: "bg-slate-500",
    icon: HelpCircle,
    tagline: "Insufficient corroborating evidence found from reliable outlets.",
  },
};

export const VerdictHeroCard: React.FC<VerdictHeroCardProps> = ({
  verdictData,
  totalDurationMs,
  rawInput,
}) => {
  const [copied, setCopied] = useState(false);
  const cfg = VERDICT_CONFIG[verdictData.verdict] || VERDICT_CONFIG.Unverified;
  const IconComponent = cfg.icon;

  const handleCopyReport = () => {
    const reportText = `[Veritas Fact-Check Verdict: ${verdictData.verdict.toUpperCase()} (${verdictData.confidenceScore}% Confidence)]
Claim: "${rawInput}"
Reasoning: ${verdictData.briefExplanation}
Sources Checked: ${verdictData.sources.length} sources (e.g. ${verdictData.sources.map((s) => s.domain).slice(0, 3).join(", ")})
Verified via Veritas AI Misinformation Detector`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="verdict-hero-card"
      className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-6 sm:p-7 shadow-xs mb-8 transition-all`}
    >
      {/* Top row: Verdict badge & Confidence */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-black/5">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl ${cfg.badgeBg} ${cfg.badgeText} flex items-center justify-center shadow-xs shrink-0`}
          >
            <IconComponent className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span
                className={`text-2xl font-bold tracking-tight ${cfg.text}`}
              >
                VERDICT: {verdictData.verdict.toUpperCase()}
              </span>
              <span className="text-xs uppercase font-semibold px-2.5 py-0.5 rounded-md bg-white/80 border border-black/10 text-slate-700">
                {verdictData.severityLevel} Risk
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">{cfg.tagline}</p>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="bg-white rounded-xl border border-black/10 p-3 min-w-[210px] shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span className="flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-blue-600" />
              Confidence Score
            </span>
            <span className="text-sm font-bold text-slate-900">
              {verdictData.confidenceScore}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${cfg.barColor} rounded-full transition-all duration-700`}
              style={{ width: `${verdictData.confidenceScore}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Main explanation body */}
      <div className="py-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          Executive Reasoning Summary
        </h3>
        <p className="text-base text-slate-900 leading-relaxed font-normal">
          {verdictData.briefExplanation}
        </p>

        {verdictData.keyTakeaway && (
          <div className="mt-4 p-3.5 bg-white/80 rounded-xl border border-black/5 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-800">
              <strong className="font-semibold text-slate-900">Key Takeaway: </strong>
              {verdictData.keyTakeaway}
            </div>
          </div>
        )}
      </div>

      {/* Reader Recommendations & Action buttons */}
      <div className="pt-4 border-t border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Verified in {(totalDurationMs / 1000).toFixed(2)}s
          </span>
          <span>•</span>
          <span>{verdictData.sources.length} sources analyzed</span>
        </div>

        <button
          id="btn-copy-factcheck-report"
          onClick={handleCopyReport}
          className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied Fact-Check!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Copy Shareable Verdict</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
