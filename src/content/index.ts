/**
 * Web Page Analysis Content Script
 * Analyzes DOM for performance, SEO, accessibility, and best practices
 *
 * The script only runs analysis when the popup explicitly asks for it.
 */

declare const chrome: any;

import type { AnalysisResult, RuntimeRequestMessage } from "../types/analysis";
import { analyzePerformance } from "../services/performance";
import { analyzeSEO } from "../services/seo";
import { analyzeAccessibility } from "../services/accessibility";
import { analyzeBestPractices } from "../services/bestPractices";

import { calculateOverallScore } from "../services/scoringService";

export function analyzePage(): AnalysisResult {
  const performance = analyzePerformance();
  const { seo, issues: seoIssues } = analyzeSEO();
  const { accessibility, issues: accessibilityIssues } = analyzeAccessibility();
  const { bestPractices, issues: bestPracticeIssues } = analyzeBestPractices();

  const issues = [...seoIssues, ...accessibilityIssues, ...bestPracticeIssues];

  const result: AnalysisResult = {
    url: window.location.href,
    performance,
    seo,
    accessibility,
    bestPractices,
    issues,
  };

  // Calculate scores
  result.scores = calculateOverallScore(result);

  return result;
}

chrome.runtime.onMessage.addListener(
  (
    message: RuntimeRequestMessage,
    _sender: any,
    sendResponse: (response: AnalysisResult | null) => void
  ) => {
    if (message?.type !== "RUN_ANALYSIS") {
      return false;
    }

    try {
      const result = analyzePage();
      console.log("Analysis Result:", result);
      sendResponse(result);
    } catch (error) {
      console.error("Analysis error:", error);
      sendResponse(null);
    }

    return true;
  }
);
