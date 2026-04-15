/**
 * Analysis Result Type
 * Represents the complete analysis of a webpage
 */

export type IssueSeverity = "low" | "medium" | "high";

export type IssueCategory = "accessibility" | "seo" | "performance" | "best-practices";

export type Issue = {
  category: IssueCategory;
  type: string;
  severity: IssueSeverity;
  message: string;
  recommendation?: string;
  elementCount?: number;
};


export type PerformanceAnalysis = {
  totalImages: number;
  totalScripts: number;
  totalStylesheets: number;
  totalRequestsEstimate: number;
};

export type SeoAnalysis = {
  title: string | null;
  metaDescription: string | null;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  missingTitle: boolean;
  missingMetaDescription: boolean;
  multipleH1: boolean;
};

export type AccessibilityAnalysis = {
  score: number;
  imagesWithoutAlt: number;
  inputsWithoutLabel: number;
  buttonsWithoutText: number;
};

export type BestPracticesAnalysis = {
  usesHttps: boolean;
  hasViewportMeta: boolean;
};

export type AnalysisResult = {
  url: string;
  performance: PerformanceAnalysis;
  seo: SeoAnalysis;
  accessibility: AccessibilityAnalysis;
  bestPractices: BestPracticesAnalysis;
  issues: Issue[];
};

export type RuntimeRequestMessage = {
  type: "RUN_ANALYSIS";
};

/**
 * Chrome runtime message type for content script communication
 */
export type AnalysisMessage = {
  type: "ANALYSIS_COMPLETE";
  payload: AnalysisResult;
};
