import { describe, expect, it } from 'bun:test';
import { LoginResponseSchema, LoginSchema } from './login.dto';

const validInput = {
  email: 'user@example.com',
  password: 'secret123',
};

const validResponse = {
  first_name: 'Jane',
  last_name: 'Doe',
  email: 'user@example.com',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-02T00:00:00.000Z',
  expires_at: '2024-01-03T00:00:00.000Z',
};

describe('LoginSchema', () => {
  it('parses valid input', () => {
    expect(LoginSchema.parse(validInput)).toEqual(validInput);
  });

  it('rejects bad email', () => {
    expect(() => LoginSchema.parse({ ...validInput, email: 'not-email' })).toThrow();
  });

  it('rejects empty password', () => {
    expect(() => LoginSchema.parse({ ...validInput, password: '' })).toThrow();
  });

  it('rejects unknown keys', () => {
    expect(() => LoginSchema.parse({ ...validInput, extra: 1 })).toThrow();
  });
});

describe('LoginResponseSchema', () => {
  it('parses valid response', () => {
    expect(LoginResponseSchema.parse(validResponse)).toEqual(validResponse);
  });

  it('rejects bad datetime', () => {
    expect(() =>
      LoginResponseSchema.parse({ ...validResponse, expires_at: 'yesterday' }),
    ).toThrow();
  });

  it('rejects bad email', () => {
    expect(() =>
      LoginResponseSchema.parse({ ...validResponse, email: 'bad' }),
    ).toThrow();
  });
});
