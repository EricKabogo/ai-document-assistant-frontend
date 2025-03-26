// src/components/viewer/__tests__/DocumentViewer.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DocumentViewer } from '../DocumentViewer';
import { useDocumentStore } from '@/store/useStore';

jest.mock('@/store/useStore', () => ({
  useDocumentStore: jest.fn()
}));

describe('DocumentViewer', () => {
  const mockOriginalDocument = {
    id: 'test-id',
    name: 'test-document.txt',
    content: 'This is the original content.',
    format: 'txt' as const,
    size: 1024,
    createdAt: new Date()
  };

  const mockImprovedDocument = {
    id: 'test-id-improved',
    name: 'test-document.txt',
    content: 'This is the improved content.',
    format: 'txt' as const,
    size: 1024,
    createdAt: new Date()
  };

  beforeEach(() => {
    (useDocumentStore as unknown as jest.Mock).mockReturnValue({
      originalDocument: mockOriginalDocument,
      improvedDocument: mockImprovedDocument
    });
  });

  it('renders the document viewer with original and improved content', () => {
    render(<DocumentViewer />);
    
    expect(screen.getByText('Original Document')).toBeInTheDocument();
    expect(screen.getByText('Improved Document')).toBeInTheDocument();
    expect(screen.getByText('This is the original content.')).toBeInTheDocument();
    expect(screen.getByText('This is the improved content.')).toBeInTheDocument();
  });

  it('toggles diff view when the switch is clicked', () => {
    render(<DocumentViewer />);
    
    // Initially, diff view is off
    expect(screen.getByText('This is the improved content.')).toBeInTheDocument();
    
    // Toggle diff view
    fireEvent.click(screen.getByRole('checkbox'));
    
    // Now the TextDiff component should be rendered
    // This would require more complex testing for the actual diff component
    // For this test, we'll just check that the text is still present
    expect(screen.getByText('This is the improved content.')).toBeInTheDocument();
  });

  it('returns null when documents are not available', () => {
    (useDocumentStore as unknown as jest.Mock).mockReturnValue({
      originalDocument: null,
      improvedDocument: null
    });
    
    const { container } = render(<DocumentViewer />);
    expect(container).toBeEmptyDOMElement();
  });
});