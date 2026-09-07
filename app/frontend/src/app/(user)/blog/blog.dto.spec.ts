import { describe, expect, it } from 'bun:test';
import { BlogListSchema, BlogSchema } from './blog.dto';

const valid = {
  id: '1',
  title: 'hello world',
  content: '# hello',
  image_url: 'uploads/img.png',
  image_id: 'img_1',
  badge: ['web', 'design'],
  description: 'desc',
  hover_text: 'view',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-02T00:00:00.000Z',
};

describe('BlogSchema', () => {
  it('parses valid blog', () => {
    expect(BlogSchema.parse(valid)).toEqual(valid);
  });

  it('parses valid list', () => {
    expect(BlogListSchema.parse([valid, valid])).toHaveLength(2);
  });

  it('rejects missing field', () => {
    const { title: _omit, ...rest } = valid;
    expect(() => BlogSchema.parse(rest)).toThrow();
  });

  it('rejects bad datetime', () => {
    expect(() => BlogSchema.parse({ ...valid, updated_at: 'yesterday' })).toThrow();
  });

  it('rejects non-array badge', () => {
    expect(() => BlogSchema.parse({ ...valid, badge: 123 })).toThrow();
  });
});
