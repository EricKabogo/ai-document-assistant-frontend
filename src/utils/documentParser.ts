// src/utils/documentParser.ts
import mammoth from 'mammoth';
import pdfToText from 'react-pdftotext';

export async function parseDocumentContent(file: File): Promise<string> {
  const fileType = file.type;
  
  // Handle different file types
  if (fileType === 'text/plain') {
    return parseTextFile(file);
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return parseDocxFile(file);
  } else if (fileType === 'application/pdf') {
    return parsePdfFile(file);
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }
}

// Parse .txt files
async function parseTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        resolve(event.target?.result as string || '');
      } catch (error) {
        reject(new Error('Failed to parse text file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading text file'));
    };
    
    reader.readAsText(file);
  });
}

// Parse .docx files
async function parseDocxFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        if (!event.target || !event.target.result) {
          throw new Error('Failed to read DOCX file');
        }
        
        const arrayBuffer = event.target.result as ArrayBuffer;
        
        try {
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (mammothError) {
          console.error('Mammoth error:', mammothError);
          reject(new Error('Failed to parse DOCX file content'));
        }
      } catch (error) {
        console.error('DOCX processing error:', error);
        reject(new Error('Failed to process DOCX file'));
      }
    };
    
    reader.onerror = (event) => {
      console.error('FileReader error:', event);
      reject(new Error('Error reading DOCX file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

// Parse .pdf files using only react-pdftotext
async function parsePdfFile(file: File): Promise<string> {
  try {
    console.log('Parsing PDF file with react-pdftotext:', file.name);
    
    // Use react-pdftotext as shown in the Stack Overflow example
    const text = await pdfToText(file);
    
    // Check if we got any text
    if (!text || text.trim() === '') {
      return '[This PDF appears to contain scanned images rather than text. OCR processing would be required to extract text content.]';
    }
    
    console.log('PDF parsing completed successfully with react-pdftotext');
    return text;
  } catch (error) {
    console.error('PDF processing error with react-pdftotext:', error);
    throw new Error('Failed to parse PDF file. The file may be corrupted or in an unsupported format.');
  }
}