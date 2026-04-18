import React, { useState } from "react";
import type { Issue } from "../../types/analysis";

interface IssuesListProps {
  issues: Issue[];
}

const IssuesList: React.FC<IssuesListProps> = ({ issues }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(issues.map(issue => issue.category)))];

  const filteredIssues = selectedCategory === "all"
    ? issues
    : issues.filter(issue => issue.category === selectedCategory);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "accessibility": return "♿";
      case "seo": return "🔍";
      case "performance": return "⚡";
      case "best-practices": return "✅";
      default: return "⚠️";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">
          Issues Found ({issues.length})
        </h3>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-2">
        {filteredIssues.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-4">
            No issues found in this category
          </div>
        ) : (
          filteredIssues.map((issue, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-3 bg-white"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCategoryIcon(issue.category)}</span>
                  <span className="text-xs font-medium text-gray-600 capitalize">
                    {issue.category.replace("-", " ")}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(issue.severity)}`}>
                  {issue.severity}
                </span>
              </div>

              <h4 className="text-sm font-medium text-gray-800 mb-1">
                {issue.message}
              </h4>

              {issue.recommendation && (
                <p className="text-xs text-gray-600">
                  💡 {issue.recommendation}
                </p>
              )}

              {issue.elementCount && issue.elementCount > 1 && (
                <p className="text-xs text-gray-500 mt-1">
                  Affects {issue.elementCount} elements
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IssuesList;