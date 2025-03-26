import React, { useState } from 'react';
import { useDocumentStore } from '@/store/useStore';
import { SuggestionItem } from './SuggestionItem';
import { FunnelIcon, CheckIcon } from '@heroicons/react/24/outline';

export function SuggestionsList() {
  const { suggestions } = useDocumentStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'applied' | 'ignored'>('all');
  
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No suggestions available for this document.</p>
      </div>
    );
  }

  const filteredSuggestions = suggestions.filter(suggestion => {
    if (filter === 'all') return true;
    if (filter === 'pending') return suggestion.accepted === undefined;
    if (filter === 'applied') return suggestion.accepted === true;
    if (filter === 'ignored') return suggestion.accepted === false;
    return true;
  });

  // Group suggestions by type
  const groupedSuggestions = filteredSuggestions.reduce((groups, suggestion) => {
    const type = suggestion.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(suggestion);
    return groups;
  }, {} as Record<string, typeof suggestions>);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Improvement Suggestions</h3>
        
        <div className="flex items-center">
          <FunnelIcon className="h-4 w-4 text-gray-500 mr-1" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="applied">Applied</option>
            <option value="ignored">Ignored</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-6">
        {Object.entries(groupedSuggestions).map(([type, typeSuggestions]) => (
          <div key={type}>
            <h4 className="text-md font-medium text-gray-700 mb-2 capitalize">{type} suggestions</h4>
            {typeSuggestions.map(suggestion => (
              <SuggestionItem key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        ))}
        
        {filteredSuggestions.length === 0 && (
          <div className="p-4 text-center border border-gray-200 rounded-lg">
            <p className="text-gray-500">No suggestions match the selected filter.</p>
          </div>
        )}
      </div>
      
      {filteredSuggestions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Showing {filteredSuggestions.length} of {suggestions.length} suggestions
          </span>
          
          {filter === 'pending' && filteredSuggestions.length > 0 && (
            <button
              onClick={() => filteredSuggestions.forEach(s => acceptSuggestion(s.id))}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <CheckIcon className="h-4 w-4 mr-1" />
              Apply All
            </button>
          )}
        </div>
      )}
    </div>
  );
}