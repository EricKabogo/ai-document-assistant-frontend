import React from 'react';
import { useDocumentStore, useOriginalDocument, useImprovedDocument } from '@/store/useStore';
import { TextDiff } from './TextDiff';

export function DocumentViewer() {
  const originalDocument = useOriginalDocument();
  const improvedDocument = useImprovedDocument();
  const { showDiff, setShowDiff } = useDocumentStore();

  if (!originalDocument || !improvedDocument) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Document Comparison</h2>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">Show differences</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showDiff}
              onChange={() => setShowDiff(!showDiff)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Document */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Original Document</h3>
            <div className="flex items-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                {originalDocument.format.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">{originalDocument.name}</span>
            </div>
          </div>
          <div className="p-4 bg-white h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-gray-500">{originalDocument.content}</pre>
          </div>
        </div>

        {/* Improved Document */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-green-50 px-4 py-2 border-b flex justify-between items-center">
            <h3 className="font-medium text-green-700">Improved Document</h3>
            <span className="text-xs text-green-500">Enhanced Version</span>
          </div>
          <div className="p-4 bg-white h-96 overflow-y-auto">
            {showDiff ? (
              <TextDiff
                original={originalDocument.content}
                improved={improvedDocument.content}
              />
            ) : (
              <pre className="whitespace-pre-wrap text-gray-700">{improvedDocument.content}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}