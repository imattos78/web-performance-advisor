import React, { useState } from "react";
import type { Issue } from "../../types/analysis";

type IssueItemProps = {
  issue: Issue;
};

function getSeverityClass(severity: Issue["severity"]) {
  switch (severity) {
    case "high":
      return "bg-rose-100 text-rose-700";
    case "medium":
      return "bg-amber-100 text-amber-700";
    case "low":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

const IssueItem: React.FC<IssueItemProps> = ({ issue }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs leading-5 text-slate-700">{issue.message}</p>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${getSeverityClass(issue.severity)}`}>
          {issue.severity}
        </span>
      </div>

      {issue.elementCount ? (
        <p className="mt-2 text-[11px] text-slate-500">Affects {issue.elementCount} element{issue.elementCount > 1 ? "s" : ""}</p>
      ) : null}

      {issue.recommendation ? (
        <div className="mt-2 border-t border-slate-100 pt-2">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="text-xs font-medium text-cyan-700 hover:text-cyan-800"
          >
            {expanded ? "Hide recommendation" : "Show recommendation"}
          </button>
          {expanded ? <p className="mt-2 text-xs leading-5 text-slate-600">{issue.recommendation}</p> : null}
        </div>
      ) : null}
    </article>
  );
};

export default IssueItem;
