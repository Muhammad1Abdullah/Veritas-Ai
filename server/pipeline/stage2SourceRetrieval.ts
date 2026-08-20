import { getGeminiClient } from "../geminiClient.js";
import { ClaimExtractionStage, SourceItem, SourceRetrievalStage } from "../../src/types.js";

/**
 * ============================================================================
 * STAGE 2: SOURCE RETRIEVAL & CREDIBILITY CROSS-CHECK
 * ============================================================================
 * ARCHITECTURAL PURPOSE:
 * Cross-references extracted factual propositions with real-world, verified
 * live web sources, authoritative journalism outlets, government/academic reports,
 * and certified fact-checking databases (IFCN signatories).
 *
 * PIPELINE WORKFLOW:
 * 1. Formulate targeted search queries from extracted claims (including fact-check keywords).
 * 2. Execute live search grounding via Gemini Search Tooling.
 * 3. Parse grounding chunks, titles, URIs, and contextual source snippets.
 * 4. Categorize domain trustworthiness and detect stance (supports / contradicts / contextualizes).
 */

const KNOWN_FACT_CHECKERS = [
  "snopes.com",
  "politifact.com",
  "factcheck.org",
  "reuters.com/fact-check",
  "apnews.com/hub/ap-fact-check",
  "bbc.com/news/reality_check",
  "fullfact.org",
  "afp.com/fact-check",
  "leadstories.com",
  "checkyourfact.com",
];

const KNOWN_HIGH_CREDIBILITY_NEWS = [
  "reuters.com",
  "apnews.com",
  "bbc.com",
  "bbc.co.uk",
  "nytimes.com",
  "wsj.com",
  "washingtonpost.com",
  "theguardian.com",
  "nature.com",
  "science.org",
  "nih.gov",
  "cdc.gov",
  "who.int",
  "nasa.gov",
  "bloomberg.com",
  "ft.com",
  "economist.com",
  "npr.org",
  "pbs.org",
];

function classifyDomain(url: string): {
  domain: string;
  sourceType: SourceItem["sourceType"];
  reliabilityRating: SourceItem["reliabilityRating"];
} {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (KNOWN_FACT_CHECKERS.some((fc) => hostname.includes(fc) || url.includes(fc))) {
      return {
        domain: hostname,
        sourceType: "fact_checker",
        reliabilityRating: "High",
      };
    }

    if (hostname.endsWith(".gov") || hostname.endsWith(".edu") || hostname.endsWith(".int")) {
      return {
        domain: hostname,
        sourceType: "official_gov_edu",
        reliabilityRating: "High",
      };
    }

    if (KNOWN_HIGH_CREDIBILITY_NEWS.some((hcn) => hostname.includes(hcn))) {
      return {
        domain: hostname,
        sourceType: "news",
        reliabilityRating: "High",
      };
    }

    if (hostname.includes("wikipedia.org") || hostname.includes("britannica.com")) {
      return {
        domain: hostname,
        sourceType: "general_web",
        reliabilityRating: "Moderate",
      };
    }

    return {
      domain: hostname,
      sourceType: "general_web",
      reliabilityRating: "Moderate",
    };
  } catch {
    return {
      domain: "web-source",
      sourceType: "unknown",
      reliabilityRating: "Requires Caution",
    };
  }
}

export async function executeStage2SourceRetrieval(
  stage1: ClaimExtractionStage
): Promise<SourceRetrievalStage> {
  const ai = getGeminiClient();

  const primaryClaim = stage1.coreClaims.map((c) => c.claim).join("; ");
  const searchQueries = [
    `fact check "${stage1.coreClaims[0]?.claim || stage1.mainTheme}"`,
    `${stage1.mainTheme} news truth investigation sources`,
  ];

  const searchPrompt = `You are Stage 2 of a Misinformation Detection Pipeline.
Investigate the authenticity of these specific extracted claims using live Google Search:

CLAIMS TO INVESTIGATE:
${stage1.coreClaims.map((c, i) => `${i + 1}. ${c.claim} (Context: ${c.context || "N/A"})`).join("\n")}

SEARCH OBJECTIVES:
1. Find verified reporting from reputable news organizations, primary documents, or official fact-checkers.
2. Determine whether credible reporting confirms, debunks, or clarifies this claim.
3. Provide a clear summary with direct references to what reliable sources say.

Perform a thorough search check now.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: searchPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const candidate = response.candidates?.[0];
    const groundingChunks = candidate?.groundingMetadata?.groundingChunks || [];
    const webSearchQueries = candidate?.groundingMetadata?.webSearchQueries || searchQueries;
    const modelGeneratedAnalysis = response.text || "";

    const sourcesFound: SourceItem[] = [];
    const seenUrls = new Set<string>();

    for (let i = 0; i < groundingChunks.length; i++) {
      const chunk = groundingChunks[i];
      const web = chunk.web;
      if (web && web.uri && !seenUrls.has(web.uri)) {
        seenUrls.add(web.uri);
        const { domain, sourceType, reliabilityRating } = classifyDomain(web.uri);

        // Deduce tentative stance based on title and context
        let stance: SourceItem["stance"] = "contextualizes";
        const titleLower = (web.title || "").toLowerCase();
        if (
          titleLower.includes("false") ||
          titleLower.includes("debunk") ||
          titleLower.includes("fake") ||
          titleLower.includes("hoax") ||
          titleLower.includes("misleading") ||
          titleLower.includes("fact check")
        ) {
          stance = "contradicts";
        } else if (
          titleLower.includes("confirms") ||
          titleLower.includes("verified") ||
          titleLower.includes("officially")
        ) {
          stance = "supports";
        }

        sourcesFound.push({
          id: `src-${sourcesFound.length + 1}`,
          title: web.title || `Source from ${domain}`,
          url: web.uri,
          domain,
          snippet: web.title || `Verified web source reporting on ${stage1.mainTheme}`,
          sourceType,
          stance,
          reliabilityRating,
        });
      }
    }

    const hasFactCheckers = sourcesFound.some((s) => s.sourceType === "fact_checker");

    return {
      sourcesFound,
      searchQueries: webSearchQueries.length > 0 ? webSearchQueries : searchQueries,
      searchProvider: "Google Search Grounding via Gemini API",
      sourcesCount: sourcesFound.length,
      hasFactCheckers,
    };
  } catch (error: any) {
    console.error("Stage 2 Source Retrieval Error:", error);
    return {
      sourcesFound: [],
      searchQueries,
      searchProvider: "Google Search Grounding (Unavailable/Error)",
      sourcesCount: 0,
      hasFactCheckers: false,
    };
  }
}
