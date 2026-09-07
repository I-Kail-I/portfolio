import { describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminWorksTable } from './works-table';

const works = [
  {
    id: 'work_1',
    name: 'My Work',
    content: '# Case study',
    image_url: 'upload/hero.webp',
    image_id: 'img_1',
    badge: ['nextjs'],
    description: 'Short description',
    is_selected: true,
    hover_text: 'Hover text',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-02T00:00:00.000Z',
  },
];

function renderTable(onSelect = mock()) {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <AdminWorksTable works={works} onSelect={onSelect} />
    </QueryClientProvider>,
  );
  return { onSelect };
}

describe('AdminWorksTable', () => {
  it('renders rows with actions', () => {
    renderTable();
    expect(screen.getByText('My Work')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete My Work')).toBeInTheDocument();
  });

  it('calls onSelect with id on row click', async () => {
    const user = userEvent.setup();
    const { onSelect } = renderTable();
    await user.click(screen.getByText('My Work'));
    expect(onSelect).toHaveBeenCalledWith('work_1');
  });

  it('delete click does not trigger onSelect', async () => {
    const user = userEvent.setup();
    const { onSelect } = renderTable();
    await user.click(screen.getByLabelText('Delete My Work'));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByText('Delete work?')).toBeInTheDocument();
  });

  it('renders empty text', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <AdminWorksTable works={[]} onSelect={() => {}} />
      </QueryClientProvider>,
    );
    expect(screen.getByText('No works yet.')).toBeInTheDocument();
  });
});
