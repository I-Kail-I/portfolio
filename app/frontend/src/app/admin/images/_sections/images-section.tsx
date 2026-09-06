'use client';

import { useState } from 'react';
import Image from 'next/image';
import { isAxiosError } from 'axios';
import { Reveal } from '@/components/reveal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import type { Image as UploadedImage } from '../images.dto';
import { useUploadImage } from '../_hooks/hook.client';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

export function ImagesSection() {
  const { mutate, isPending } = useUploadImage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<UploadedImage | null>(null);

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setUploaded(null);

    if (!selected) {
      setFile(null);
      setPreview(null);
      return;
    }

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      toast.add({
        title: 'Unsupported image type',
        description: 'Only JPEG, PNG and WebP images are allowed.',
        type: 'error',
      });
      return;
    }

    if (selected.size > MAX_SIZE) {
      toast.add({
        title: 'File too large',
        description: 'Maximum file size is 5MB.',
        type: 'error',
      });
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;

    mutate(file, {
      onSuccess: (image) => {
        setUploaded(image);
        toast.add({ title: 'Image uploaded', description: image.file_name, type: 'success' });
      },
      onError: (error) => {
        const msg = isAxiosError<{ message?: string | string[] }>(error)
          ? [error.response?.data?.message].flat().filter(Boolean).join(', ') || error.message
          : error instanceof Error
            ? error.message
            : 'Unknown error';
        toast.add({ title: 'Upload failed', description: msg, type: 'error' });
      },
    });
  }

  return (
    <div className='min-h-screen'>
      <div className='container mx-auto py-10'>
        <Reveal>
          <div>
            <h1 className='font-semibold text-4xl sm:text-5xl'>Images</h1>
            <p className='mt-2 text-lg text-muted-foreground'>
              Upload JPEG, PNG or WebP files up to 5MB.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05} className='mt-10'>
          <Card className='mx-auto w-full max-w-md'>
            <CardHeader>
              <CardTitle>Upload image</CardTitle>
              <CardDescription>New uploads start with pending status.</CardDescription>
            </CardHeader>

            <form onSubmit={onSubmit}>
              <CardContent className='space-y-5'>
                <Input
                  type='file'
                  accept='image/jpeg,image/png,image/webp'
                  onChange={onFileChange}
                  disabled={isPending}
                />

                {preview && (
                  <Image
                    src={preview}
                    alt='Selected preview'
                    width={640}
                    height={360}
                    unoptimized
                    className='max-h-60 w-full rounded-3xl object-cover'
                  />
                )}

                {uploaded && (
                  <div className='space-y-1 text-sm'>
                    <p>
                      <span className='text-muted-foreground'>ID: </span>
                      {uploaded.id}
                    </p>
                    <p>
                      <span className='text-muted-foreground'>File: </span>
                      {uploaded.file_name}
                    </p>
                    <p>
                      <span className='text-muted-foreground'>Status: </span>
                      {uploaded.status}
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter className='mt-6'>
                <Button type='submit' className='w-full' disabled={!file || isPending}>
                  {isPending && <Spinner />}
                  {isPending ? 'Uploading…' : 'Upload'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
