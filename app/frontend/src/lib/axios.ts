import axios from 'axios';

/**
 * Shared Axios instance for all API requests from the frontend.
 *
 * @remarks
 * - Requests are sent to `NEXT_PUBLIC_API_PREFIX`, falling back to `/api`.
 * - Cookies are sent cross-origin via `withCredentials`, so the API must allow
 *   credentials from the frontend origin.
 * - Requests time out after 5 seconds.
 */
const isServer = typeof window === 'undefined';

const baseURL = isServer
  ? (process.env.API_URL ?? 'http://localhost:8000/api')
  : (process.env.NEXT_PUBLIC_API_PREFIX ?? '/api');

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
  timeout: 5000,
});
