import { describe, expect, it } from 'bun:test';
import { WorkListSchema, WorkSchema } from './work.dto';

const valid = {
  id: 'abc',
  name: 'detail',
  content: '## body',
  image_url: 'https://example.com/a.png',
  image_id: 'img_2',
  badge: ['app'],
  description: 'desc',
  is_selected: true,
  hover_text: 'open',
  created_at: '2024-05-01T12:00:00.000Z',
  updated_at: '2024-05-02T12:00:00.000Z',
};

describe('WorkSchema (detail)', () => {
  it('parses valid work', () => {
    expect(WorkSchema.parse(valid)).toEqual(valid);
  });

  it('parses valid list', () => {
    expect(WorkListSchema.parse([valid])).toHaveLength(1);
  });

  it('rejects missing field', () => {
    const { image_url: _omit, ...rest } = valid;
    expect(() => WorkSchema.parse(rest)).toThrow();
  });

  it('rejects bad datetime', () => {
    expect(() => WorkSchema.parse({ ...valid, created_at: '01-01-2024' })).toThrow();
  });

  it('rejects non-array badge', () => {
    expect(() => WorkSchema.parse({ ...valid, badge: null })).toThrow();
  });

  it('rejects wrong is_selected type', () => {
    expect(() => WorkSchema.parse({ ...valid, is_selected: null })).toThrow();
  });
});
