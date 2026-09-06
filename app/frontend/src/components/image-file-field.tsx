'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Field } from './field';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/**
 * Image picker with local preview. Parent uploads the file on submit.
 */
export function ImageFileField({
  label = 'Hero image',
  hint = 'JPEG, PNG or WebP up to 5MB.',
  error,
  disabled,
  onChange,
}: {
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  onChange: (file: File | null) => void;
}) {
  const [file, setFile] = useState<File | null>(null);

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;

    if (selected && !ACCEPTED_IMAGE_TYPES.includes(selected.type)) {
      toast.add({
        title: 'Unsupported image type',
        description: 'Only JPEG, PNG and WebP images are allowed.',
        type: 'error',
      });
      return;
    }

    if (selected && selected.size > MAX_IMAGE_SIZE) {
      toast.add({
        title: 'File too large',
        description: 'Maximum file size is 5MB.',
        type: 'error',
      });
      return;
    }

    setFile(selected);
    onChange(selected);
  }

  return (
    <Field label={label} hint={hint} error={error}>
      <Input
        type='file'
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        onChange={onFileChange}
        disabled={disabled}
      />
      {preview ? (
        <div className='relative aspect-11/6 w-full overflow-hidden rounded-xl bg-muted'>
          <Image
            src={preview}
            alt='Selected preview'
            fill
            unoptimized
            sizes='(max-width: 1280px) 100vw, 1100px'
            className='object-cover'
          />
        </div>
      ) : (
        <p className='text-muted-foreground text-xs'>No image selected.</p>
      )}
    </Field>
  );
}
