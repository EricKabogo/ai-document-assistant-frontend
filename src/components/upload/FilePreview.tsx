import React from 'react';
import { Document } from '@/types';
import { DocumentTextIcon, DocumentIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

interface FilePreviewProps {
  document: Document;
}

export function FilePreview({ document }: FilePreviewProps) {
  const formatIcon = () => {
    switch (document.format) {
      case 'txt':
        return <DocumentTextIcon className="h-6 w-6 text-blue-500" />;
      case 'docx':
        return <DocumentIcon className="h-6 w-6 text-blue-600" />;
      case 'pdf':
        return <DocumentArrowDownIcon className="h-6 w-6 text-red-500" />;
      default:
        return <DocumentTextIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center">
        {formatIcon()}
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">{document.name}</p>
          <p className="text-xs text-gray-500">
            {document.format.toUpperCase()} • {formatSize(document.size)}
          </p>
        </div>
      </div>
    </div>
  );
}