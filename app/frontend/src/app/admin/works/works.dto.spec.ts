import { describe, expect, it } from 'bun:test';
import { AdminWorkListSchema, AdminWorkSchema, UpdateAdminWorkSchema } from './works.dto';

const valid = {
  id: 'work_1',
  name: 'My Work',
  content: '# Case study',
  image_url: 'upload/hero.webp',
  image_id: 'img_1',
  badge: ['nextjs', 'postgres'],
  description: 'Short description',
  is_selected: true,
  hover_text: 'Hover text',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-02T00:00:00.000Z',
};

const { id: _id, created_at: _created, updated_at: _updated, ...updateValid } = valid;

describe('AdminWorkSchema', () => {
  it('parses valid work', () => {
    expect(AdminWorkSchema.parse(valid)).toEqual(valid);
  });

  it('parses list', () => {
    expect(AdminWorkListSchema.parse([valid])).toEqual([valid]);
  });

  it('rejects missing field', () => {
    const { name: _omit, ...rest } = valid;
    expect(() => AdminWorkSchema.parse(rest)).toThrow();
  });

  it('rejects bad datetime', () => {
    expect(() => AdminWorkSchema.parse({ ...valid, created_at: 'yesterday' })).toThrow();
  });

  it('rejects unknown keys', () => {
    expect(() => AdminWorkSchema.parse({ ...valid, extra: 1 })).toThrow();
  });
});

describe('UpdateAdminWorkSchema', () => {
  it('parses valid update', () => {
    expect(UpdateAdminWorkSchema.parse(updateValid)).toEqual(updateValid);
  });

  it('rejects empty name', () => {
    expect(() => UpdateAdminWorkSchema.parse({ ...updateValid, name: '' })).toThrow();
  });

  it('rejects unknown keys', () => {
    expect(() => UpdateAdminWorkSchema.parse({ ...updateValid, extra: 1 })).toThrow();
  });
});
