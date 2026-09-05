import { describe, expect, it } from 'bun:test';
import { MarkdownView } from './markdown-view';

describe('MarkdownView', () => {
  it('returns markdown-view slot with converted html', async () => {
    const el = await MarkdownView({ markdown: '# Hi' });
    expect(el.props['data-slot']).toBe('markdown-view');
    expect(el.props.dangerouslySetInnerHTML.__html).toContain('<h1>Hi</h1>');
  });

  it('merges custom className', async () => {
    const el = await MarkdownView({ markdown: 'hi', className: 'custom' });
    expect(el.props.className).toContain('markdown-view');
    expect(el.props.className).toContain('custom');
  });

  it('sanitizes script tags', async () => {
    const el = await MarkdownView({ markdown: '<script>alert(1)</script><p>ok</p>' });
    const html = el.props.dangerouslySetInnerHTML.__html as string;
    expect(html).not.toContain('<script>');
    expect(html).toContain('<p>ok</p>');
  });
});
