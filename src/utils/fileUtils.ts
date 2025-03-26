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
  
  if (extension === 'docx') {
    return 'Failed to process the DOCX file. Please ensure it is a valid Microsoft Word document.';
  } else if (extension === 'pdf') {
    return 'Failed to process the PDF file. Please ensure it is a valid PDF document.';
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
  return validTypes.includes(file.type);
};

export const createDocumentFromFile = async (file: File): Promise<Document> => {
  const format = getFileFormat(file.name);
  if (!format) {
    throw new Error('Invalid file format');
  }

  try {
    // Use our new parser to handle different file formats
    const content = await parseDocumentContent(file);
    
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
    throw new Error('Failed to process file');
  }
};