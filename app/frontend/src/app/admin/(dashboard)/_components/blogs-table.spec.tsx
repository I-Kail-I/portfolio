import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { BlogsTable } from './blogs-table';

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

describe('BlogsTable', () => {
  it('renders rows', () => {
    render(<BlogsTable blogs={blogs} />);
    expect(screen.getByText('My Blog')).toBeInTheDocument();
    expect(screen.getByText('Short description')).toBeInTheDocument();
  });

  it('renders empty text', () => {
    render(<BlogsTable blogs={[]} />);
    expect(screen.getByText('No blogs yet.')).toBeInTheDocument();
  });
});
