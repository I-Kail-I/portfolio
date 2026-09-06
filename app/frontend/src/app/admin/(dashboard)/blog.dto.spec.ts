import { describe, expect, it } from 'bun:test';
import { BlogListSchema, BlogSchema } from './blog.dto';

const valid = {
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
};

describe('BlogSchema', () => {
  it('parses valid blog', () => {
    expect(BlogSchema.parse(valid)).toEqual(valid);
  });

  it('parses list', () => {
    expect(BlogListSchema.parse([valid])).toEqual([valid]);
  });

  it('rejects missing field', () => {
    const { title: _omit, ...rest } = valid;
    expect(() => BlogSchema.parse(rest)).toThrow();
  });

  it('rejects bad datetime', () => {
    expect(() => BlogSchema.parse({ ...valid, created_at: 'yesterday' })).toThrow();
  });

  it('rejects unknown keys', () => {
    expect(() => BlogSchema.parse({ ...valid, extra: 1 })).toThrow();
  });
});
