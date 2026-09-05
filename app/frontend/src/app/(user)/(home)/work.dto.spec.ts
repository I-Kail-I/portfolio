import { describe, expect, it } from 'bun:test';
import { SelectedWorkList, SelectedWorkSchema } from './work.dto';

const valid = {
  id: '1',
  name: 'portfolio',
  content: '# hello',
  image_url: 'https://example.com/img.png',
  image_id: 'img_1',
  badge: ['web', 'design'],
  description: 'desc',
  is_selected: true,
  hover_text: 'view',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-02T00:00:00.000Z',
};

describe('SelectedWorkSchema', () => {
  it('parses valid work', () => {
    expect(SelectedWorkSchema.parse(valid)).toEqual(valid);
  });

  it('parses valid list', () => {
    expect(SelectedWorkList.parse([valid])).toHaveLength(1);
  });

  it('rejects missing field', () => {
    const { description: _omit, ...rest } = valid;
    expect(() => SelectedWorkSchema.parse(rest)).toThrow();
  });

  it('rejects bad datetime', () => {
    expect(() => SelectedWorkSchema.parse({ ...valid, created_at: 'not-a-date' })).toThrow();
  });

  it('rejects non-array badge', () => {
    expect(() => SelectedWorkSchema.parse({ ...valid, badge: 'web' })).toThrow();
  });

  it('rejects wrong is_selected type', () => {
    expect(() => SelectedWorkSchema.parse({ ...valid, is_selected: 'yes' })).toThrow();
  });
});
