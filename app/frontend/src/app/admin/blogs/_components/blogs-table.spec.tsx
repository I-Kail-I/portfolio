import { describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminBlogsTable } from './blogs-table';

const blogs = [
  {
    id: 'blog_1',
    title: 'My Blog',
    description: 'Short description',
    content: '# Hello',
    image_url: 'upload/image.jpg',
    image_id: 'img_1',
    badge: ['nextjs'],
    hover_text: 'Hover text',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-02T00:00:00.000Z',
  },
];

function renderTable(onSelect = mock()) {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <AdminBlogsTable blogs={blogs} onSelect={onSelect} />
    </QueryClientProvider>,
  );
  return { onSelect };
}

describe('AdminBlogsTable', () => {
  it('renders rows with actions', () => {
    renderTable();
    expect(screen.getByText('My Blog')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete My Blog')).toBeInTheDocument();
  });

  it('calls onSelect with id on row click', async () => {
    const user = userEvent.setup();
    const { onSelect } = renderTable();
    await user.click(screen.getByText('My Blog'));
    expect(onSelect).toHaveBeenCalledWith('blog_1');
  });

  it('delete click does not trigger onSelect', async () => {
    const user = userEvent.setup();
    const { onSelect } = renderTable();
    await user.click(screen.getByLabelText('Delete My Blog'));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByText('Delete blog?')).toBeInTheDocument();
  });

  it('renders empty text', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <AdminBlogsTable blogs={[]} onSelect={() => {}} />
      </QueryClientProvider>,
    );
    expect(screen.getByText('No blogs yet.')).toBeInTheDocument();
  });
});
