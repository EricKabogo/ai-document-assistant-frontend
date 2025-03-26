'use client';

import React from 'react';
import { useDocumentStore, useUploadStatus, useErrorMessage } from '@/store/useStore';
import { UploadComponent } from '@/components/upload/UploadComponent';
import { DocumentViewer } from '@/components/viewer/DocumentViewer';
import { DocumentToolbar } from '@/components/viewer/DocumentToolbar';
import { SuggestionsPanel } from '@/components/suggestions/SuggestionsPanel';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { useFileUpload } from '@/hooks/useFileUpload';

export default function Home() {
  const uploadStatus = useUploadStatus();
  const errorMessage = useErrorMessage();
  const { loadingMessage } = useFileUpload();
  const { setErrorMessage } = useDocumentStore();
  
  return (
    <main className="min-h-screen p-6 md:p-12 bg-gray-50">
      {uploadStatus === 'uploading' && loadingMessage && (
        <LoadingOverlay message={loadingMessage} />
      )}
      
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Document Assistant</h1>
          <p className="text-gray-600 mt-2">Upload your document to receive AI-powered improvement suggestions</p>
        </header>
        
        {errorMessage && (
          <ErrorAlert 
            message={errorMessage} 
            onDismiss={() => setErrorMessage(null)} 
          />
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {uploadStatus !== 'success' ? (
            <UploadComponent />
          ) : (
            <>
              <DocumentToolbar />
              <DocumentViewer />
              <SuggestionsPanel />
            </>
          )}
        </div>
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>AI Document Assistant &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  );
}