import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { MarkdownPreview } from './markdown-preview';

describe('MarkdownPreview', () => {
  it('renders converted markdown', async () => {
    const { container } = render(<MarkdownPreview markdown='# Hi' />);
    expect(await screen.findByRole('heading', { name: 'Hi' })).toBeInTheDocument();
    expect(container.querySelector('[data-slot="markdown-view"]')).toBeInTheDocument();
  });

  it('merges custom className', async () => {
    const { container } = render(<MarkdownPreview markdown='hi' className='custom' />);
    await screen.findByText('hi');
    const el = container.querySelector('[data-slot="markdown-view"]');
    expect(el).toHaveClass('markdown-view');
    expect(el).toHaveClass('custom');
  });

  it('sanitizes script tags', async () => {
    const { container } = render(
      <MarkdownPreview markdown='<script>alert(1)</script><p>ok</p>' />,
    );
    await screen.findByText('ok');
    expect(container.querySelector('script')).not.toBeInTheDocument();
  });
});
