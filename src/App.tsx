import React, { useState, useEffect } from "react";
import { Header } from "./components/Header.js";
import { ClaimInputSection } from "./components/ClaimInputSection.js";
import { VerdictHeroCard } from "./components/VerdictHeroCard.js";
import { PipelineStageInspector } from "./components/PipelineStageInspector.js";
import { SourcesList } from "./components/SourcesList.js";
import { ArchitectureModal } from "./components/ArchitectureModal.js";
import { HistoryDrawer } from "./components/HistoryDrawer.js";
import { SampleClaim, VerificationResult } from "./types.js";
import { ShieldCheck, Sparkles, Layers, RefreshCw } from "lucide-react";

export default function App() {
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeStageStep, setActiveStageStep] = useState<number>(0);
  const [currentResult, setCurrentResult] = useState<VerificationResult | null>(null);
  const [history, setHistory] = useState<VerificationResult[]>([]);
  const [samples, setSamples] = useState<SampleClaim[]>([]);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage & fetch sample claims on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("veritas_verification_history");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.warn("Could not load history from localStorage", e);
    }

    // Fetch sample claims from backend
    fetch("/api/samples")
      .then((res) => res.json())
      .then((data) => {
        if (data.samples && Array.isArray(data.samples)) {
          setSamples(data.samples);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch samples from server, using defaults", err);
      });
  }, []);

  const handleVerify = async () => {
    if (!inputText.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);
    setActiveStageStep(1);

    // Simulate realistic step advancement for smooth UI feedback during async execution
    const timer1 = setTimeout(() => setActiveStageStep(2), 1200);
    const timer2 = setTimeout(() => setActiveStageStep(3), 3200);
    const timer3 = setTimeout(() => setActiveStageStep(4), 5200);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText.trim() }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const resultData: VerificationResult = await res.json();
      setCurrentResult(resultData);

      // Save to history
      setHistory((prev) => {
        const updated = [resultData, ...prev.filter((item) => item.id !== resultData.id)].slice(0, 30);
        try {
          localStorage.setItem("veritas_verification_history", JSON.stringify(updated));
        } catch (e) {
          console.warn("Failed to store history in localStorage", e);
        }
        return updated;
      });
    } catch (err: any) {
      setError(err.message || "Failed to verify claim. Please check your connection and try again.");
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsLoading(false);
      setActiveStageStep(0);
    }
  };

  const handleSelectSample = (sample: SampleClaim) => {
    setInputText(sample.snippet);
    setError(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("veritas_verification_history");
    } catch (e) {
      console.warn("Failed to clear localStorage history", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Header */}
      <Header
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Intro banner */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2.5 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Live Search Grounding & Fact Verification Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Fake News & Misinformation Detector
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Cross-reference breaking headlines, viral claims, or suspicious articles against verified sources, fact-checkers, and logical consistency models in 4 sequential pipeline stages.
          </p>
        </div>

        {/* Input & verification trigger */}
        <ClaimInputSection
          inputText={inputText}
          setInputText={setInputText}
          onVerify={handleVerify}
          isLoading={isLoading}
          activeStageStep={activeStageStep}
          samples={samples}
          onSelectSample={handleSelectSample}
          error={error}
        />

        {/* Results Section */}
        {currentResult && (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Stage 4 Final Verdict Hero */}
            <VerdictHeroCard
              verdictData={currentResult.stage4Verdict}
              totalDurationMs={currentResult.totalDurationMs}
              rawInput={currentResult.rawInput}
            />

            {/* Stage 1-4 Interactive Deep Dive */}
            <PipelineStageInspector result={currentResult} />

            {/* Detailed Grounded Sources List */}
            <SourcesList sources={currentResult.stage2SourceRetrieval.sourcesFound} />
          </div>
        )}

        {/* Welcome Empty State if no result yet */}
        {!currentResult && !isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">
              Ready for Verification
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4 leading-relaxed">
              Paste a news headline above or select one of the sample claims to observe each stage of the verification pipeline in action.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left max-w-3xl mx-auto text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-blue-700 block mb-1">1. Extraction</span>
                <span className="text-slate-600">Filters hyperbole and isolates core verifiable claims.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-indigo-700 block mb-1">2. Source Retrieval</span>
                <span className="text-slate-600">Searches authoritative reporting and fact-checkers.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-purple-700 block mb-1">3. AI Reasoning</span>
                <span className="text-slate-600">Evaluates alignment and catches logical fallacies.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-emerald-700 block mb-1">4. Final Verdict</span>
                <span className="text-slate-600">Outputs True/False/Misleading/Unverified with confidence.</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Architecture Explainer Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={(item) => setCurrentResult(item)}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
