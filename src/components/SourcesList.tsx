import React, { useState } from "react";
import { Globe, ExternalLink, ShieldCheck, Filter, AlertTriangle } from "lucide-react";
import { SourceItem } from "../types.js";

interface SourcesListProps {
  sources: SourceItem[];
}

export const SourcesList: React.FC<SourcesListProps> = ({ sources }) => {
  const [filterStance, setFilterStance] = useState<string>("all");

  const filteredSources = sources.filter((s) => {
    if (filterStance === "all") return true;
    return s.stance === filterStance;
  });

  if (sources.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-500 mb-8">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <h3 className="font-semibold text-slate-800 text-sm">No Primary Sources Identified</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          No reputable journalistic or fact-checking websites were found reporting on this claim, which is typical for unsubstantiated rumors or newly emerging hoaxes.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            Verified Grounding Sources ({sources.length})
          </h3>
          <p className="text-xs text-slate-500">
            Real-world reporting, articles, and fact-checks cross-referenced during verification.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {["all", "supports", "contradicts", "contextualizes"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStance(st)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors font-medium cursor-pointer ${
                filterStance === st
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredSources.map((source) => (
          <div
            key={source.id}
            className="rounded-xl border border-slate-200 p-4 bg-slate-50/40 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                  {source.domain}
                </span>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      source.sourceType === "fact_checker"
                        ? "bg-purple-100 text-purple-700"
                        : source.sourceType === "official_gov_edu"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {source.sourceType === "fact_checker"
                      ? "FACT-CHECKER"
                      : source.sourceType.replace(/_/g, " ").toUpperCase()}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      source.stance === "contradicts"
                        ? "bg-rose-100 text-rose-700"
                        : source.stance === "supports"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {source.stance.toUpperCase()}
                  </span>
                </div>
              </div>

              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-sm text-slate-900 hover:text-blue-600 transition-colors line-clamp-2"
              >
                {source.title}
              </a>

              <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                {source.snippet}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                Credibility: <strong className="text-slate-600">{source.reliabilityRating}</strong>
              </span>

              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-xs"
              >
                <span>View Article</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
