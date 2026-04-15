import React from "react";
import { getScoreColor } from "../../services/scoringService";

interface ScoreCardProps {
  title: string;
  score: number;
  issues: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, issues }) => {
  const scoreColor = getScoreColor(score);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
      <div className={`text-2xl font-bold ${scoreColor}`}>
        {score}
      </div>
      <div className="text-xs font-medium text-gray-600 mt-1">
        {title}
      </div>
      {issues > 0 && (
        <div className="text-xs text-red-500 mt-1">
          {issues} issue{issues !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default ScoreCard;