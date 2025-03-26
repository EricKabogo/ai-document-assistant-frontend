// src/utils/documentParser.ts
import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker (needed for PDF parsing)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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

// Parse .pdf files
async function parsePdfFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const pdf = await pdfjs.getDocument(arrayBuffer).promise;
        
        let fullText = '';
        
        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          
          fullText += pageText + '\n\n';
        }
        
        resolve(fullText);
      } catch (error) {
        reject(new Error('Failed to parse PDF file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading PDF file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}