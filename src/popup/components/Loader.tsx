import React from "react";

type LoaderProps = {
  label?: string;
};

const Loader: React.FC<LoaderProps> = ({ label = "Analyzing page..." }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-cyan-100 border-t-cyan-600" />
      <p className="mt-3 text-sm font-medium text-slate-700">{label}</p>
      <p className="mt-1 text-xs text-slate-500">This usually takes a few seconds.</p>
    </div>
  );
};

export default Loader;
