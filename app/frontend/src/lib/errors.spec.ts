import { describe, expect, it } from 'bun:test';
import { getApiErrorMessage } from './errors';

function axiosError(message: unknown, fallback = 'Request failed') {
  return {
    isAxiosError: true,
    message: fallback,
    response: { data: { message } },
  };
}

describe('getApiErrorMessage', () => {
  it('unwraps string message', () => {
    expect(getApiErrorMessage(axiosError('Bad input'))).toBe('Bad input');
  });

  it('joins array message', () => {
    expect(getApiErrorMessage(axiosError(['Name required', 'Bad image']))).toBe(
      'Name required, Bad image',
    );
  });

  it('falls back to axios message when body empty', () => {
    expect(getApiErrorMessage(axiosError(undefined))).toBe('Request failed');
  });

  it('returns Error message', () => {
    expect(getApiErrorMessage(new Error('Boom'))).toBe('Boom');
  });

  it('returns Unknown error otherwise', () => {
    expect(getApiErrorMessage(null)).toBe('Unknown error');
  });
});
