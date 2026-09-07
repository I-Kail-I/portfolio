import { z } from '@/lib/zod';

export const BlogSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  image_url: z.string(),
  image_id: z.string(),
  badge: z.array(z.string()),
  hover_text: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const BlogListSchema = z.array(BlogSchema);

export type BlogType = z.infer<typeof BlogSchema>;
