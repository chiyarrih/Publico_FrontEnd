import React from "react";

interface ErrorDisplayProps {
  error: string | null;
  onClear: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onClear }) => {
  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded px-4 py-2 text-sm text-red-600 z-50">
      {error}
      <button
        onClick={onClear}
        className="ml-2 text-red-400 hover:text-red-600"
      >
        ✕
      </button>
    </div>
  );
};

export default ErrorDisplay;
