// src/store/useStore.ts
import { create } from 'zustand';
import { Document, Suggestion, UploadStatus } from '@/types';
import { generateUniqueId } from '@/utils/fileUtils';

// Define selectors for better performance
const selectOriginalDocument = (state: DocumentState) => state.originalDocument;
const selectImprovedDocument = (state: DocumentState) => state.improvedDocument;
const selectSuggestions = (state: DocumentState) => state.suggestions;
const selectUploadStatus = (state: DocumentState) => state.uploadStatus;
const selectErrorMessage = (state: DocumentState) => state.errorMessage;

interface DocumentState {
  // State
  originalDocument: Document | null;
  improvedDocument: Document | null;
  suggestions: Suggestion[];
  uploadStatus: UploadStatus;
  errorMessage: string | null;
  showDiff: boolean;
  
  // Actions
  setOriginalDocument: (document: Document | null) => void;
  setImprovedDocument: (document: Document | null) => void;
  setSuggestions: (suggestions: Suggestion[]) => void;
  setUploadStatus: (status: UploadStatus) => void;
  setErrorMessage: (message: string | null) => void;
  setShowDiff: (show: boolean) => void;
  acceptSuggestion: (id: string) => void;
  rejectSuggestion: (id: string) => void;
  acceptAllSuggestions: () => void;
  rejectAllSuggestions: () => void;
  applyAcceptedSuggestions: () => void;
  undoSuggestion: (id: string) => void;
  reset: () => void;
  
  // Utility functions
  generateMockData: () => void;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  // Initial state
  originalDocument: null,
  improvedDocument: null,
  suggestions: [],
  uploadStatus: 'idle',
  errorMessage: null,
  showDiff: false,
  
  // State setters
  setOriginalDocument: (document) => set({ originalDocument: document }),
  setImprovedDocument: (document) => set({ improvedDocument: document }),
  setSuggestions: (suggestions) => set({ suggestions }),
  setUploadStatus: (uploadStatus) => set({ uploadStatus }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  setShowDiff: (showDiff) => set({ showDiff }),
  
  // Suggestion actions
  acceptSuggestion: (id) => set((state) => ({
    suggestions: state.suggestions.map(suggestion => 
      suggestion.id === id ? { ...suggestion, accepted: true } : suggestion
    )
  })),
  
  rejectSuggestion: (id) => set((state) => ({
    suggestions: state.suggestions.map(suggestion => 
      suggestion.id === id ? { ...suggestion, accepted: false } : suggestion
    )
  })),
  
  undoSuggestion: (id) => set((state) => ({
    suggestions: state.suggestions.map(suggestion => 
      suggestion.id === id ? { ...suggestion, accepted: undefined } : suggestion
    )
  })),
  
  acceptAllSuggestions: () => set((state) => ({
    suggestions: state.suggestions.map(suggestion => 
      suggestion.accepted === undefined ? { ...suggestion, accepted: true } : suggestion
    )
  })),
  
  rejectAllSuggestions: () => set((state) => ({
    suggestions: state.suggestions.map(suggestion => 
      suggestion.accepted === undefined ? { ...suggestion, accepted: false } : suggestion
    )
  })),
  
  applyAcceptedSuggestions: () => {
    const state = get();
    if (!state.originalDocument || !state.improvedDocument || state.suggestions.length === 0) {
      return;
    }
    
    let content = state.originalDocument.content;
    
    // Get all accepted suggestions
    const acceptedSuggestions = state.suggestions
      .filter(s => s.accepted === true)
      .sort((a, b) => b.position.start - a.position.start); // Sort from end to start to avoid position shifts
    
    // Apply each suggestion
    acceptedSuggestions.forEach(suggestion => {
      content = content.substring(0, suggestion.position.start) + 
                suggestion.improvedText + 
                content.substring(suggestion.position.end);
    });
    
    // Update the improved document
    set({
      improvedDocument: {
        ...state.improvedDocument,
        content
      }
    });
  },
  
  // Reset function
  reset: () => set({
    originalDocument: null,
    improvedDocument: null,
    suggestions: [],
    uploadStatus: 'idle',
    errorMessage: null,
    showDiff: false
  }),
  
  // Utility functions for development/testing
  generateMockData: () => {
    const originalDoc = {
      id: generateUniqueId(),
      name: 'sample-document.txt',
      content: 'This is a sample document content for testing purposes. It contains several common grammar and style issues that the AI assistant can help to improve. For example, its important to use proper punctuation and grammar.',
      format: 'txt' as const,
      size: 1024,
      createdAt: new Date()
    };
    
    const improvedDoc = {
      ...originalDoc,
      id: originalDoc.id + '-improved',
      content: 'This is a sample document content for testing purposes. It contains several common grammar and style issues that the AI assistant can help to improve. For example, it\'s important to use proper punctuation and grammar.'
    };
    
    const suggestions = [
      {
        id: generateUniqueId(),
        documentId: originalDoc.id,
        originalText: 'its',
        improvedText: 'it\'s',
        type: 'grammar' as const,
        position: { start: 148, end: 151 }
      },
      {
        id: generateUniqueId(),
        documentId: originalDoc.id,
        originalText: 'several common',
        improvedText: 'various significant',
        type: 'style' as const,
        position: { start: 69, end: 84 }
      },
      {
        id: generateUniqueId(),
        documentId: originalDoc.id,
        originalText: 'for testing purposes',
        improvedText: 'to demonstrate functionality',
        type: 'clarity' as const,
        position: { start: 37, end: 58 }
      }
    ];
    
    set({
      originalDocument: originalDoc,
      improvedDocument: improvedDoc,
      suggestions,
      uploadStatus: 'success'
    });
  }
}));

// Export selectors for better component performance
export const useOriginalDocument = () => useDocumentStore(selectOriginalDocument);
export const useImprovedDocument = () => useDocumentStore(selectImprovedDocument);
export const useSuggestions = () => useDocumentStore(selectSuggestions);
export const useUploadStatus = () => useDocumentStore(selectUploadStatus);
export const useErrorMessage = () => useDocumentStore(selectErrorMessage);