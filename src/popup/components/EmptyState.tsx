import React from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  disabled?: boolean;
  variant?: "idle" | "error";
};

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  disabled = false,
  variant = "idle"
}) => {
  const icon = variant === "error" ? "!" : "i";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div
        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
          variant === "error" ? "bg-red-100 text-red-700" : "bg-cyan-100 text-cyan-700"
        }`}
      >
        {icon}
      </div>
      <h2 className="mt-3 text-sm font-semibold text-slate-800">{title}</h2>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          disabled={disabled}
          className="mt-4 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default EmptyState;
