/**
 * Analysis Result Type
 * Represents the complete analysis of a webpage
 */

export type AnalysisResult = {
  url: string;
  performance: {
    totalImages: number;
    totalScripts: number;
    totalStylesheets: number;
    totalRequestsEstimate: number;
  };
  seo: {
    title: string | null;
    metaDescription: string | null;
    h1Count: number;
    h2Count: number;
    h3Count: number;
  };
  accessibility: {
    imagesWithoutAlt: number;
    inputsWithoutLabel: number;
    buttonsWithoutText: number;
  };
  bestPractices: {
    usesHttps: boolean;
    hasViewportMeta: boolean;
  };
};

/**
 * Chrome runtime message type for content script communication
 */
export type AnalysisMessage = {
  type: "ANALYSIS_COMPLETE";
  payload: AnalysisResult;
};
