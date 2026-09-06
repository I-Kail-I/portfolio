'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, Trash2Icon } from 'lucide-react';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { MarkdownPreview } from '@/components/markdown-preview';
import { Reveal } from '@/components/reveal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/lib/errors';
import { useAdminBlog, useDeleteAdminBlog } from '../../_hooks/hook.client';
import { BlogEditForm } from '../_components/blog-edit-form';

export function BlogDetailSection({ id }: { id: string }) {
  const router = useRouter();
  const { data: blog, isLoading, isError, error } = useAdminBlog(id);
  const { mutate: remove, isPending: isDeleting } = useDeleteAdminBlog();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (isError) {
      toast.add({
        title: 'Failed to load blog',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    }
  }, [isError, error]);

  function onDelete() {
    if (!blog) return;
    remove(blog.id, {
      onSuccess: () => {
        toast.add({ title: 'Blog deleted', description: blog.title, type: 'success' });
        router.replace('/admin/blogs');
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
            <Button variant='ghost' size='sm' render={<Link href='/admin/blogs' />}>
              <ArrowLeftIcon />
              Blogs
            </Button>
            {blog && !editing && (
              <div className='flex gap-2'>
                <Button size='sm' onClick={() => setEditing(true)}>
                  Update
                </Button>
                <DeleteConfirmDialog
                  open={deleteOpen}
                  onOpenChange={setDeleteOpen}
                  title='Delete blog?'
                  description={`'${blog.title}' will be permanently removed. This cannot be undone.`}
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
            ) : isError || !blog ? (
              <CardContent>
                <p className='text-muted-foreground text-sm'>
                  Could not load blog. Please try again.
                </p>
              </CardContent>
            ) : editing ? (
              <>
                <CardHeader>
                  <CardTitle>Update blog</CardTitle>
                  <CardDescription>Edit fields, markdown on the left.</CardDescription>
                </CardHeader>
                <CardContent>
                  <BlogEditForm blog={blog} onDone={() => setEditing(false)} />
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader>
                  <div className='flex flex-wrap gap-x-5 gap-y-1 font-medium text-muted-foreground text-xs uppercase'>
                    {blog.badge.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <CardTitle className='mt-2 text-3xl'>{blog.title}</CardTitle>
                  <CardDescription>{blog.description}</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='relative aspect-11/6 w-full overflow-hidden rounded-xl bg-muted'>
                    {blog.image_url ? (
                      <Image
                        src={blog.image_url}
                        alt={blog.title}
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
                  <MarkdownPreview markdown={blog.content} />
                </CardContent>
              </>
            )}
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
