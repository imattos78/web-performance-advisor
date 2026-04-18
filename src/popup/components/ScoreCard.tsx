import React from "react";

interface ScoreCardProps {
  title: string;
  score: number;
}

function getTone(score: number) {
  if (score >= 90) {
    return {
      text: "text-emerald-700",
      ring: "#10b981",
      chip: "bg-emerald-100 text-emerald-800"
    };
  }

  if (score >= 50) {
    return {
      text: "text-amber-700",
      ring: "#f59e0b",
      chip: "bg-amber-100 text-amber-800"
    };
  }

  return {
    text: "text-rose-700",
    ring: "#ef4444",
    chip: "bg-rose-100 text-rose-800"
  };
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score }) => {
  const tone = getTone(score);
  const progress = Math.min(Math.max(score, 0), 100) * 3.6;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${tone.chip}`}>
          {score >= 90 ? "Good" : score >= 50 ? "Medium" : "Bad"}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div
          className="relative h-12 w-12 rounded-full"
          style={{
            background: `conic-gradient(${tone.ring} ${progress}deg, #e2e8f0 0deg)`
          }}
        >
          <div className="absolute inset-1 flex items-center justify-center rounded-full bg-white text-[11px] font-semibold text-slate-700">
            {score}
          </div>
        </div>
        <div>
          <p className={`text-2xl font-bold leading-none ${tone.text}`}>{score}</p>
          <p className="mt-1 text-xs text-slate-500">out of 100</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;