import React from "react";

interface AnalysisButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const AnalysisButton: React.FC<AnalysisButtonProps> = ({
  onClick,
  isLoading,
  disabled
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        w-full py-3 px-6 rounded-lg font-semibold text-white
        transition-all duration-200 transform hover:scale-105
        ${disabled || isLoading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
        }
      `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Analyzing Page...
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg">🔍</span>
          Analyze This Page
        </div>
      )}
    </button>
  );
};

export default AnalysisButton;