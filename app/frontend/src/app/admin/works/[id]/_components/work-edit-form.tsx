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
import { UpdateAdminWorkSchema, type AdminWork, type UpdateAdminWork } from '../../works.dto';
import { useUpdateAdminWork } from '../../_hooks/hook.client';

type WorkEditFormProps = {
  work: AdminWork;
  onDone: () => void;
};

export function WorkEditForm({ work, onDone }: WorkEditFormProps) {
  const { mutate, isPending } = useUpdateAdminWork();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateAdminWork>({
    resolver: zodResolver(UpdateAdminWorkSchema),
    defaultValues: {
      name: work.name,
      content: work.content,
      is_selected: work.is_selected,
      description: work.description,
      image_url: work.image_url,
      image_id: work.image_id,
      badge: work.badge,
      hover_text: work.hover_text,
    },
  });

  const isSelected = watch('is_selected');
  const badges = watch('badge');
  const imageId = watch('image_id');

  function onSubmit(data: UpdateAdminWork) {
    mutate(
      { id: work.id, data },
      {
        onSuccess: () => {
          toast.add({ title: 'Work updated', description: data.name, type: 'success' });
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
          label='Name'
          hint='Public title on cards and detail page.'
          error={errors.name?.message}
        >
          <Input placeholder='My Work' {...register('name')} disabled={isPending} />
        </Field>
        <Field
          label='Hover text'
          hint='Accent line shown after the title on hover.'
          error={errors.hover_text?.message}
        >
          <Input placeholder='A case study in…' {...register('hover_text')} disabled={isPending} />
        </Field>
      </div>

      <Field
        label='Description'
        hint='One-line summary under the title.'
        error={errors.description?.message}
      >
        <Input
          placeholder='What this work is about…'
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

      <Field label='Visibility' hint='Selected pins this work to the home page.'>
        <div className='flex gap-2'>
          <Button
            type='button'
            variant={isSelected ? 'default' : 'outline'}
            size='sm'
            onClick={() => setValue('is_selected', true)}
            disabled={isPending}
          >
            Selected
          </Button>
          <Button
            type='button'
            variant={!isSelected ? 'default' : 'outline'}
            size='sm'
            onClick={() => setValue('is_selected', false)}
            disabled={isPending}
          >
            Standard
          </Button>
        </div>
      </Field>

      <Controller
        name='content'
        control={control}
        render={({ field, fieldState }) => (
          <Field
            label='Content'
            hint='Full case-study body. Markdown on the left, preview on the right.'
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
