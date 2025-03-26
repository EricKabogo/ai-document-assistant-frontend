// src/components/suggestions/SuggestionItem.tsx
import React from 'react';
import { Suggestion } from '@/types';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDocumentStore } from '@/store/useStore';

interface SuggestionItemProps {
  suggestion: Suggestion;
}

export function SuggestionItem({ suggestion }: SuggestionItemProps) {
  const { acceptSuggestion, rejectSuggestion, undoSuggestion } = useDocumentStore();
  
  // Get badge color based on suggestion type
  const getBadgeColor = () => {
    switch (suggestion.type) {
      case 'grammar':
        return 'bg-blue-100 text-blue-800';
      case 'clarity':
        return 'bg-purple-100 text-purple-800';
      case 'style':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`p-4 border rounded-lg mb-3 ${
      suggestion.accepted === true 
        ? 'bg-green-50 border-green-200' 
        : suggestion.accepted === false 
        ? 'bg-gray-50 border-gray-200' 
        : 'bg-white'
    }`}>
      <div className="flex justify-between items-start">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor()}`}>
          {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
        </span>
        
        {suggestion.accepted === undefined && (
          <div className="flex space-x-2">
            <button
              onClick={() => acceptSuggestion(suggestion.id)}
              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              aria-label="Accept suggestion"
            >
              <CheckIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => rejectSuggestion(suggestion.id)}
              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              aria-label="Reject suggestion"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {suggestion.accepted !== undefined && (
          <div className="flex items-center">
            {suggestion.accepted === true && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                Applied
              </span>
            )}
            
            {suggestion.accepted === false && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                Ignored
              </span>
            )}
            
            <button
              onClick={() => undoSuggestion(suggestion.id)}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Undo
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-3">
        <div className="text-sm text-gray-700 mb-1">
          <span className="font-medium">Original:</span>
          <span className="ml-2 text-red-600 line-through">{suggestion.originalText}</span>
        </div>
        <div className="text-sm">
          <span className="font-medium">Improved:</span>
          <span className="ml-2 text-green-600">{suggestion.improvedText}</span>
        </div>
      </div>
    </div>
  );
}