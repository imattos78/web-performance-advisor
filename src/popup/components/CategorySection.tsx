import React from "react";
import type { Issue, IssueCategory } from "../../types/analysis";
import IssueItem from "./IssueItem";

type CategorySectionProps = {
  category: IssueCategory;
  issues: Issue[];
};

const categoryTitles: Record<IssueCategory, string> = {
  accessibility: "Accessibility",
  seo: "SEO",
  performance: "Performance",
  "best-practices": "Best Practices"
};

const CategorySection: React.FC<CategorySectionProps> = ({ category, issues }) => {
  if (issues.length === 0) {
    return null;
  }

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">{categoryTitles[category]}</h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
          {issues.length} issue{issues.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-2">
        {issues.map((issue, index) => (
          <IssueItem key={`${issue.type}-${index}`} issue={issue} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
