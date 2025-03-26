// src/utils/fileUtils.ts
import { Document } from '@/types';
import { parseDocumentContent } from './documentParser';

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const getFileFormat = (fileName: string): 'txt' | 'docx' | 'pdf' | null => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension === 'txt' || extension === 'docx' || extension === 'pdf') {
    return extension as 'txt' | 'docx' | 'pdf';
  }
  return null;
};

export const getFileTypeFromFormat = (format: 'txt' | 'docx' | 'pdf'): string => {
  switch (format) {
    case 'txt': return 'text/plain';
    case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'pdf': return 'application/pdf';
    default: return 'text/plain';
  }
};

export const handleDocumentError = (error: any, fileName: string): string => {
  console.error('Document processing error:', error);
  
  // Check file extension
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  // More specific error messages based on file type and error
  if (extension === 'docx') {
    return 'Failed to process the DOCX file. Please ensure it is a valid Microsoft Word document.';
  } else if (extension === 'pdf') {
    // Check for specific PDF errors
    const errorMessage = error?.message || '';
    
    if (errorMessage.includes('password')) {
      return 'This PDF appears to be password-protected. Please remove the password and try again.';
    } else if (errorMessage.includes('corrupted') || errorMessage.includes('invalid')) {
      return 'This PDF file appears to be corrupted or invalid. Please try another file.';
    } else {
      return 'Failed to process the PDF file. Please ensure it is a valid PDF document.';
    }
  } else {
    return 'Error processing file. Please try again with a different file.';
  }
};

export const isValidFileType = (file: File): boolean => {
  const validTypes = [
    'text/plain', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
    'application/pdf'
  ];
  
  // Some browsers might report slightly different MIME types, so check by extension as a fallback
  if (validTypes.includes(file.type)) {
    return true;
  }
  
  // Fallback to extension checking
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension === 'txt' || extension === 'docx' || extension === 'pdf';
};

export const createDocumentFromFile = async (file: File): Promise<Document> => {
  const format = getFileFormat(file.name);
  if (!format) {
    throw new Error('Invalid file format');
  }

  try {
    // Parse the document content
    const content = await parseDocumentContent(file);
    
    // Validate that we got actual content
    if (!content || (content.trim() === '' && format !== 'pdf')) {
      throw new Error('The file appears to be empty or cannot be read properly.');
    }
    
    const document: Document = {
      id: generateUniqueId(),
      name: file.name,
      content,
      format,
      size: file.size,
      createdAt: new Date()
    };
    
    return document;
  } catch (error) {
    console.error('Error processing file:', error);
    
    // Use the custom error handler to get a user-friendly message
    const errorMessage = handleDocumentError(error, file.name);
    throw new Error(errorMessage);
  }
};

export const getFileSizeDescription = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} bytes`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};