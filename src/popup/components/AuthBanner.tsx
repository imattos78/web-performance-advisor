import React from "react";

interface AuthBannerProps {
  issueCount: number;
  onAnalyzeAgain: () => void;
}

const AuthBanner: React.FC<AuthBannerProps> = ({ issueCount, onAnalyzeAgain }) => {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="text-2xl">🔒</div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">
            Unlock Full Report
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            Found {issueCount} issue{issueCount !== 1 ? 's' : ''} on this page.
            Sign in to see detailed recommendations and fixes.
          </p>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded font-medium hover:bg-blue-700 transition-colors">
              Sign In
            </button>
            <button
              onClick={onAnalyzeAgain}
              className="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded font-medium hover:bg-gray-300 transition-colors"
            >
              Re-analyze
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthBanner;