import React, { useMemo } from "react";
import type { Issue, IssueCategory } from "../types/analysis";
import CategorySection from "./components/CategorySection";
import EmptyState from "./components/EmptyState";
import Header from "./components/Header";
import Loader from "./components/Loader";
import ScoreCard from "./components/ScoreCard";
import { useAnalysis } from "./hooks/useAnalysis";

const orderedCategories: IssueCategory[] = ["performance", "seo", "accessibility", "best-practices"];

const Popup: React.FC = () => {
  const {
    status,
    error,
    result,
    isAuthenticated,
    hasCachedResult,
    currentUrl,
    runAnalysis,
    retryAnalysis
  } = useAnalysis();

  const groupedIssues = useMemo(() => {
    const groups: Record<IssueCategory, Issue[]> = {
      performance: [],
      seo: [],
      accessibility: [],
      "best-practices": []
    };

    if (!result) {
      return groups;
    }

    for (const issue of result.issues) {
      groups[issue.category].push(issue);
    }

    return groups;
  }, [result]);

  const isLocked = Boolean(result && !isAuthenticated);

  const handleRun = async () => {
    await runAnalysis();
  };

  const handleRetry = async () => {
    await retryAnalysis();
  };

  return (
    <main className="h-auto w-[360px] bg-slate-50 p-3 text-slate-900">
      <div className="space-y-3">
        <Header isAuthenticated={isAuthenticated} currentUrl={currentUrl} />

        <button
          type="button"
          onClick={handleRun}
          disabled={status === "loading"}
          className="w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Analyzing page..." : hasCachedResult ? "Run Analysis Again" : "Run Analysis"}
        </button>

        {status === "loading" ? <Loader label="Analyzing page..." /> : null}

        {status === "error" ? (
          <EmptyState
            variant="error"
            title="Something went wrong"
            description={error ?? "Reload the page and try again."}
            actionLabel="Try Again"
            onAction={handleRetry}
          />
        ) : null}

        {status === "success" && result?.scores ? (
          <section className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Overall Score</p>
              <p className="mt-1 text-4xl font-bold text-slate-900">{result.scores.total}</p>
              <p className="mt-1 text-xs text-slate-500">
                {result.scores.totalIssues} issue{result.scores.totalIssues === 1 ? "" : "s"} found
              </p>
            </div>

            <div className={`space-y-3 ${isLocked ? "relative" : ""}`}>
              <div className={`grid grid-cols-2 gap-2 ${isLocked ? "blur-[2px] opacity-70" : ""}`}>
                <ScoreCard title="Performance" score={result.scores.categories.performance.score} />
                <ScoreCard title="SEO" score={result.scores.categories.seo.score} />
                <ScoreCard title="Accessibility" score={result.scores.categories.accessibility.score} />
                <ScoreCard title="Best Practices" score={result.scores.categories.bestPractices.score} />
              </div>

              <div className={`space-y-3 rounded-2xl border border-slate-200 bg-slate-100/60 p-3 ${isLocked ? "blur-[2px] opacity-70" : ""}`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-800">Issues</h2>
                  <span className="text-xs text-slate-500">Grouped by category</span>
                </div>

                {result.issues.length === 0 ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
                    Great job. No issues detected on this page.
                  </div>
                ) : (
                  orderedCategories.map((category) => (
                    <CategorySection key={category} category={category} issues={groupedIssues[category]} />
                  ))
                )}
              </div>

              {isLocked ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-900/55 p-4 text-center">
                  <div className="rounded-xl bg-white p-4 shadow-lg">
                    <p className="text-sm font-semibold text-slate-900">Login to view full report</p>
                    <p className="mt-1 text-xs text-slate-600">Authentication is required to unlock issue recommendations and full diagnostics.</p>
                    <button
                      type="button"
                      className="mt-3 w-full rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-700"
                    >
                      Connect Account
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
};

export default Popup;
