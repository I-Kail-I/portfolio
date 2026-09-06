'use client';

import type { ReactNode } from 'react';

/**
 * Labeled form field: label, input, hint and error in one block.
 */
export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className='space-y-1'>
      <p className='font-medium text-sm'>{label}</p>
      {children}
      <p className='text-muted-foreground text-xs'>{hint}</p>
      {error && <p className='text-destructive text-xs'>{error}</p>}
    </div>
  );
}
