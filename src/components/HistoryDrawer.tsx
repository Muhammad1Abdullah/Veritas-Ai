import React from "react";
import { X, Trash2, Clock, CheckCircle2, XCircle, AlertTriangle, HelpCircle, ArrowRight } from "lucide-react";
import { VerdictLabel, VerificationResult } from "../types.js";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: VerificationResult[];
  onSelectResult: (res: VerificationResult) => void;
  onClearHistory: () => void;
}

const VERDICT_BADGES: Record<
  VerdictLabel,
  { bg: string; text: string; icon: React.FC<{ className?: string }> }
> = {
  True: { bg: "bg-emerald-100 text-emerald-800", text: "True", icon: CheckCircle2 },
  False: { bg: "bg-rose-100 text-rose-800", text: "False", icon: XCircle },
  Misleading: { bg: "bg-amber-100 text-amber-800", text: "Misleading", icon: AlertTriangle },
  Unverified: { bg: "bg-slate-200 text-slate-800", text: "Unverified", icon: HelpCircle },
};

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-600" />
            <h3 className="font-semibold text-sm text-slate-900">Verification History</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 flex items-center gap-1 transition-colors"
                title="Clear all history"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No previous fact-checks recorded yet. Verify a claim to build your history log.
            </div>
          ) : (
            history.map((item) => {
              const badge = VERDICT_BADGES[item.stage4Verdict.verdict] || VERDICT_BADGES.Unverified;
              const Icon = badge.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectResult(item);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${badge.bg}`}
                    >
                      <Icon className="w-3 h-3" />
                      {item.stage4Verdict.verdict.toUpperCase()} ({item.stage4Verdict.confidenceScore}%)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    "{item.rawInput}"
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{item.stage2SourceRetrieval.sourcesCount} sources checked</span>
                    <span className="text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      View report <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
