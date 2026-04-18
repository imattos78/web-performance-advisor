/**
 * Web Page Analysis Content Script
 */

declare const chrome: any;

// -------------------- TYPES --------------------

type Severity = "low" | "medium" | "high";

type Issue = {
  category: string;
  type: string;
  severity: Severity;
  message: string;
  recommendation: string;
  elementCount?: number;
};

type PerformanceStats = {
  totalImages: number;
  totalScripts: number;
  totalStylesheets: number;
  totalRequestsEstimate: number;
};

type AccessibilityStats = {
  score: number;
  imagesWithoutAlt: number;
  inputsWithoutLabel: number;
  buttonsWithoutText: number;
};

console.log("✅ Content script LOADED");
// -------------------- PERFORMANCE --------------------

function analyzePerformance(): PerformanceStats {
  const images = document.querySelectorAll("img");
  const scripts = document.querySelectorAll("script");
  const stylesheets = document.querySelectorAll("link[rel='stylesheet']");

  return {
    totalImages: images.length,
    totalScripts: scripts.length,
    totalStylesheets: stylesheets.length,
    totalRequestsEstimate: images.length + scripts.length + stylesheets.length,
  };
}

// -------------------- SEO --------------------

function analyzeSEO(): { seo: any; issues: Issue[] } {
  const title = document.querySelector("title")?.textContent?.trim() || null;
  const metaDescription =
    document.querySelector("meta[name='description']")?.getAttribute("content")?.trim() || null;

  const h1Count = document.querySelectorAll("h1").length;
  const h2Count = document.querySelectorAll("h2").length;
  const h3Count = document.querySelectorAll("h3").length;

  const issues: Issue[] = [];

  if (!title) {
    issues.push({
      category: "seo",
      type: "missing-title",
      severity: "high",
      message: "Page is missing a title element.",
      recommendation: "Add a descriptive title element.",
    });
  }

  if (!metaDescription) {
    issues.push({
      category: "seo",
      type: "missing-meta-description",
      severity: "medium",
      message: "Page is missing a meta description.",
      recommendation: "Add a meta description tag.",
    });
  }

  if (h1Count > 1) {
    issues.push({
      category: "seo",
      type: "multiple-h1",
      severity: "low",
      message: "Page contains more than one H1 heading.",
      recommendation: "Use only one H1 heading per page.",
      elementCount: h1Count,
    });
  }

  return {
    seo: {
      title,
      metaDescription,
      h1Count,
      h2Count,
      h3Count,
      missingTitle: !title,
      missingMetaDescription: !metaDescription,
      multipleH1: h1Count > 1,
    },
    issues,
  };
}

// -------------------- ACCESSIBILITY --------------------

function hasAssociatedLabel(input: HTMLInputElement): boolean {
  return Boolean(
    (input.labels && input.labels.length > 0) ||
    input.getAttribute("aria-label") ||
    input.getAttribute("aria-labelledby")
  );
}

function hasAccessibleText(button: HTMLButtonElement): boolean {
  return Boolean(
    button.getAttribute("aria-label") ||
    button.getAttribute("aria-labelledby") ||
    button.textContent?.trim() ||
    button.querySelector("img[alt]") ||
    button.querySelector("svg[aria-label]") ||
    button.querySelector("[class*='sr-only']")
  );
}

