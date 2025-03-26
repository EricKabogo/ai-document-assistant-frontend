import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DocumentViewer } from '../DocumentViewer';
import { useDocumentStore, useOriginalDocument, useImprovedDocument } from '@/store/useStore';

// Mock the entire store module
jest.mock('@/store/useStore', () => ({
  useDocumentStore: jest.fn(),
  useOriginalDocument: jest.fn(),
  useImprovedDocument: jest.fn(),
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
    // Mock the selector functions
    (useOriginalDocument as unknown as jest.Mock).mockReturnValue(mockOriginalDocument);
    (useImprovedDocument as unknown as jest.Mock).mockReturnValue(mockImprovedDocument);
    
    // Mock the main store hook
    (useDocumentStore as unknown as jest.Mock).mockReturnValue({
      showDiff: false,
      setShowDiff: jest.fn()
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
    const mockSetShowDiff = jest.fn();
    (useDocumentStore as unknown as jest.Mock).mockReturnValue({
      showDiff: false,
      setShowDiff: mockSetShowDiff
    });
    
    render(<DocumentViewer />);
    
    // Find and click the toggle
    const toggle = screen.getByRole('checkbox');
    fireEvent.click(toggle);
    
    // Verify that setShowDiff was called correctly
    expect(mockSetShowDiff).toHaveBeenCalledWith(true);
  });

  it('returns null when documents are not available', () => {
    // Mock missing documents
    (useOriginalDocument as unknown as jest.Mock).mockReturnValue(null);
    (useImprovedDocument as unknown as jest.Mock).mockReturnValue(null);
    
    const { container } = render(<DocumentViewer />);
    expect(container).toBeEmptyDOMElement();
  });
});