// src/components/viewer/__tests__/TextDiff.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextDiff } from '../TextDiff';

describe('TextDiff', () => {
  it('highlights added text in green', () => {
    render(
      <TextDiff 
        original="This is a test." 
        improved="This is a better test." 
      />
    );
    
    // Check that both the original and improved text parts are rendered
    expect(screen.getByText('This is a')).toBeInTheDocument();
    expect(screen.getByText('better')).toBeInTheDocument();
    expect(screen.getByText('test.')).toBeInTheDocument();
    
    // Check that the added word has the right class
    const addedText = screen.getByText('better');
    expect(addedText).toHaveClass('bg-green-100');
    expect(addedText).toHaveClass('text-green-800');
  });

  it('highlights removed text in red with strikethrough', () => {
    render(
      <TextDiff 
        original="This is a very long test." 
        improved="This is a test." 
      />
    );
    
    // Check that the removed words have the right classes
    const removedText = screen.getByText('very long');
    expect(removedText).toHaveClass('bg-red-100');
    expect(removedText).toHaveClass('text-red-800');
    expect(removedText).toHaveClass('line-through');
  });

  it('renders unchanged text normally', () => {
    render(
      <TextDiff 
        original="This text is the same." 
        improved="This text is the same." 
      />
    );
    
    // Check that the unchanged text has no special classes
    const text = screen.getByText('This text is the same.');
    expect(text).not.toHaveClass('bg-green-100');
    expect(text).not.toHaveClass('bg-red-100');
    expect(text).not.toHaveClass('line-through');
  });
});