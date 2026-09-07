import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { ImagesTable } from './images-table';

const images = [
  {
    id: 'img_1',
    file_path: '/uploads/img.png',
    file_name: 'img.png',
    mime_type: 'image/png',
    status: 'active',
    created_at: '2024-01-01T00:00:00.000Z',
  } as const,
];

describe('ImagesTable', () => {
  it('renders rows', () => {
    render(<ImagesTable images={[...images]} />);
    expect(screen.getByText('img.png')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('renders empty text', () => {
    render(<ImagesTable images={[]} />);
    expect(screen.getByText('No images yet.')).toBeInTheDocument();
  });
});
