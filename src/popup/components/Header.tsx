import React from "react";

type HeaderProps = {
  isAuthenticated: boolean;
  currentUrl: string | null;
};

const Header: React.FC<HeaderProps> = ({ isAuthenticated, currentUrl }) => {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-700 p-4 text-white shadow-sm">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/15" />
      <div className="absolute -left-6 -bottom-10 h-20 w-20 rounded-full bg-cyan-200/25" />

      <div className="relative space-y-1">
        <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100">Web Performance Advisor</p>
        <h1 className="text-lg font-semibold leading-tight">Page Insight Dashboard</h1>
        <p className="text-xs text-cyan-100/90">Fast checks for performance, SEO, accessibility, and best practices.</p>

        <div className="flex items-center justify-between pt-2">
          <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-medium text-cyan-50">
            {isAuthenticated ? "Account Connected" : "Guest Mode"}
          </span>
          {currentUrl ? (
            <span className="max-w-[170px] truncate text-[10px] text-cyan-100/90">{currentUrl}</span>
          ) : (
            <span className="text-[10px] text-cyan-100/90">No URL selected</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
