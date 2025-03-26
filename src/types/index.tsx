export interface Document {
    id: string;
    name: string;
    content: string;
    format: 'txt' | 'docx' | 'pdf';
    size: number;
    createdAt: Date;
  }

  export interface Suggestion {
    id: string;
    documentId: string;
    originalText: string;
    improvedText: string;
    type: 'grammar' | 'clarity' | 'style' | 'other';
    position: {
      start: number;
      end: number;
    };
    accepted?: boolean;
  }

  export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';