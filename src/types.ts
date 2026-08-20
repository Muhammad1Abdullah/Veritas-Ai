export type VerdictLabel = 'True' | 'False' | 'Misleading' | 'Unverified';

export interface ExtractedClaim {
  id: string;
  claim: string;
  context?: string;
  strippedBiases?: string[];
  entityFocus?: string[];
}

export interface ClaimExtractionStage {
  originalText: string;
  coreClaims: ExtractedClaim[];
  mainTheme: string;
  emotionalSensationalismScore: number; // 0-100
  sentimentSummary: string;
}

export interface SourceItem {
  id: string;
  title: string;
  url: string;
  domain: string;
  snippet: string;
  sourceType: 'news' | 'fact_checker' | 'official_gov_edu' | 'general_web' | 'unknown';
  stance: 'supports' | 'contradicts' | 'contextualizes' | 'neutral';
  reliabilityRating: 'High' | 'Moderate' | 'Low' | 'Requires Caution';
  publicationDate?: string;
}

export interface SourceRetrievalStage {
  sourcesFound: SourceItem[];
  searchQueries: string[];
  searchProvider: string;
  sourcesCount: number;
  hasFactCheckers: boolean;
}

export interface ClaimEvidenceAssessment {
  claimId: string;
  claimText: string;
  finding: string;
  status: 'supported' | 'contradicted' | 'partially_true' | 'unsubstantiated';
  keyEvidencePoints: string[];
}

export interface ReasoningStage {
  overallSynthesis: string;
  claimAssessments: ClaimEvidenceAssessment[];
  detectedFallacies: string[];
  contradictionHighlights: string[];
  consensusStrength: 'Strong Consensus' | 'Conflicting Reports' | 'No Direct Evidence' | 'Emerging Story';
}

export interface VerdictStage {
  verdict: VerdictLabel;
  confidenceScore: number; // 0-100
  briefExplanation: string; // 2-3 lines
  keyTakeaway: string;
  severityLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendationsForReader: string[];
  sources: SourceItem[];
}

export interface PipelineStageMetric {
  stageNumber: 1 | 2 | 3 | 4;
  stageName: string;
  durationMs: number;
  status: 'completed' | 'failed' | 'skipped';
  summary: string;
}

export interface VerificationResult {
  id: string;
  createdAt: string;
  rawInput: string;
  stage1ClaimExtraction: ClaimExtractionStage;
  stage2SourceRetrieval: SourceRetrievalStage;
  stage3Reasoning: ReasoningStage;
  stage4Verdict: VerdictStage;
  totalDurationMs: number;
  stageMetrics: PipelineStageMetric[];
}

export interface SampleClaim {
  id: string;
  title: string;
  category: 'Breaking News' | 'Health & Science' | 'Politics & Policy' | 'Viral Social Media' | 'Tech & AI';
  snippet: string;
  expectedVerdict: VerdictLabel;
}
