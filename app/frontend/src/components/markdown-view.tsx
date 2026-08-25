import { markdownToHtml } from '@/lib/marked';
import { cn } from '@/lib/utils';

/**
 * Renders markdown as styled HTML in the browser.
 *
 * @remarks
 * An async (server) component: it converts `markdown` to HTML with
 * `markdownToHtml` (sanitized by DOMPurify) and injects it via
 * `dangerouslySetInnerHTML`, so headings, lists, and other elements render as
 * real styled nodes instead of raw text. Style the output by targeting the
 * `.markdown-view` class (see `globals.css`).
 *
 * @param markdown - The markdown source to render.
 * @param className - Optional additional classes for the root element.
 * @example
 * <MarkdownView markdown="# Hello, world!" />
 */
export async function MarkdownView({
  markdown,
  className,
}: {
  markdown: string;
  className?: string;
}) {
  const html = await markdownToHtml(markdown);
  return (
    <div
      data-slot='markdown-view'
      className={cn('markdown-view', className)}
      // this already sanitized with DomPurifier
      // biome-ignore lint/security/noDangerouslySetInnerHtml: html is sanitized by DOMPurify in markdownToHtml
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
