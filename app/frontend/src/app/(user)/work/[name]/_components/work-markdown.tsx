'use client';

import { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

type Props = {
  content: string;
};

export function WorkMarkdown({ content }: Props) {
  const html = useMemo(() => {
    const raw = marked.parse(content, { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [content]);

  return (
    <div
      className='prose prose-zinc dark:prose-invert max-w-none prose-code:rounded prose-img:rounded-xl prose-code:bg-muted prose-pre:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-headings:font-semibold prose-a:text-foreground prose-code:text-sm prose-h1:text-3xl prose-h2:text-2xl prose-pre:text-foreground prose-headings:tracking-tight prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-foreground/80'
      // biome-ignore lint/security/noDangerouslySetInnerHtml: this is safe because we sanitize the content
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
