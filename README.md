# AI Document Assistant

A modern web application for document improvement with AI-powered suggestions.

## Features

- **Upload Component**: Upload documents in .txt, .docx, and .pdf formats
- **Document Viewer**: View original and improved documents side by side
- **Suggestion Interface**: Review, accept, or reject AI-powered suggestions
- **State Management**: Fully responsive state management using Zustand

## Tech Stack

- **Next.js**: React framework for production
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **React Dropzone**: File uploads
- **Diff**: Text comparison
- **Mammoth**: DOCX parsing
- **PDF.js**: PDF parsing

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
``` bash
   git clone https://github.com/EricKabogo/ai-document-assistant-frontend.git
   cd ai-document-assistant
```

2. Install dependencies:
``` bash
    npm install
```

3. Run the development server:
``` bash
    npm run dev
```

4. Open http://localhost:3000 with your browser to see the result.


## Project Structure
```bash

├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   │   ├── suggestions/    # Suggestion-related components
│   │   ├── ui/             # UI components
│   │   ├── upload/         # Upload-related components
│   │   └── viewer/         # Document viewer components
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand store
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── tests/                  # Test files
```

##User Guide
###Uploading a Document

1. Drag and drop a document onto the upload area or click to browse files
2. Supported formats: .txt, .docx, .pdf
3. The document will be processed and displayed in the viewer

###Reviewing Suggestions

1. Each suggestion shows the original text and the improved version
2. Click the check mark to accept a suggestion or the X to reject it
3. Use the filter dropdown to view all, pending, applied, or ignored suggestions
4. Click "Update Document with Applied Suggestions" to apply changes

###Document Comparison

1. Use the "Show differences" toggle to highlight changes between the original and improved document
2. Download either the original or improved document using the toolbar buttons

##Testing
Run the test suite:
```bash
npm run test
```