// src/components/upload/__tests__/UploadComponent.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UploadComponent } from '../UploadComponent';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useDocumentStore } from '@/store/useStore';
import { useDropzone } from 'react-dropzone';

jest.mock('@/hooks/useFileUpload', () => ({
  useFileUpload: jest.fn()
}));

jest.mock('@/store/useStore', () => ({
  useDocumentStore: jest.fn()
}));

jest.mock('react-dropzone', () => ({
  useDropzone: jest.fn()
}));

describe('UploadComponent', () => {
  beforeEach(() => {
    // Set up mock implementations with proper type casting
    (useFileUpload as unknown as jest.Mock).mockReturnValue({
      preview: null,
      handleDrop: jest.fn(),
      clearPreview: jest.fn(),
    });
    
    (useDocumentStore as unknown as jest.Mock).mockReturnValue({
      uploadStatus: 'idle',
      errorMessage: null,
      reset: jest.fn(),
    });

    (useDropzone as unknown as jest.Mock).mockReturnValue({
      getRootProps: () => ({}),
      getInputProps: () => ({}),
      isDragActive: false
    });
  });

  it('renders the upload area in idle state', () => {
    render(<UploadComponent />);
    
    expect(screen.getByText(/Drag & drop your document here/i)).toBeInTheDocument();
    expect(screen.getByText(/Supported formats: .txt, .docx, .pdf/i)).toBeInTheDocument();
  });

  it('shows an error message when present', () => {
    (useDocumentStore as unknown as jest.Mock).mockReturnValue({
      uploadStatus: 'error',
      errorMessage: 'Test error message',
      reset: jest.fn(),
    });
    
    render(<UploadComponent />);
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('shows loading state during upload', () => {
    (useDocumentStore as unknown as jest.Mock).mockReturnValue({
      uploadStatus: 'uploading',
      errorMessage: null,
      reset: jest.fn(),
    });
    
    render(<UploadComponent />);
    
    expect(screen.getByText(/Processing document.../i)).toBeInTheDocument();
    expect(screen.getByText(/Analyzing document content.../i)).toBeInTheDocument();
  });

  it('shows success state after upload', () => {
    (useDocumentStore as unknown as jest.Mock).mockReturnValue({
      uploadStatus: 'success',
      errorMessage: null,
      reset: jest.fn(),
    });
    
    render(<UploadComponent />);
    
    expect(screen.getByText(/Document analyzed successfully/i)).toBeInTheDocument();
  });
});