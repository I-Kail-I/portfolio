'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, StarIcon, Trash2Icon } from 'lucide-react';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { MarkdownPreview } from '@/components/markdown-preview';
import { Reveal } from '@/components/reveal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/lib/errors';
import { imageFileUrl } from '@/lib/images';
import { useAdminWork, useDeleteAdminWork } from '../../_hooks/hook.client';
import { WorkEditForm } from '../_components/work-edit-form';

export function WorkDetailSection({ id }: { id: string }) {
  const router = useRouter();
  const { data: work, isLoading, isError, error } = useAdminWork(id);
  const { mutate: remove, isPending: isDeleting } = useDeleteAdminWork();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (isError) {
      toast.add({
        title: 'Failed to load work',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    }
  }, [isError, error]);

  function onDelete() {
    if (!work) return;
    remove(work.id, {
      onSuccess: () => {
        toast.add({ title: 'Work deleted', description: work.name, type: 'success' });
        router.replace('/admin/works');
      },
      onError: (deleteError) => {
        toast.add({
          title: 'Delete failed',
          description: getApiErrorMessage(deleteError),
          type: 'error',
        });
      },
    });
  }

  return (
    <div className='min-h-screen'>
      <div className='container mx-auto py-10'>
        <Reveal>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <Button
              variant='ghost'
              size='sm'
              nativeButton={false}
              render={<Link href='/admin/works' />}
            >
              <ArrowLeftIcon />
              Works
            </Button>
            {work && !editing && (
              <div className='flex gap-2'>
                <Button size='sm' onClick={() => setEditing(true)}>
                  Update
                </Button>
                <DeleteConfirmDialog
                  open={deleteOpen}
                  onOpenChange={setDeleteOpen}
                  title='Delete work?'
                  description={`'${work.name}' will be permanently removed. This cannot be undone.`}
                  isPending={isDeleting}
                  onConfirm={onDelete}
                  trigger={
                    <Button variant='destructive' size='sm'>
                      <Trash2Icon />
                      Delete
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1} className='mt-6'>
          <Card>
            {isLoading ? (
              <>
                <CardHeader className='space-y-2'>
                  <Skeleton className='h-8 w-1/3' />
                  <Skeleton className='h-4 w-1/2' />
                </CardHeader>
                <CardContent>
                  <Skeleton className='min-h-[320px] w-full' />
                </CardContent>
              </>
            ) : isError || !work ? (
              <CardContent>
                <p className='text-muted-foreground text-sm'>
                  Could not load work. Please try again.
                </p>
              </CardContent>
            ) : editing ? (
              <>
                <CardHeader>
                  <CardTitle>Update work</CardTitle>
                  <CardDescription>Edit fields, markdown on the left.</CardDescription>
                </CardHeader>
                <CardContent>
                  <WorkEditForm work={work} onDone={() => setEditing(false)} />
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader>
                  <div className='flex flex-wrap gap-x-5 gap-y-1 font-medium text-muted-foreground text-xs uppercase'>
                    {work.badge.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <CardTitle className='mt-2 flex items-center gap-2 text-3xl'>
                    {work.name}
                    {work.is_selected && (
                      <StarIcon className='size-5 text-[#f5bd22]' aria-label='Selected' />
                    )}
                  </CardTitle>
                  <CardDescription>{work.description}</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='relative aspect-11/6 w-full overflow-hidden rounded-xl bg-muted'>
                    {work.image_id ? (
                      <Image
                        src={imageFileUrl(work.image_id)}
                        alt={work.name}
                        fill
                        sizes='(max-width: 1280px) 100vw, 1100px'
                        className='object-cover'
                      />
                    ) : (
                      <p className='flex h-full items-center justify-center text-muted-foreground text-sm'>
                        No hero image
                      </p>
                    )}
                  </div>
                  <MarkdownPreview markdown={work.content} />
                </CardContent>
              </>
            )}
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
