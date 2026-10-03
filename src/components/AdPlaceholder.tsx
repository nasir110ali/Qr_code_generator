import React from 'react';

interface AdPlaceholderProps {
  slot: 'leaderboard' | 'rectangle' | 'banner';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ slot, className = '' }) => {
  if (slot === 'leaderboard') {
    return (
      <div className={`w-full max-w-4xl mx-auto my-6 px-4 ${className}`}>
        <div className="relative border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 text-center overflow-hidden transition-all duration-200">
          <div className="absolute top-2 right-3 text-[10px] uppercase tracking-wider font-semibold text-slate-500 bg-slate-200/60 dark:bg-slate-800/80 px-2 py-0.5 rounded">
            Advertisement
          </div>
          <div className="h-20 sm:h-24 flex flex-col items-center justify-center gap-1">
            <span className="text-xs font-medium text-slate-500">
              Advertisement Space (728 × 90 / Responsive)
            </span>
            <span className="text-[11px] text-slate-500">
              High-visibility sponsorship & display banner placement
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (slot === 'rectangle') {
    return (
      <div className={`w-full ${className}`}>
        <div className="relative border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 text-center overflow-hidden">
          <div className="absolute top-2 right-3 text-[10px] uppercase tracking-wider font-semibold text-slate-500 bg-slate-200/60 dark:bg-slate-800/80 px-2 py-0.5 rounded">
            Ad
          </div>
          <div className="h-44 sm:h-48 flex flex-col items-center justify-center gap-1.5">
            <span className="text-xs font-medium text-slate-500">
              Ad Space (300 × 250)
            </span>
            <span className="text-[11px] text-slate-500">
              Medium Rectangle Unit
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-3xl mx-auto my-4 px-4 ${className}`}>
      <div className="relative border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 rounded-xl p-3 text-center">
        <div className="text-[10px] uppercase tracking-wider font-medium text-slate-500">
          Advertisement Placement
        </div>
      </div>
    </div>
  );
};
