// src/components/suggestions/__tests__/SuggestionItem.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SuggestionItem } from '../SuggestionItem';
import { useDocumentStore } from '@/store/useStore';

jest.mock('@/store/useStore', () => ({
  useDocumentStore: jest.fn()
}));

describe('SuggestionItem', () => {
  const mockSuggestion = {
    id: 'test-id',
    documentId: 'doc-id',
    originalText: 'original text',
    improvedText: 'improved text',
    type: 'grammar' as const,
    position: { start: 0, end: 13 }
  };

  beforeEach(() => {
    (useDocumentStore as unknown as jest.Mock).mockReturnValue({
      acceptSuggestion: jest.fn(),
      rejectSuggestion: jest.fn()
    });
  });

  it('renders the suggestion item correctly', () => {
    render(<SuggestionItem suggestion={mockSuggestion} />);
    
    expect(screen.getByText('Grammar')).toBeInTheDocument();
    expect(screen.getByText('original text')).toBeInTheDocument();
    expect(screen.getByText('improved text')).toBeInTheDocument();
  });

  it('calls acceptSuggestion when accept button is clicked', () => {
    const mockAcceptSuggestion = jest.fn();
    (useDocumentStore as unknown as jest.Mock).mockReturnValue({
      acceptSuggestion: mockAcceptSuggestion,
      rejectSuggestion: jest.fn()
    });
    
    render(<SuggestionItem suggestion={mockSuggestion} />);
    
    fireEvent.click(screen.getByLabelText('Accept suggestion'));
    expect(mockAcceptSuggestion).toHaveBeenCalledWith('test-id');
  });

  it('calls rejectSuggestion when reject button is clicked', () => {
    const mockRejectSuggestion = jest.fn();
    (useDocumentStore as unknown as jest.Mock).mockReturnValue({
      acceptSuggestion: jest.fn(),
      rejectSuggestion: mockRejectSuggestion
    });
    
    render(<SuggestionItem suggestion={mockSuggestion} />);
    
    fireEvent.click(screen.getByLabelText('Reject suggestion'));
    expect(mockRejectSuggestion).toHaveBeenCalledWith('test-id');
  });

  it('shows Applied status for accepted suggestions', () => {
    const acceptedSuggestion = { ...mockSuggestion, accepted: true };
    
    render(<SuggestionItem suggestion={acceptedSuggestion} />);
    
    expect(screen.getByText('Applied')).toBeInTheDocument();
    expect(screen.queryByLabelText('Accept suggestion')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Reject suggestion')).not.toBeInTheDocument();
  });

  it('shows Ignored status for rejected suggestions', () => {
    const rejectedSuggestion = { ...mockSuggestion, accepted: false };
    
    render(<SuggestionItem suggestion={rejectedSuggestion} />);
    
    expect(screen.getByText('Ignored')).toBeInTheDocument();
    expect(screen.queryByLabelText('Accept suggestion')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Reject suggestion')).not.toBeInTheDocument();
  });
});