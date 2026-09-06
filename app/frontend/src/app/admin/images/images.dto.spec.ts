import { describe, expect, it } from 'bun:test';
import { ImageSchema } from './images.dto';

const valid = {
  id: 'img_1',
  file_path: '/uploads/img.png',
  file_name: 'img.png',
  mime_type: 'image/png',
  status: 'active',
  created_at: '2024-01-01T00:00:00.000Z',
} as const;

describe('ImageSchema', () => {
  it('parses valid active image', () => {
    expect(ImageSchema.parse(valid)).toEqual(valid);
  });

  it('parses pending status', () => {
    expect(ImageSchema.parse({ ...valid, status: 'pending' })).toMatchObject({
      status: 'pending',
    });
  });

  it('rejects bad status', () => {
    expect(() => ImageSchema.parse({ ...valid, status: 'deleted' })).toThrow();
  });

  it('rejects bad datetime', () => {
    expect(() => ImageSchema.parse({ ...valid, created_at: 'yesterday' })).toThrow();
  });

  it('rejects unknown keys', () => {
    expect(() => ImageSchema.parse({ ...valid, extra: 1 })).toThrow();
  });
});
