'use client';

import { useEffect, useState } from 'react';
import { markdownToHtml } from '@/lib/marked';
import { cn } from '@/lib/utils';

/**
 * Client-side markdown preview. Server components can use `MarkdownView`
 * directly; client sections use this (same `markdown-view` styles).
 */
export function MarkdownPreview({
  markdown,
  className,
}: {
  markdown: string;
  className?: string;
}) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    let cancelled = false;
    markdownToHtml(markdown).then((result) => {
      if (!cancelled) setHtml(result);
    });
    return () => {
      cancelled = true;
    };
  }, [markdown]);

  return (
    <div
      data-slot='markdown-view'
      className={cn('markdown-view', className)}
      // sanitized by DOMPurify in markdownToHtml
      // biome-ignore lint/security/noDangerouslySetInnerHtml: html is sanitized by DOMPurify in markdownToHtml
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
