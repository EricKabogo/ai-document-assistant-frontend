// src/components/upload/UploadComponent.tsx
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDocumentStore } from '@/store/useStore';
import { useFileUpload } from '@/hooks/useFileUpload';
import { DocumentArrowUpIcon, XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export function UploadComponent() {
  const { uploadStatus, errorMessage, reset } = useDocumentStore();
  const { preview, handleDrop, clearPreview } = useFileUpload();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleDrop(acceptedFiles);
    },
    [handleDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleReset = () => {
    clearPreview();
    reset();
  };

  return (
    <div className="w-full">
      {uploadStatus === 'idle' || uploadStatus === 'error' ? (
        <div
          {...getRootProps()}
          className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <input {...getInputProps()} />
          <DocumentArrowUpIcon className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-4 text-lg font-medium text-gray-900">
            {isDragActive ? 'Drop the file here' : 'Drag & drop your document here'}
          </p>
          <p className="mt-2 text-sm text-gray-500">or click to browse files</p>
          <div className="mt-2 flex justify-center space-x-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              TXT
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              DOCX
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              PDF
            </span>
          </div>

          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {errorMessage}
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Document Upload</h3>
            {uploadStatus === 'success' && (
              <button
                onClick={handleReset}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Reset"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 rounded-md">
            <DocumentTextIcon className="h-10 w-10 text-gray-400" />
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {preview ? 'Document ready' : 'Processing document...'}
              </p>
              <p className="text-xs text-gray-500">
                {uploadStatus === 'uploading'
                  ? 'Analyzing document content...'
                  : 'Document analyzed successfully'}
              </p>
            </div>
            <div className="ml-4">
              {uploadStatus === 'uploading' ? (
                <div className="flex items-center">
                  <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="text-xs text-blue-500">Processing document...</span>
                </div>
              ) : (
                <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}