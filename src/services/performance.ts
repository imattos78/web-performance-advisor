import type { PerformanceAnalysis } from "../types/analysis";

export function analyzePerformance(): PerformanceAnalysis {
  const images = document.querySelectorAll("img");
  const scripts = document.querySelectorAll("script");
  const stylesheets = document.querySelectorAll("link[rel='stylesheet']");

  const totalImages = images.length;
  const totalScripts = scripts.length;
  const totalStylesheets = stylesheets.length;
  const totalRequestsEstimate = totalImages + totalScripts + totalStylesheets;

  return {
    totalImages,
    totalScripts,
    totalStylesheets,
    totalRequestsEstimate,
  };
}
