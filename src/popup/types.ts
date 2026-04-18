import type { AnalysisResult, Issue, IssueCategory } from "../types/analysis";

export type AnalysisStatus = "idle" | "loading" | "success" | "error";

export type GroupedIssues = Record<IssueCategory, Issue[]>;

export type UseAnalysisState = {
  status: AnalysisStatus;
  error: string | null;
  result: AnalysisResult | null;
  isAuthenticated: boolean;
  hasCachedResult: boolean;
  currentUrl: string | null;
};

export type UseAnalysisActions = {
  runAnalysis: (options?: { force?: boolean }) => Promise<void>;
  retryAnalysis: () => Promise<void>;
  refreshAuthStatus: () => Promise<void>;
};

export type UseAnalysisReturn = UseAnalysisState & UseAnalysisActions;
