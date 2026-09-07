'use client';

import { useState } from 'react';
import { Trash2Icon } from 'lucide-react';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { getApiErrorMessage } from '@/lib/errors';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { useDeleteAdminBlog } from '../_hooks/hook.client';

type DeleteBlogDialogProps = {
  id: string;
  title: string;
};

export function DeleteBlogDialog({ id, title }: DeleteBlogDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteAdminBlog();

  function onConfirm() {
    mutate(id, {
      onSuccess: () => {
        setOpen(false);
        toast.add({ title: 'Blog deleted', description: title, type: 'success' });
      },
      onError: (error) => {
        toast.add({
          title: 'Delete failed',
          description: getApiErrorMessage(error),
          type: 'error',
        });
      },
    });
  }

  return (
    <DeleteConfirmDialog
      open={open}
      onOpenChange={setOpen}
      title='Delete blog?'
      description={`'${title}' will be permanently removed. This cannot be undone.`}
      isPending={isPending}
      onConfirm={onConfirm}
      trigger={
        <Button variant='ghost' size='icon-sm' aria-label={`Delete ${title}`}>
          <Trash2Icon />
        </Button>
      }
    />
  );
}
