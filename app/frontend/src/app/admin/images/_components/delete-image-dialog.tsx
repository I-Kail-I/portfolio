'use client';

import { useState } from 'react';
import { Trash2Icon } from 'lucide-react';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { getApiErrorMessage } from '@/lib/errors';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { useDeleteGalleryImage } from '../_hooks/hook.client';

type DeleteImageDialogProps = {
  id: string;
  fileName: string;
};

export function DeleteImageDialog({ id, fileName }: DeleteImageDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteGalleryImage();

  function onConfirm() {
    mutate(id, {
      onSuccess: () => {
        setOpen(false);
        toast.add({ title: 'Image deleted', description: fileName, type: 'success' });
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
      title='Delete image?'
      description={`'${fileName}' will be permanently removed. Works linked to it will be removed too.`}
      isPending={isPending}
      onConfirm={onConfirm}
      trigger={
        <Button variant='ghost' size='icon-sm' aria-label={`Delete ${fileName}`}>
          <Trash2Icon />
        </Button>
      }
    />
  );
}
