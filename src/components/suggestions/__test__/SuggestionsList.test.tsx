// src/components/suggestions/__tests__/SuggestionsList.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SuggestionsList } from '../SuggestionsList';
import { useDocumentStore } from '@/store/useStore';

jest.mock('@/store/useStore', () => ({
  useDocumentStore: jest.fn()
}));

describe('SuggestionsList', () => {
  const mockSuggestions = [
    {
      id: 'suggestion-1',
      documentId: 'doc-id',
      originalText: 'original text 1',
      improvedText: 'improved text 1',
      type: 'grammar' as const,
      position: { start: 0, end: 13 }
    },
    {
      id: 'suggestion-2',
      documentId: 'doc-id',
      originalText: 'original text 2',
      improvedText: 'improved text 2',
      type: 'clarity' as const,
      position: { start: 15, end: 28 },
      accepted: true
    },
    {
      id: 'suggestion-3',
      documentId: 'doc-id',
      originalText: 'original text 3',
      improvedText: 'improved text 3',
      type: 'style' as const,
      position: { start: 30, end: 43 },
      accepted: false
    }
  ];

  beforeEach(() => {
    (useDocumentStore as unknown as jest.Mock).mockReturnValue({
      suggestions: mockSuggestions
    });
  });

  it('renders all suggestions by default', () => {
    render(<SuggestionsList />);
    
    expect(screen.getByText('original text 1')).toBeInTheDocument();
    expect(screen.getByText('original text 2')).toBeInTheDocument();
    expect(screen.getByText('original text 3')).toBeInTheDocument();
  });

  it('filters suggestions when filter is changed', () => {
    render(<SuggestionsList />);
    
    // Filter to show only pending suggestions
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'pending' } });
    expect(screen.getByText('original text 1')).toBeInTheDocument();
    expect(screen.queryByText('original text 2')).not.toBeInTheDocument();
    expect(screen.queryByText('original text 3')).not.toBeInTheDocument();
    
    // Filter to show only applied suggestions
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'applied' } });
    expect(screen.queryByText('original text 1')).not.toBeInTheDocument();
    expect(screen.getByText('original text 2')).toBeInTheDocument();
    expect(screen.queryByText('original text 3')).not.toBeInTheDocument();
    
    // Filter to show only ignored suggestions
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ignored' } });
    expect(screen.queryByText('original text 1')).not.toBeInTheDocument();
    expect(screen.queryByText('original text 2')).not.toBeInTheDocument();
    expect(screen.getByText('original text 3')).toBeInTheDocument();
  });

  it('shows a message when no suggestions match the filter', () => {
    (useDocumentStore as unknown as jest.Mock).mockReturnValue({
      suggestions: [mockSuggestions[0]] // Only one pending suggestion
    });
    
    render(<SuggestionsList />);
    
    // Filter to show only applied suggestions
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'applied' } });
    expect(screen.getByText('No suggestions match the selected filter.')).toBeInTheDocument();
  });

  it('shows a message when there are no suggestions', () => {
    (useDocumentStore as unknown as jest.Mock).mockReturnValue({
      suggestions: []
    });
    
    render(<SuggestionsList />);
    
    expect(screen.getByText('No suggestions available for this document.')).toBeInTheDocument();
  });
});