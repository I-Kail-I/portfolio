import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { TextAnimations } from './text-animations';

describe('TextAnimations', () => {
  it('sets aria-label to full text', () => {
    render(<TextAnimations text='hello world' />);
    expect(screen.getByLabelText('hello world')).toBeInTheDocument();
  });

  it('splits words into spans', () => {
    const { container } = render(<TextAnimations text='hello world' />);
    const labelled = container.querySelector('[aria-label="hello world"]') as HTMLElement;
    expect(labelled).toBeInTheDocument();
    expect(labelled.textContent).toContain('hello');
    expect(labelled.textContent).toContain('world');
    expect(labelled.querySelectorAll(':scope > span')).toHaveLength(2);
  });

  it('handles single word without trailing space', () => {
    const { container } = render(<TextAnimations text='solo' />);
    const labelled = container.querySelector('[aria-label="solo"]') as HTMLElement;
    expect(labelled).toBeInTheDocument();
    expect(labelled.querySelectorAll(':scope > span')).toHaveLength(1);
    expect(labelled.textContent).toBe('solo');
  });
});
