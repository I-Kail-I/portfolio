import { describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteConfirmDialog } from './delete-confirm-dialog';

function renderDialog(overrides = {}) {
  const onConfirm = mock();
  const onOpenChange = mock();
  render(
    <DeleteConfirmDialog
      open
      onOpenChange={onOpenChange}
      title='Delete work?'
      description='Gone forever.'
      isPending={false}
      onConfirm={onConfirm}
      trigger={<button type='button'>open</button>}
      {...overrides}
    />,
  );
  return { onConfirm, onOpenChange };
}

describe('DeleteConfirmDialog', () => {
  it('renders title, description and trigger', async () => {
    const { container } = render(
      <DeleteConfirmDialog
        open
        onOpenChange={() => {}}
        title='Delete work?'
        description='Gone forever.'
        isPending={false}
        onConfirm={() => {}}
        trigger={<button type='button'>open</button>}
      />,
    );
    expect(screen.getByText('Delete work?')).toBeInTheDocument();
    expect(screen.getByText('Gone forever.')).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="alert-dialog-trigger"]'),
    ).toHaveTextContent('open');
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('calls onConfirm when confirmed', async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderDialog();
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('shows pending label and disables buttons', () => {
    renderDialog({ isPending: true });
    const confirm = screen.getByText('Deleting…').closest('button');
    expect(confirm).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('supports custom labels', () => {
    renderDialog({ confirmLabel: 'Remove', pendingLabel: 'Removing…' });
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });
});
