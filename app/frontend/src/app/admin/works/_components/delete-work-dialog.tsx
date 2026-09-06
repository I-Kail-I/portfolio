'use client';

import { useState } from 'react';
import { Trash2Icon } from 'lucide-react';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { getApiErrorMessage } from '@/lib/errors';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { useDeleteAdminWork } from '../_hooks/hook.client';

type DeleteWorkDialogProps = {
  id: string;
  name: string;
};

export function DeleteWorkDialog({ id, name }: DeleteWorkDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteAdminWork();

  function onConfirm() {
    mutate(id, {
      onSuccess: () => {
        setOpen(false);
        toast.add({ title: 'Work deleted', description: name, type: 'success' });
      },
      onError: (error) => {
        toast.add({ title: 'Delete failed', description: getApiErrorMessage(error), type: 'error' });
      },
    });
  }

  return (
    <DeleteConfirmDialog
      open={open}
      onOpenChange={setOpen}
      title='Delete work?'
      description={`'${name}' will be permanently removed. This cannot be undone.`}
      isPending={isPending}
      onConfirm={onConfirm}
      trigger={
        <Button variant='ghost' size='icon-sm' aria-label={`Delete ${name}`}>
          <Trash2Icon />
        </Button>
      }
    />
  );
}
