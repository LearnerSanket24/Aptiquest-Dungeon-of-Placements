import React from 'react';
import { cn } from '../lib/utils';

interface StatBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  className?: string;
}

export const StatBar: React.FC<StatBarProps> = ({ label, value, maxValue, color, className }) => {
  const percentage = Math.max(0, Math.min(100, (value / maxValue) * 100));
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between mb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-white/70">{label}</span>
        <span className="text-xs font-mono text-white/90">{value} / {maxValue}</span>
      </div>
      <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/10">
        <div 
          className={cn("h-full transition-all duration-500 ease-out", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
