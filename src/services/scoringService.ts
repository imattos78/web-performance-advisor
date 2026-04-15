import type {
  AnalysisResult,
  PerformanceAnalysis,
  SeoAnalysis,
  AccessibilityAnalysis,
  BestPracticesAnalysis,
  IssueSeverity
} from "../types/analysis";

export interface CategoryScore {
  score: number;
  maxScore: number;
  issues: number;
  breakdown: {
    [key: string]: number;
  };
}

export interface OverallScore {
  total: number;
  categories: {
    performance: CategoryScore;
    seo: CategoryScore;
    accessibility: CategoryScore;
    bestPractices: CategoryScore;
  };
  totalIssues: number;
  severityBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
}

/**
 * Calculate performance score based on resource counts and complexity
 */
export function calculatePerformanceScore(performance: PerformanceAnalysis): CategoryScore {
  const { totalImages, totalScripts, totalStylesheets, totalRequestsEstimate } = performance;

  // Base score starts at 100
  let score = 100;
  const penalties: { [key: string]: number } = {};

  // Penalize excessive resources (reasonable thresholds)
  if (totalImages > 50) {
    const penalty = Math.min((totalImages - 50) * 0.5, 20);
    score -= penalty;
    penalties.images = penalty;
  }

  if (totalScripts > 20) {
    const penalty = Math.min((totalScripts - 20) * 1, 25);
    score -= penalty;
    penalties.scripts = penalty;
  }

  if (totalStylesheets > 10) {
    const penalty = Math.min((totalStylesheets - 10) * 2, 15);
    score -= penalty;
    penalties.stylesheets = penalty;
  }

  if (totalRequestsEstimate > 100) {
    const penalty = Math.min((totalRequestsEstimate - 100) * 0.2, 20);
    score -= penalty;
    penalties.requests = penalty;
  }

  return {
    score: Math.max(0, Math.round(score)),
    maxScore: 100,
    issues: Object.keys(penalties).length,
    breakdown: penalties,
  };
}

/**
 * Calculate SEO score based on essential elements and structure
 */
export function calculateSeoScore(seo: SeoAnalysis): CategoryScore {
  let score = 100;
  const penalties: { [key: string]: number } = {};

  // Critical SEO elements (high impact)
  if (seo.missingTitle) {
    score -= 25;
    penalties.title = 25;
  }

  if (seo.missingMetaDescription) {
    score -= 15;
    penalties.metaDescription = 15;
  }

  // Heading structure (medium impact)
  if (seo.multipleH1) {
    score -= 10;
    penalties.multipleH1 = 10;
  }

  // Heading hierarchy bonus/penalty
  const headingRatio = seo.h2Count > 0 && seo.h3Count > 0 ? (seo.h2Count / Math.max(seo.h3Count, 1)) : 0;
  if (headingRatio > 3) {
    score -= 5;
    penalties.headingStructure = 5;
  } else if (headingRatio >= 1 && headingRatio <= 2) {
    // Good structure bonus
    score = Math.min(100, score + 5);
  }

  return {
    score: Math.max(0, Math.round(score)),
    maxScore: 100,
    issues: Object.keys(penalties).length,
    breakdown: penalties,
  };
}

/**
 * Calculate accessibility score based on WCAG compliance
 */
export function calculateAccessibilityScore(accessibility: AccessibilityAnalysis): CategoryScore {
  const { imagesWithoutAlt, inputsWithoutLabel, buttonsWithoutText } = accessibility;

  // Simple scoring: 100 - (issues * penalty)
  const totalIssues = imagesWithoutAlt + inputsWithoutLabel + buttonsWithoutText;
  const penalty = Math.min(totalIssues * 5, 100);

  const score = Math.max(0, 100 - penalty);

  const breakdown: { [key: string]: number } = {};
  if (imagesWithoutAlt > 0) breakdown.images = imagesWithoutAlt * 5;
  if (inputsWithoutLabel > 0) breakdown.inputs = inputsWithoutLabel * 5;
  if (buttonsWithoutText > 0) breakdown.buttons = buttonsWithoutText * 5;

  return {
    score: Math.round(score),
    maxScore: 100,
    issues: totalIssues,
    breakdown,
  };
}

/**
 * Calculate best practices score
 */
export function calculateBestPracticesScore(bestPractices: BestPracticesAnalysis): CategoryScore {
  let score = 100;
  const penalties: { [key: string]: number } = {};

  if (!bestPractices.usesHttps) {
    score -= 30;
    penalties.https = 30;
  }

  if (!bestPractices.hasViewportMeta) {
    score -= 10;
    penalties.viewport = 10;
  }

  return {
    score: Math.max(0, Math.round(score)),
    maxScore: 100,
    issues: Object.keys(penalties).length,
    breakdown: penalties,
  };
}

/**
 * Calculate overall score combining all categories
 */
export function calculateOverallScore(analysis: AnalysisResult): OverallScore {
  const performance = calculatePerformanceScore(analysis.performance);
  const seo = calculateSeoScore(analysis.seo);
  const accessibility = calculateAccessibilityScore(analysis.accessibility);
  const bestPractices = calculateBestPracticesScore(analysis.bestPractices);

  // Weighted average (accessibility and best practices have higher weight)
  const weights = {
    performance: 0.25,
    seo: 0.25,
    accessibility: 0.30,
    bestPractices: 0.20,
  };

  const total = Math.round(
    performance.score * weights.performance +
    seo.score * weights.seo +
    accessibility.score * weights.accessibility +
    bestPractices.score * weights.bestPractices
  );

  // Count issues by severity
  const severityBreakdown = analysis.issues.reduce(
    (acc, issue) => {
      acc[issue.severity]++;
      return acc;
    },
    { high: 0, medium: 0, low: 0 } as { high: number; medium: number; low: number }
  );

  return {
    total,
    categories: {
      performance,
      seo,
      accessibility,
      bestPractices,
    },
    totalIssues: analysis.issues.length,
    severityBreakdown,
  };
}

/**
 * Get score color based on score value
 */
export function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-600";
  if (score >= 70) return "text-yellow-600";
  if (score >= 50) return "text-orange-600";
  return "text-red-600";
}

/**
 * Get score label based on score value
 */
export function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 70) return "Fair";
  if (score >= 60) return "Poor";
  return "Critical";
}