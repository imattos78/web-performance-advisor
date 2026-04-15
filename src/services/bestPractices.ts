import type { BestPracticesAnalysis, Issue } from "../types/analysis";

export function analyzeBestPractices(): { bestPractices: BestPracticesAnalysis; issues: Issue[] } {
  const usesHttps = window.location.href.startsWith("https://");
  const hasViewportMeta = Boolean(document.querySelector("meta[name='viewport']"));

  const issues: Issue[] = [];

  if (!usesHttps) {
    issues.push({
      category: "best-practices",
      type: "no-https",
      severity: "high",
      message: "Page is not served over HTTPS.",
      recommendation: "Implement HTTPS to secure user data and improve SEO rankings.",
    });
  }

  if (!hasViewportMeta) {
    issues.push({
      category: "best-practices",
      type: "missing-viewport",
      severity: "low",
      message: "Viewport meta tag is missing.",
      recommendation: "Add a viewport meta tag for proper mobile responsiveness.",
    });
  }

  return {
    bestPractices: {
      usesHttps,
      hasViewportMeta,
    },
    issues,
  };
}
