// src/components/viewer/TextDiff.tsx
import React from 'react';
import { diffWords } from 'diff';

interface TextDiffProps {
  original: string;
  improved: string;
}

export function TextDiff({ original, improved }: TextDiffProps) {
  const diff = diffWords(original, improved);

  return (
    <div className="font-mono text-sm whitespace-pre-wrap">
      {diff.map((part, index) => {
        // Determine styling based on whether text was added, removed, or unchanged
        const className = part.added
          ? 'bg-green-100 text-green-800'
          : part.removed
          ? 'bg-red-100 text-red-800 line-through'
          : '';

        return (
          <span key={index} className={className}>
            {part.value}
          </span>
        );
      })}
    </div>
  );
}