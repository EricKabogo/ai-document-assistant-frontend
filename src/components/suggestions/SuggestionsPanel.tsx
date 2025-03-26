// src/components/suggestions/SuggestionsPanel.tsx
import React from 'react';
import { useDocumentStore, useSuggestions } from '@/store/useStore';
import { SuggestionsList } from './SuggestionsList';
import { DocumentTextIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ProgressStats } from './ProgressStats';

export function SuggestionsPanel() {
  const suggestions = useSuggestions();
  const { applyAcceptedSuggestions, acceptAllSuggestions, rejectAllSuggestions } = useDocumentStore();
  
  const pendingSuggestions = suggestions.filter(s => s.accepted === undefined);
  const appliedSuggestions = suggestions.filter(s => s.accepted === true);
  const rejectedSuggestions = suggestions.filter(s => s.accepted === false);
  
  return (
    <div className="mt-8 border rounded-lg overflow-hidden">
      <div className="bg-blue-50 px-4 py-3 border-b flex justify-between items-center">
        <h2 className="font-medium text-blue-700">Improvement Suggestions</h2>
        <div className="flex space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {pendingSuggestions.length} Pending
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {appliedSuggestions.length} Applied
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {rejectedSuggestions.length} Ignored
          </span>
        </div>
      </div>
      
      <div className="p-4">
        {suggestions.length > 0 && <ProgressStats /> ? (
          <>
            {pendingSuggestions.length > 0 && (
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={acceptAllSuggestions}
                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Accept All
                </button>
                <button
                  onClick={rejectAllSuggestions}
                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Reject All
                </button>
              </div>
            )}
            
            <SuggestionsList />
            
            {appliedSuggestions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={applyAcceptedSuggestions}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Update Document with Applied Suggestions
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No suggestions</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no improvement suggestions for this document.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}