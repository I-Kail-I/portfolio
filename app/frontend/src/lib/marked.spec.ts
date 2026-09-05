import { describe, expect, it } from 'bun:test';
import { markdownToHtml } from './marked';

describe('markdownToHtml', () => {
  it('converts heading markdown', async () => {
    const html = await markdownToHtml('# Hi');
    expect(html).toContain('<h1>Hi</h1>');
  });

  it('converts bold and links', async () => {
    const html = await markdownToHtml('**bold** and [text](https://example.com)');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('href="https://example.com"');
  });

  it('renders GFM tables by default', async () => {
    const html = await markdownToHtml('| a | b |\n|---|---|\n| 1 | 2 |');
    expect(html).toContain('<table>');
  });

  it('strips script tags', async () => {
    const html = await markdownToHtml('<script>alert(1)</script><p>ok</p>');
    expect(html).not.toContain('<script>');
    expect(html).toContain('<p>ok</p>');
  });

  it('strips event handlers but keeps safe attrs', async () => {
    const html = await markdownToHtml('<img src="x" onerror="alert(1)">');
    expect(html).toContain('src="x"');
    expect(html).not.toContain('onerror');
  });

  it('strips javascript: hrefs', async () => {
    const html = await markdownToHtml('[x](javascript:alert(1))');
    expect(html).not.toContain('javascript:');
  });

  it('returns empty string for empty input', async () => {
    expect(await markdownToHtml('')).toBe('');
  });

  it('does not mutate shared instance when options passed', async () => {
    await markdownToHtml('| a |\n|---|\n| 1 |', { gfm: false });
    const html = await markdownToHtml('| a |\n|---|\n| 1 |');
    expect(html).toContain('<table>');
  });
});
