import type { Issue, SeoAnalysis } from "../types/analysis";

export function analyzeSEO(): { seo: SeoAnalysis; issues: Issue[] } {
  const titleElement = document.querySelector("title");
  const title = titleElement?.textContent?.trim() || null;
  const metaDescription = document
    .querySelector("meta[name='description']")
    ?.getAttribute("content")
    ?.trim() || null;

  const h1Count = document.querySelectorAll("h1").length;
  const h2Count = document.querySelectorAll("h2").length;
  const h3Count = document.querySelectorAll("h3").length;

  const missingTitle = !title;
  const missingMetaDescription = !metaDescription;
  const multipleH1 = h1Count > 1;

  const issues: Issue[] = [];

  if (missingTitle) {
    issues.push({
      category: "seo",
      type: "missing-title",
      severity: "high",
      message: "Page is missing a title element.",
      recommendation: "Add a descriptive title element to the head section of your HTML.",
    });
  }

  if (missingMetaDescription) {
    issues.push({
      category: "seo",
      type: "missing-meta-description",
      severity: "medium",
      message: "Page is missing a meta description.",
      recommendation: "Add a meta description tag with a concise summary of the page content.",
    });
  }

  if (multipleH1) {
    issues.push({
      category: "seo",
      type: "multiple-h1",
      severity: "low",
      message: "Page contains more than one H1 heading.",
      recommendation: "Use only one H1 heading per page for optimal SEO structure.",
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
      missingTitle,
      missingMetaDescription,
      multipleH1,
    },
    issues,
  };
}
