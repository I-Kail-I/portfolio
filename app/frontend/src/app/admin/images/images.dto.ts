import { z } from '@/lib/zod';

export const ImageSchema = z.object({
  id: z.string(),
  file_path: z.string(),
  file_name: z.string(),
  mime_type: z.string(),
  status: z.enum(['active', 'pending']),
  created_at: z.iso.datetime(),
});

export type Image = z.infer<typeof ImageSchema>;
