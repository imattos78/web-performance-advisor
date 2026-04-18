import { useCallback, useMemo, useRef, useState } from "react";
import { calculateOverallScore } from "../../services/scoringService";
import type { AnalysisResult, RuntimeRequestMessage } from "../../types/analysis";
import type { AnalysisStatus, UseAnalysisReturn } from "../types";

type AuthStorageSnapshot = {
  authToken?: string;
  isAuthenticated?: boolean;
};

const CLICK_DEBOUNCE_MS = 800;
const MESSAGE_TIMEOUT_MS = 12000;

const CONTENT_SCRIPT_HELP = "Reload the page and try again.";

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error: unknown) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("Could not establish connection")) {
      return `Content script unavailable. ${CONTENT_SCRIPT_HELP}`;
    }

    if (error.message.includes("Receiving end does not exist")) {
      return `Analysis engine not injected. ${CONTENT_SCRIPT_HELP}`;
    }

    return error.message;
  }

  return "Something went wrong. Try again.";
}

async function readAuthStorage(): Promise<AuthStorageSnapshot> {
  if (!chrome.storage?.local) {
    return { isAuthenticated: false };
  }

  try {
    const values = (await chrome.storage.local.get([
      "authToken",
      "isAuthenticated"
    ])) as AuthStorageSnapshot;

    return values;
  } catch {
    return { isAuthenticated: false };
  }
}

function ensureScores(result: AnalysisResult): AnalysisResult {
  if (result.scores) {
    return result;
  }

  return {
    ...result,
    scores: calculateOverallScore(result)
  };
}

export function useAnalysis(): UseAnalysisReturn {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const cacheRef = useRef<Map<string, AnalysisResult>>(new Map());
  const debounceRef = useRef(0);

  const refreshAuthStatus = useCallback(async () => {
    const auth = await readAuthStorage();
    const authenticated = Boolean(auth.isAuthenticated || auth.authToken);
    setIsAuthenticated(authenticated);
  }, []);

  const runAnalysis = useCallback(
    async (options?: { force?: boolean }) => {
      const force = Boolean(options?.force);
      const now = Date.now();

      if (!force && status === "loading") {
        return;
      }

      if (!force && now - debounceRef.current < CLICK_DEBOUNCE_MS) {
        return;
      }

      debounceRef.current = now;
      setError(null);

      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const activeTab = tabs[0];

        if (!activeTab?.id || !activeTab.url) {
          throw new Error("No active tab available for analysis.");
        }

        setCurrentUrl(activeTab.url);

        const cached = cacheRef.current.get(activeTab.url);
        if (cached && !force) {
          setResult(cached);
          setStatus("success");
          await refreshAuthStatus();
          return;
        }

        setStatus("loading");

        const request: RuntimeRequestMessage = { type: "RUN_ANALYSIS" };

        const response = await withTimeout(
          chrome.tabs.sendMessage(activeTab.id, request) as Promise<AnalysisResult | null>,
          MESSAGE_TIMEOUT_MS,
          `Analysis timed out. ${CONTENT_SCRIPT_HELP}`
        );

        if (!response) {
          throw new Error(`No analysis response received. ${CONTENT_SCRIPT_HELP}`);
        }

        const finalized = ensureScores(response);
        cacheRef.current.set(activeTab.url, finalized);

        setResult(finalized);
        setStatus("success");
        await refreshAuthStatus();
      } catch (unknownError: unknown) {
        setStatus("error");
        setError(normalizeError(unknownError));
      }
    },
    [refreshAuthStatus, status]
  );

  const retryAnalysis = useCallback(async () => {
    await runAnalysis({ force: true });
  }, [runAnalysis]);

  const hasCachedResult = useMemo(() => {
    if (!currentUrl) {
      return false;
    }

    return cacheRef.current.has(currentUrl);
  }, [currentUrl, result]);

  return {
    status,
    error,
    result,
    isAuthenticated,
    hasCachedResult,
    currentUrl,
    runAnalysis,
    retryAnalysis,
    refreshAuthStatus
  };
}
