'use client';

import React from 'react';

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  icon: string;
  colorClass: string;
}

export function StatBar({ label, value, max = 100, icon, colorClass }: StatBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="flex flex-col gap-1 w-full bg-white/70 backdrop-blur-xs p-2 rounded-xl border border-slate-100 shadow-xs">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
        <span className="flex items-center gap-1">
          <span>{icon}</span>
          <span>{label}</span>
        </span>
        <span className="text-[11px] font-mono text-slate-500">{value}/{max}</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
