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
      className='prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-foreground/80 prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-pre:bg-muted prose-pre:text-foreground prose-img:rounded-xl'
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
