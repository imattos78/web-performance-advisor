import React, { useState, useEffect } from "react";
import { AnalysisResult } from "../types/analysis";
import { OverallScore } from "../services/scoringService";
import ScoreCard from "./components/ScoreCard";
import IssuesList from "./components/IssuesList";
import AnalysisButton from "./components/AnalysisButton";
import AuthBanner from "./components/AuthBanner";

const Popup: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    // TODO: Implement authentication check
    // For now, assume unauthenticated
    setIsAuthenticated(false);
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Send message to content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab.id) {
        throw new Error("No active tab found");
      }

      const response = await chrome.tabs.sendMessage(tab.id, {
        type: "RUN_ANALYSIS"
      });

      setAnalysis(response);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to analyze page. Please refresh and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreSummary = (scores: OverallScore) => {
    const { total, totalIssues, severityBreakdown } = scores;
    return {
      score: total,
      issues: totalIssues,
      criticalIssues: severityBreakdown.high,
    };
  };

  return (
    <div className="w-96 min-h-96 bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <h1 className="text-xl font-bold">Web Performance Advisor</h1>
        <p className="text-sm opacity-90">Analyze any website instantly</p>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {!analysis ? (
          <div className="text-center py-8">
            <AnalysisButton
              onClick={runAnalysis}
              isLoading={isAnalyzing}
              disabled={false}
            />
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Overall Score */}
            {analysis.scores && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-800">
                  {analysis.scores.total}
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
                <div className="text-xs text-gray-500 mt-1">
                  {getScoreSummary(analysis.scores).issues} issues found
                </div>
              </div>
            )}

            {/* Category Scores */}
            {analysis.scores && (
              <div className="grid grid-cols-2 gap-3">
                <ScoreCard
                  title="Performance"
                  score={analysis.scores.categories.performance.score}
                  issues={analysis.scores.categories.performance.issues}
                />
                <ScoreCard
                  title="SEO"
                  score={analysis.scores.categories.seo.score}
                  issues={analysis.scores.categories.seo.issues}
                />
                <ScoreCard
                  title="Accessibility"
                  score={analysis.scores.categories.accessibility.score}
                  issues={analysis.scores.categories.accessibility.issues}
                />
                <ScoreCard
                  title="Best Practices"
                  score={analysis.scores.categories.bestPractices.score}
                  issues={analysis.scores.categories.bestPractices.issues}
                />
              </div>
            )}

            {/* Issues List - Only show summary for unauthenticated users */}
            {!isAuthenticated ? (
              <AuthBanner
                issueCount={analysis.issues.length}
                onAnalyzeAgain={runAnalysis}
              />
            ) : (
              <IssuesList issues={analysis.issues} />
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isAnalyzing ? "Analyzing..." : "Re-analyze"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;