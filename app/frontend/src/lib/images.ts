/**
 * Public byte-stream URL for an uploaded image record.
 *
 * @remarks
 * Points at GET /file-upload/:id (proxied under the API prefix),
 * not at the stored `image_url` path, which is a backend-relative
 * file path and never directly servable.
 */
export function imageFileUrl(id: string): string {
  const prefix = process.env.NEXT_PUBLIC_API_PREFIX ?? '/api';
  return `${prefix}/file-upload/${id}`;
}
