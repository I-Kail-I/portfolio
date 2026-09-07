import { isAxiosError } from 'axios';

/**
 * Flattens backend `{ message }` bodies (string or string[]) into one line.
 * Falls back to the generic error message.
 */
export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string | string[] }>(error)) {
    const message = [error.response?.data?.message].flat().filter(Boolean).join(', ');
    return message || error.message;
  }

  if (error instanceof Error) return error.message;

  return 'Unknown error';
}
