import { z } from '@/lib/zod';

export const WorkSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
  image_url: z.string(),
  image_id: z.string(),
  badge: z.array(z.string()),
  description: z.string(),
  is_selected: z.boolean(),
  hover_text: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const WorkListSchema = z.array(WorkSchema);

export type WorkType = z.infer<typeof WorkSchema>;
