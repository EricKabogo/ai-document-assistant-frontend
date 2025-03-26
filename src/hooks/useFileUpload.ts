// src/hooks/useFileUpload.ts
import { useState, useCallback } from 'react';
import { useDocumentStore } from '@/store/useStore';
import { createDocumentFromFile, getFileFormat, isValidFileType } from '@/utils/fileUtils';
import { generateMockSuggestions } from '@/utils/mockData';

export function useFileUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const { 
    setOriginalDocument, 
    setImprovedDocument,
    setSuggestions, 
    setUploadStatus, 
    setErrorMessage 
  } = useDocumentStore();
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0]; // Take only the first file
    
    // Clear any previous errors
    setErrorMessage('');
    
    // Validate file type
    if (!isValidFileType(file)) {
      setErrorMessage('Invalid file type. Please upload a .txt, .docx, or .pdf file.');
      return;
    }
    
    // Validate file size (e.g., 20MB limit)
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(`File is too large. Maximum file size is 20MB.`);
      return;
    }
    
    // Set loading state
    setUploadStatus('uploading');
    
    // Set loading message based on file type
    const format = getFileFormat(file.name);
    if (format === 'pdf') {
      setLoadingMessage('Processing PDF document. This may take a moment...');
    } else if (format === 'docx') {
      setLoadingMessage('Processing Word document...');
    } else {
      setLoadingMessage('Processing document...');
    }
    
    // Create a preview URL for the file (works for all file types)
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    
    try {
      // Convert file to document object
      const document = await createDocumentFromFile(file);
      
      // Update store with original document
      setOriginalDocument(document);
      
      setLoadingMessage('Analyzing content and generating suggestions...');
      
      // Mock API call for improved document and suggestions
      setTimeout(() => {
        try {
          // For demo purposes, we'll create a slightly improved version
          const improvedContent = document.content.replace(/\b(\w)(\w*)\b/g, function(match, first, rest) {
            return first.toUpperCase() + rest;
          });
          
          const improvedDocument = {
            ...document,
            id: document.id + '-improved',
            content: improvedContent
          };
          
          // Generate mock suggestions
          const suggestions = generateMockSuggestions(document);
          
          // Update store
          setImprovedDocument(improvedDocument);
          setSuggestions(suggestions);
          setUploadStatus('success');
          setLoadingMessage('');
        } catch (error) {
          console.error('Error processing improved document:', error);
          setErrorMessage('Error generating document improvements. Please try again.');
          setUploadStatus('error');
          setLoadingMessage('');
        }
      }, 1500);
    } catch (error: any) {
      console.error('Error processing file:', error);
      setErrorMessage(error.message || 'Error processing file. Please try again.');
      setUploadStatus('error');
      setLoadingMessage('');
    }
  }, [
    setOriginalDocument, 
    setImprovedDocument, 
    setSuggestions, 
    setUploadStatus, 
    setErrorMessage
  ]);

  const clearPreview = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  }, [preview]);

  return {
    preview,
    handleDrop,
    clearPreview,
    loadingMessage
  };
}