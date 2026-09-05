import { describe, expect, it } from 'bun:test';
import { WorkListSchema, WorkSchema } from './work.dto';

const valid = {
  id: '1',
  name: 'portfolio',
  content: '# hello',
  image_url: 'https://example.com/img.png',
  image_id: 'img_1',
  badge: ['web', 'design'],
  description: 'desc',
  is_selected: false,
  hover_text: 'view',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-02T00:00:00.000Z',
};

describe('WorkSchema', () => {
  it('parses valid work', () => {
    expect(WorkSchema.parse(valid)).toEqual(valid);
  });

  it('parses valid list', () => {
    expect(WorkListSchema.parse([valid, valid])).toHaveLength(2);
  });

  it('rejects missing field', () => {
    const { name: _omit, ...rest } = valid;
    expect(() => WorkSchema.parse(rest)).toThrow();
  });

  it('rejects bad datetime', () => {
    expect(() => WorkSchema.parse({ ...valid, updated_at: 'yesterday' })).toThrow();
  });

  it('rejects non-array badge', () => {
    expect(() => WorkSchema.parse({ ...valid, badge: 123 })).toThrow();
  });

  it('rejects wrong is_selected type', () => {
    expect(() => WorkSchema.parse({ ...valid, is_selected: 1 })).toThrow();
  });
});
