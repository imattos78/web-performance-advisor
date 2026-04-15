import type { AccessibilityAnalysis, Issue } from "../types/analysis";

function hasAssociatedLabel(input: HTMLInputElement): boolean {
  return Boolean(input.labels && input.labels.length > 0);
}

function hasAccessibleText(button: HTMLButtonElement): boolean {
  if (button.getAttribute("aria-label")) {
    return true;
  }

  if (button.getAttribute("aria-labelledby")) {
    return true;
  }

  if (button.textContent?.trim()) {
    return true;
  }

  if (button.querySelector("img[alt]")) {
    return true;
  }

  if (button.querySelector("svg[aria-label]")) {
    return true;
  }

  return false;
}

function calculateAccessibilityScore(stats: {
  imagesWithoutAlt: number;
  inputsWithoutLabel: number;
  buttonsWithoutText: number;
}): number {
  const totalIssues = stats.imagesWithoutAlt + stats.inputsWithoutLabel + stats.buttonsWithoutText;

  // Simple scoring: 100 - (issues * penalty)
  // Max penalty per issue type to prevent negative scores
  const penalty = Math.min(totalIssues * 5, 100);
  return Math.max(0, 100 - penalty);
}

function generateAccessibilityIssues(stats: {
  imagesWithoutAlt: number;
  inputsWithoutLabel: number;
  buttonsWithoutText: number;
}): Issue[] {
  const issues: Issue[] = [];

  if (stats.imagesWithoutAlt > 0) {
    issues.push({
      category: "accessibility",
      type: "missing-alt",
      severity: "high",
      message: `${stats.imagesWithoutAlt} image(s) are missing alt text.`,
      recommendation: "Add descriptive alt attributes to all images. Use empty alt='' only for decorative images.",
      elementCount: stats.imagesWithoutAlt,
    });
  }

  if (stats.inputsWithoutLabel > 0) {
    issues.push({
      category: "accessibility",
      type: "missing-label",
      severity: "medium",
      message: `${stats.inputsWithoutLabel} input(s) do not have an associated label.`,
      recommendation: "Associate each input with a label using the 'for' attribute or wrap the input in a label element.",
      elementCount: stats.inputsWithoutLabel,
    });
  }

  if (stats.buttonsWithoutText > 0) {
    issues.push({
      category: "accessibility",
      type: "missing-button-text",
      severity: "medium",
      message: `${stats.buttonsWithoutText} button(s) lack accessible text or label.`,
      recommendation: "Add text content, aria-label, or aria-labelledby to all buttons.",
      elementCount: stats.buttonsWithoutText,
    });
  }

  return issues;
}

export function analyzeAccessibility(): { accessibility: AccessibilityAnalysis; issues: Issue[] } {
  let imagesWithoutAlt = 0;
  const images = document.querySelectorAll("img");

  // Use for loop for better performance
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const alt = img.getAttribute("alt");

    // Only count as issue if alt is null (missing), not empty string (decorative)
    if (alt === null) {
      imagesWithoutAlt++;
    }
  }

  let inputsWithoutLabel = 0;
  const inputs = document.querySelectorAll(
    "input:not([type='hidden']):not([type='submit']):not([type='button']):not([type='reset'])"
  );

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i] as HTMLInputElement;
    if (!hasAssociatedLabel(input)) {
      inputsWithoutLabel++;
    }
  }

  let buttonsWithoutText = 0;
  const buttons = document.querySelectorAll("button");

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i] as HTMLButtonElement;
    if (!hasAccessibleText(button)) {
      buttonsWithoutText++;
    }
  }

  const stats = {
    imagesWithoutAlt,
    inputsWithoutLabel,
    buttonsWithoutText,
  };

  const score = calculateAccessibilityScore(stats);
  const issues = generateAccessibilityIssues(stats);

  return {
    accessibility: {
      score,
      ...stats,
    },
    issues,
  };
}