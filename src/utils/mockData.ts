// src/utils/mockData.ts (update the existing file)
import { Document, Suggestion } from '@/types';
import { generateUniqueId } from './fileUtils';

export const createMockDocument = (override: Partial<Document> = {}): Document => {
  return {
    id: generateUniqueId(),
    name: 'sample-document.txt',
    content: 'This is a sample document content for testing purposes.',
    format: 'txt',
    size: 1024,
    createdAt: new Date(),
    ...override
  };
};

export const createMockImprovedDocument = (original: Document): Document => {
  return {
    ...original,
    id: original.id + '-improved',
    content: 'This is an improved sample document content for testing purposes.'
  };
};

export const generateMockSuggestions = (document: Document): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  const content = document.content;
  
  // Find common grammar mistakes
  const grammarPatterns = [
    { regex: /\b(i)\b/g, type: 'grammar', improved: 'I' },
    { regex: /\b(dont|doesnt|isnt|arent|cant|wont|shouldnt)\b/g, type: 'grammar', improved: (match: string) => match.charAt(0) + "o" + match.charAt(1) + "'" + match.slice(2) },
    { regex: /\b(its)\b(?= (a|the|my|your|their|our))/g, type: 'grammar', improved: "it's" },
    { regex: /\b(effect)\b(?= (of|on|to))/g, type: 'grammar', improved: "affect" },
    { regex: /\b(your)\b(?= (going|supposed|able))/g, type: 'grammar', improved: "you're" },
  ];
  
  // Find style improvements
  const stylePatterns = [
    { regex: /\b(very)\b/g, type: 'style', improved: 'extremely' },
    { regex: /\b(good)\b/g, type: 'style', improved: 'excellent' },
    { regex: /\b(bad)\b/g, type: 'style', improved: 'poor' },
    { regex: /\b(big)\b/g, type: 'style', improved: 'substantial' },
    { regex: /\b(small)\b/g, type: 'style', improved: 'minimal' },
  ];
  
  // Find clarity improvements
  const clarityPatterns = [
    { regex: /\b(this)\b(?= (is|was|will|can|could|would|should))/g, type: 'clarity', improved: (match: string, position: number) => {
      // Try to find a noun before this position to be more specific
      const previousText = content.substring(Math.max(0, position - 30), position);
      const nouns = previousText.match(/\b([A-Z][a-z]+|[a-z]+)\b/g);
      return nouns ? `this ${nouns[nouns.length - 1]}` : 'this';
    }},
    { regex: /\b(thing|things)\b/g, type: 'clarity', improved: 'item' },
    { regex: /\b(they)\b(?! (are|were|will|can|could|would|should))/g, type: 'clarity', improved: 'the team' },
  ];
  
  const allPatterns = [...grammarPatterns, ...stylePatterns, ...clarityPatterns];
  
  // Find all matches
  allPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.regex.exec(content)) !== null) {
      const originalText = match[0];
      let improvedText;
      
      if (typeof pattern.improved === 'function') {
        improvedText = pattern.improved(originalText, match.index);
      } else {
        improvedText = pattern.improved;
      }
      
      if (originalText !== improvedText) {
        suggestions.push({
          id: generateUniqueId(),
          documentId: document.id,
          originalText,
          improvedText,
          type: pattern.type as any,
          position: {
            start: match.index,
            end: match.index + originalText.length
          }
        });
      }
    }
  });
  
  // If no suggestions were found, add some examples
  if (suggestions.length === 0) {
    suggestions.push({
      id: generateUniqueId(),
      documentId: document.id,
      originalText: 'sample',
      improvedText: 'example',
      type: 'style',
      position: { start: content.indexOf('sample'), end: content.indexOf('sample') + 6 }
    });
    
    suggestions.push({
      id: generateUniqueId(),
      documentId: document.id,
      originalText: 'document',
      improvedText: 'manuscript',
      type: 'style',
      position: { start: content.indexOf('document'), end: content.indexOf('document') + 8 }
    });
    
    suggestions.push({
      id: generateUniqueId(),
      documentId: document.id,
      originalText: 'testing',
      improvedText: 'evaluation',
      type: 'clarity',
      position: { start: content.indexOf('testing'), end: content.indexOf('testing') + 7 }
    });
  }
  
  return suggestions;
};