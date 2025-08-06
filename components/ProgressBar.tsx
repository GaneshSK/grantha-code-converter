
import React from 'react';

interface ProgressBarProps {
  processed: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ processed, total }) => {
  if (total === 0) return null;

  const percentage = total > 0 ? (processed / total) * 100 : 0;

  return (
    <div className="w-full bg-slate-200 rounded-full h-4 my-4 overflow-hidden shadow-inner">
      <div
        className="bg-brand-secondary h-4 rounded-full transition-all duration-500 ease-out flex items-center justify-end"
        style={{ width: `${percentage}%` }}
      >
        <span className="text-xs font-medium text-white px-2">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
