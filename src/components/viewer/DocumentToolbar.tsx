// src/components/viewer/DocumentToolbar.tsx
import React from 'react';
import { DocumentTextIcon, ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useDocumentStore } from '@/store/useStore';

export function DocumentToolbar() {
  const { originalDocument, reset } = useDocumentStore();
  
  if (!originalDocument) return null;

  const handleDownloadOriginal = () => {
    const blob = new Blob([originalDocument.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = originalDocument.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadImproved = () => {
    const { improvedDocument } = useDocumentStore.getState();
    if (!improvedDocument) return;

    const blob = new Blob([improvedDocument.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `improved-${originalDocument.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex space-x-2 mb-4">
      <button
        onClick={handleDownloadOriginal}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <DocumentTextIcon className="h-4 w-4 mr-2" />
        Download Original
      </button>
      <button
        onClick={handleDownloadImproved}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
        Download Improved
      </button>
      <button
        onClick={reset}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <ArrowPathIcon className="h-4 w-4 mr-2" />
        New Document
      </button>
    </div>
  );
}