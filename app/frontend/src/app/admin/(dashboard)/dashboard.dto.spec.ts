import { describe, expect, it } from 'bun:test';
import { MeSchema } from './dashboard.dto';

const valid = {
  id: '1',
  first_name: 'Jane',
  last_name: 'Doe',
  email: 'user@example.com',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-02T00:00:00.000Z',
};

describe('MeSchema', () => {
  it('parses valid me', () => {
    expect(MeSchema.parse(valid)).toEqual(valid);
  });

  it('rejects missing field', () => {
    const { email: _omit, ...rest } = valid;
    expect(() => MeSchema.parse(rest)).toThrow();
  });

  it('rejects bad email', () => {
    expect(() => MeSchema.parse({ ...valid, email: 'bad' })).toThrow();
  });

  it('rejects bad datetime', () => {
    expect(() => MeSchema.parse({ ...valid, created_at: 'yesterday' })).toThrow();
  });

  it('rejects unknown keys', () => {
    expect(() => MeSchema.parse({ ...valid, extra: 1 })).toThrow();
  });
});
