'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from '@/lib/zod';
import { Field } from '@/components/field';
import { ImageFileField } from '@/components/image-file-field';
import { ReadmeEditor } from '@/components/readme-editor';
import { Reveal } from '@/components/reveal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/lib/errors';
import { parseBadges } from '@/lib/badges';
import { useUploadImage } from '../../../images/_hooks/hook.client';
import { useCreateAdminBlog } from '../../_hooks/hook.client';

const CreateBlogSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().min(1),
  badge: z.array(z.string()),
  hover_text: z.string().min(1),
});

type CreateBlog = z.infer<typeof CreateBlogSchema>;

export function CreateBlogSection() {
  const router = useRouter();
  const { mutate: upload, isPending: isUploading } = useUploadImage();
  const { mutate: create, isPending: isCreating } = useCreateAdminBlog();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | undefined>();
  const isPending = isUploading || isCreating;

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateBlog>({
    resolver: zodResolver(CreateBlogSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      badge: [],
      hover_text: '',
    },
  });

  const [rawBadges, setRawBadges] = useState('');

  function onSubmit(data: CreateBlog) {
    const badge = parseBadges(rawBadges);
    if (badge.length === 0) {
      setError('badge', { message: 'Add at least one badge.' });
      return;
    }
    if (!file) {
      setFileError('Hero image is required.');
      return;
    }

    upload(file, {
      onSuccess: (image) => {
        create(
          { ...data, badge, image_url: image.file_path, image_id: image.id },
          {
            onSuccess: (blog) => {
              toast.add({ title: 'Blog created', description: blog.title, type: 'success' });
              router.replace(`/admin/blogs/${blog.id}`);
            },
            onError: (error) => {
              toast.add({
                title: 'Create failed',
                description: getApiErrorMessage(error),
                type: 'error',
              });
            },
          },
        );
      },
      onError: (error) => {
        toast.add({
          title: 'Upload failed',
          description: getApiErrorMessage(error),
          type: 'error',
        });
      },
    });
  }

  return (
    <div className='min-h-screen'>
      <div className='container mx-auto py-10'>
        <Reveal>
          <div>
            <h1 className='font-semibold text-4xl sm:text-5xl'>New blog</h1>
            <p className='mt-2 text-lg text-muted-foreground'>Upload a hero, then write it.</p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className='mt-10'>
          <Card>
            <CardHeader>
              <CardTitle>Create blog</CardTitle>
              <CardDescription>Image uploads first, then the entry is created.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <Field
                    label='Title'
                    hint='Public title on cards and detail page.'
                    error={errors.title?.message}
                  >
                    <Input placeholder='My Blog' {...register('title')} disabled={isPending} />
                  </Field>
                  <Field
                    label='Hover text'
                    hint='Accent line shown after the title on hover.'
                    error={errors.hover_text?.message}
                  >
                    <Input
                      placeholder='Notes on…'
                      {...register('hover_text')}
                      disabled={isPending}
                    />
                  </Field>
                </div>

                <Field
                  label='Description'
                  hint='One-line summary under the title.'
                  error={errors.description?.message}
                >
                  <Input
                    placeholder='What this post is about…'
                    {...register('description')}
                    disabled={isPending}
                  />
                </Field>

                <ImageFileField
                  error={fileError}
                  disabled={isPending}
                  onChange={(selected) => {
                    setFile(selected);
                    if (selected) setFileError(undefined);
                  }}
                />

                <Field
                  label='Badges'
                  hint='Tags above the title, comma or space separated.'
                  error={errors.badge?.message}
                >
                  <Input
                    placeholder='Next.js, Postgres'
                    value={rawBadges}
                    onChange={(event) => setRawBadges(event.target.value)}
                    disabled={isPending}
                  />
                </Field>

                <Controller
                  name='content'
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field
                      label='Content'
                      hint='Full post body. Markdown on the left, preview on the right.'
                      error={fieldState.error?.message}
                    >
                      <ReadmeEditor value={field.value} onChange={field.onChange} />
                    </Field>
                  )}
                />

                <Button type='submit' disabled={isPending}>
                  {isPending && <Spinner />}
                  {isUploading ? 'Uploading…' : isCreating ? 'Creating…' : 'Create blog'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
