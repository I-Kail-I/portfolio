import { describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

mock.module('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

import { GalleryCard } from './gallery-card';

const image = {
  id: 'img_1',
  file_path: '/uploads/img.png',
  file_name: 'img.png',
  mime_type: 'image/png',
  status: 'active',
  created_at: '2024-01-01T00:00:00.000Z',
} as const;

function renderCard() {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <GalleryCard image={{ ...image }} />
    </QueryClientProvider>,
  );
}

describe('GalleryCard', () => {
  it('renders thumbnail, name and status', () => {
    renderCard();
    expect(screen.getByAltText('img.png')).toHaveAttribute('src', '/public/img_1');
    expect(screen.getByText('img.png')).toBeInTheDocument();
    expect(screen.getByText(/active/)).toBeInTheDocument();
    expect(screen.getByLabelText('Delete img.png')).toBeInTheDocument();
  });

  it('opens delete confirm', async () => {
    const user = userEvent.setup();
    renderCard();
    await user.click(screen.getByLabelText('Delete img.png'));
    expect(screen.getByText('Delete image?')).toBeInTheDocument();
  });
});
