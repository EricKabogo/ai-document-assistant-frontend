// src/components/suggestions/ProgressStats.tsx
import React from 'react';
import { useSuggestions } from '@/store/useStore';

export function ProgressStats() {
  const suggestions = useSuggestions();
  
  const total = suggestions.length;
  const applied = suggestions.filter(s => s.accepted === true).length;
  const rejected = suggestions.filter(s => s.accepted === false).length;
  const pending = total - applied - rejected;
  
  const progress = total > 0 ? Math.round(((applied + rejected) / total) * 100) : 0;
  
  return (
    <div className="mt-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Suggestion Progress</span>
        <span className="text-sm text-gray-500">{progress}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>{pending} pending</span>
        <span>{applied} applied</span>
        <span>{rejected} ignored</span>
      </div>
    </div>
  );
}