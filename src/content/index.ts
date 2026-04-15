/**
 * Web Page Analysis Content Script
 * Analyzes DOM for performance, SEO, accessibility, and best practices
 * 
 * This script runs in the context of the webpage and sends analysis
 * results back to the extension popup via chrome.runtime.sendMessage
 */

import type { AnalysisResult, AnalysisMessage } from "~types/analysis";

/**
 * Analyzes performance-related metrics from the webpage
 */
function analyzePerformance() {
  const totalImages = document.querySelectorAll("img").length;
  const totalScripts = document.querySelectorAll("script").length;
  const totalStylesheets = document.querySelectorAll("link[rel='stylesheet']").length;
  const totalRequestsEstimate = totalImages + totalScripts + totalStylesheets;

  return {
    totalImages,
    totalScripts,
    totalStylesheets,
    totalRequestsEstimate,
  };
}

/**
 * Analyzes SEO-related elements and structure
 */
function analyzeSEO() {
  const titleElement = document.querySelector("title");
  const title = titleElement?.textContent || null;

  const metaDescription = document
    .querySelector("meta[name='description']")
    ?.getAttribute("content") || null;

  const h1Count = document.querySelectorAll("h1").length;
  const h2Count = document.querySelectorAll("h2").length;
  const h3Count = document.querySelectorAll("h3").length;

  return {
    title,
    metaDescription,
    h1Count,
    h2Count,
    h3Count,
  };
}

/**
 * Checks if an input element has an associated label
 */
function hasAssociatedLabel(input: HTMLInputElement): boolean {
  // Check if input has an id
  const inputId = input.id;
  if (inputId) {
    // Look for label with matching 'for' attribute
    const label = document.querySelector(`label[for='${inputId}']`);
    if (label) return true;
  }

  // Check if input is wrapped in a label
  if (input.parentElement?.tagName === "LABEL") {
    return true;
  }

  return false;
}

/**
 * Checks if a button has accessible text content or aria-label
 */
function hasAccessibleText(button: HTMLButtonElement): boolean {
  // Check for aria-label
  if (button.getAttribute("aria-label")) {
    return true;
  }

  // Check for text content (trim to avoid whitespace-only buttons)
  if (button.textContent?.trim()) {
    return true;
  }

  return false;
}

/**
 * Analyzes accessibility-related issues
 */
function analyzeAccessibility() {
  let imagesWithoutAlt = 0;
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    const alt = img.getAttribute("alt");
    if (!alt || alt.trim() === "") {
      imagesWithoutAlt++;
    }
  });

  let inputsWithoutLabel = 0;
  const inputs = document.querySelectorAll("input[type!='hidden']");

  inputs.forEach((input) => {
    if (!hasAssociatedLabel(input as HTMLInputElement)) {
      inputsWithoutLabel++;
    }
  });

  let buttonsWithoutText = 0;
  const buttons = document.querySelectorAll("button");

  buttons.forEach((button) => {
    if (!hasAccessibleText(button as HTMLButtonElement)) {
      buttonsWithoutText++;
    }
  });

  return {
    imagesWithoutAlt,
    inputsWithoutLabel,
    buttonsWithoutText,
  };
}

/**
 * Analyzes best practices
 */
function analyzeBestPractices() {
  const usesHttps = window.location.href.startsWith("https://");
  const hasViewportMeta = !!document.querySelector("meta[name='viewport']");

  return {
    usesHttps,
    hasViewportMeta,
  };
}

/**
 * Main analysis function
 * Orchestrates all analysis modules and returns complete result
 */
export function analyzePage(): AnalysisResult {
  const result: AnalysisResult = {
    url: window.location.href,
    performance: analyzePerformance(),
    seo: analyzeSEO(),
    accessibility: analyzeAccessibility(),
    bestPractices: analyzeBestPractices(),
  };

  return result;
}

/**
 * Sends analysis result to extension background/popup
 */
function sendAnalysisResult(result: AnalysisResult): void {
  const message: AnalysisMessage = {
    type: "ANALYSIS_COMPLETE",
    payload: result,
  };

  chrome.runtime.sendMessage(message, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error sending message:", chrome.runtime.lastError);
    } else {
      console.log("Analysis result sent successfully", response);
    }
  });
}

/**
 * Initialize content script
 * Runs analysis and sends results to extension
 */
function init(): void {
  try {
    const result = analyzePage();
    console.log("Analysis Result:", result);
    sendAnalysisResult(result);
  } catch (error) {
    console.error("Error during page analysis:", error);
  }
}

// Run analysis when script loads
init();