function analyzeAccessibility(): { accessibility: AccessibilityStats; issues: Issue[] } {
  const images = document.querySelectorAll("img");
  const inputs = document.querySelectorAll(
    "input:not([type='hidden']):not([type='submit']):not([type='button']):not([type='reset'])"
  );
  const buttons = document.querySelectorAll("button");

  let imagesWithoutAlt = 0;
  images.forEach((img) => {
    if (img.getAttribute("alt") === null && img.getAttribute("aria-hidden") !== "true") {
      imagesWithoutAlt++;
    }
  });

  let inputsWithoutLabel = 0;
  inputs.forEach((input) => {
    if (!hasAssociatedLabel(input as HTMLInputElement)) {
      inputsWithoutLabel++;
    }
  });

  let buttonsWithoutText = 0;
  buttons.forEach((button) => {
    if (!hasAccessibleText(button as HTMLButtonElement)) {
      buttonsWithoutText++;
    }
  });

  const issues: Issue[] = [];

  if (imagesWithoutAlt > 0) {
    issues.push({
      category: "accessibility",
      type: "missing-alt",
      severity: "high",
      message: `${imagesWithoutAlt} image(s) are missing alt text.`,
      recommendation: "Add descriptive alt attributes to all images.",
      elementCount: imagesWithoutAlt,
    });
  }

  if (inputsWithoutLabel > 0) {
    issues.push({
      category: "accessibility",
      type: "missing-label",
      severity: "medium",
      message: `${inputsWithoutLabel} input(s) do not have an associated label.`,
      recommendation: "Associate each input with a label.",
      elementCount: inputsWithoutLabel,
    });
  }

  if (buttonsWithoutText > 0) {
    issues.push({
      category: "accessibility",
      type: "missing-button-text",
      severity: "medium",
      message: `${buttonsWithoutText} button(s) lack accessible text.`,
      recommendation: "Add text or aria-label to all buttons.",
      elementCount: buttonsWithoutText,
    });
  }

  const penalty =
    imagesWithoutAlt * 5 + inputsWithoutLabel * 4 + buttonsWithoutText * 3;

  const score = Math.max(0, 100 - Math.min(penalty, 100));

  return {
    accessibility: {
      score,
      imagesWithoutAlt,
      inputsWithoutLabel,
      buttonsWithoutText,
    },
    issues,
  };
}

// -------------------- BEST PRACTICES --------------------

function analyzeBestPractices() {
  const usesHttps = window.location.href.startsWith("https://");
  const hasViewportMeta = Boolean(document.querySelector("meta[name='viewport']"));

  const issues: Issue[] = [];

  if (!usesHttps) {
    issues.push({
      category: "best-practices",
      type: "no-https",
      severity: "high",
      message: "Page is not served over HTTPS.",
      recommendation: "Implement HTTPS.",
    });
  }

  if (!hasViewportMeta) {
    issues.push({
      category: "best-practices",
      type: "missing-viewport",
      severity: "low",
      message: "Viewport meta tag is missing.",
      recommendation: "Add a viewport meta tag.",
    });
  }

  return {
    bestPractices: { usesHttps, hasViewportMeta },
    issues,
  };
}

// -------------------- SCORING --------------------

function calculatePerformanceScore(performance: PerformanceStats) {
  let score = 100;
  const penalties: Record<string, number> = {};

  if (performance.totalImages > 50)
    penalties.images = Math.min((performance.totalImages - 50) * 0.5, 20);

  if (performance.totalScripts > 20)
    penalties.scripts = Math.min((performance.totalScripts - 20) * 1, 25);

  if (performance.totalStylesheets > 10)
    penalties.stylesheets = Math.min((performance.totalStylesheets - 10) * 2, 15);

  if (performance.totalRequestsEstimate > 100)
    penalties.requests = Math.min((performance.totalRequestsEstimate - 100) * 0.2, 20);

  Object.values(penalties).forEach((p) => (score -= p));

  return {
    score: Math.max(0, Math.round(score)),
    breakdown: penalties,
  };
}

// -------------------- MAIN --------------------

function analyzePage() {
  const performance = analyzePerformance();
  const { seo, issues: seoIssues } = analyzeSEO();
  const { accessibility, issues: accessibilityIssues } = analyzeAccessibility();
  const { bestPractices, issues: bestPracticeIssues } = analyzeBestPractices();

  return {
    url: window.location.href,
    performance,
    seo,
    accessibility,
    bestPractices,
    issues: [...seoIssues, ...accessibilityIssues, ...bestPracticeIssues],
  };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("📩 Message received:", message)
  
  if (message?.type !== "RUN_ANALYSIS") return false;

  try {
    const result = analyzePage();
    sendResponse(result);
  } catch (error) {
    console.error(error);
    sendResponse(null);
  }

  return true;
});