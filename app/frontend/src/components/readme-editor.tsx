'use client';

import { cn } from '@/lib/utils';
import { MarkdownPreview } from './markdown-preview';

/**
 * Side-by-side markdown editor: textarea on the left, live preview on the right.
 */
export function ReadmeEditor({
  value,
  onChange,
  className,
  minHeightClassName = 'min-h-[320px]',
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  minHeightClassName?: string;
}) {
  return (
    <div className={cn('grid gap-4 lg:grid-cols-2', className)}>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder='Write markdown…'
        aria-label='Markdown editor'
        className={cn(
          'w-full rounded-3xl border border-input bg-transparent p-4 font-mono text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring',
          minHeightClassName,
        )}
      />
      <MarkdownPreview
        markdown={value}
        className={cn('rounded-3xl border p-4', minHeightClassName)}
      />
    </div>
  );
}
