import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

describe('Tooltip', () => {
  it('renders trigger inside provider', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="tooltip-trigger"]')).toBeInTheDocument();
  });

  it('renders content when open', async () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Target</TooltipTrigger>
          <TooltipContent>Tip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(await screen.findByText('Tip text')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="tooltip-content"]')).toBeInTheDocument();
  });
});
