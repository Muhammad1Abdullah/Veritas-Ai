import React from "react";
import { ShieldCheck, Cpu, Sparkles, BookOpen } from "lucide-react";

interface HeaderProps {
  onOpenArchitecture: () => void;
  historyCount: number;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenArchitecture,
  historyCount,
  onOpenHistory,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-slate-900 text-lg leading-none">
                Veritas AI
              </h1>
              <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Misinformation Detector
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              4-Stage Evidence Grounding & Fact Verification Engine
            </p>
          </div>
        </div>

        {/* Right: Actions / Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="btn-open-architecture"
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="View Pipeline Architecture Diagram"
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Pipeline Architecture</span>
            <span className="sm:hidden">Architecture</span>
          </button>

          <button
            id="btn-open-history"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-semibold">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
