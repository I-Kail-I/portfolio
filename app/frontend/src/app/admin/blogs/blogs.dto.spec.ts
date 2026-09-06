import { describe, expect, it } from 'bun:test';
import { AdminBlogListSchema, AdminBlogSchema, UpdateAdminBlogSchema } from './blogs.dto';

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

const { id: _id, created_at: _created, updated_at: _updated, ...updateValid } = valid;

describe('AdminBlogSchema', () => {
  it('parses valid blog', () => {
    expect(AdminBlogSchema.parse(valid)).toEqual(valid);
  });

  it('parses list', () => {
    expect(AdminBlogListSchema.parse([valid])).toEqual([valid]);
  });

  it('rejects missing field', () => {
    const { title: _omit, ...rest } = valid;
    expect(() => AdminBlogSchema.parse(rest)).toThrow();
  });

  it('rejects bad datetime', () => {
    expect(() => AdminBlogSchema.parse({ ...valid, created_at: 'yesterday' })).toThrow();
  });

  it('rejects unknown keys', () => {
    expect(() => AdminBlogSchema.parse({ ...valid, extra: 1 })).toThrow();
  });
});

describe('UpdateAdminBlogSchema', () => {
  it('parses valid update', () => {
    expect(UpdateAdminBlogSchema.parse(updateValid)).toEqual(updateValid);
  });

  it('rejects empty title', () => {
    expect(() => UpdateAdminBlogSchema.parse({ ...updateValid, title: '' })).toThrow();
  });

  it('rejects unknown keys', () => {
    expect(() => UpdateAdminBlogSchema.parse({ ...updateValid, extra: 1 })).toThrow();
  });
});
