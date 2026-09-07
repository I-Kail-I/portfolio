'use client';

import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field } from '@/components/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ReadmeEditor } from '@/components/readme-editor';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/lib/errors';
import { parseBadges } from '@/lib/badges';
import { imageFileUrl } from '@/lib/images';
import { UpdateAdminBlogSchema, type AdminBlog, type UpdateAdminBlog } from '../../blogs.dto';
import { useUpdateAdminBlog } from '../../_hooks/hook.client';

type BlogEditFormProps = {
  blog: AdminBlog;
  onDone: () => void;
};

export function BlogEditForm({ blog, onDone }: BlogEditFormProps) {
  const { mutate, isPending } = useUpdateAdminBlog();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateAdminBlog>({
    resolver: zodResolver(UpdateAdminBlogSchema),
    defaultValues: {
      title: blog.title,
      description: blog.description,
      content: blog.content,
      image_url: blog.image_url,
      image_id: blog.image_id,
      badge: blog.badge,
      hover_text: blog.hover_text,
    },
  });

  const badges = watch('badge');
  const imageId = watch('image_id');

  function onSubmit(data: UpdateAdminBlog) {
    mutate(
      { id: blog.id, data },
      {
        onSuccess: () => {
          toast.add({ title: 'Blog updated', description: data.title, type: 'success' });
          onDone();
        },
        onError: (error) => {
          toast.add({
            title: 'Update failed',
            description: getApiErrorMessage(error),
            type: 'error',
          });
        },
      },
    );
  }

  return (
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
          <Input placeholder='Notes on…' {...register('hover_text')} disabled={isPending} />
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

      <Field
        label='Hero image'
        hint='Path must start with upload/. Preview below.'
        error={errors.image_url?.message ?? errors.image_id?.message}
      >
        <div className='grid gap-4 sm:grid-cols-2'>
          <Input placeholder='upload/hero.webp' {...register('image_url')} disabled={isPending} />
          <Input placeholder='Image record ID' {...register('image_id')} disabled={isPending} />
        </div>
      </Field>

      {imageId ? (
        <div className='relative aspect-11/6 w-full overflow-hidden rounded-xl bg-muted'>
          <Image
            src={imageFileUrl(imageId)}
            alt='Hero preview'
            fill
            sizes='(max-width: 1280px) 100vw, 1100px'
            className='object-cover'
          />
        </div>
      ) : (
        <p className='text-muted-foreground text-xs'>No hero image set.</p>
      )}

      <Field
        label='Badges'
        hint='Tags above the title, comma or space separated.'
        error={errors.badge?.message}
      >
        <Input
          placeholder='Next.js, Postgres'
          value={badges.join(', ')}
          onChange={(event) =>
            setValue('badge', parseBadges(event.target.value), { shouldValidate: true })
          }
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

      <div className='flex gap-2'>
        <Button type='submit' disabled={isPending}>
          {isPending && <Spinner />}
          {isPending ? 'Saving…' : 'Save changes'}
        </Button>
        <Button type='button' variant='outline' onClick={onDone} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
