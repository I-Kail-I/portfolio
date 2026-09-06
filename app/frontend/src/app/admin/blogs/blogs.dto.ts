import { z } from '@/lib/zod';

export const AdminBlogSchema = z.object({
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

export const AdminBlogListSchema = z.array(AdminBlogSchema);

export const UpdateAdminBlogSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().min(1),
  image_url: z.string().min(1),
  image_id: z.string().min(1),
  badge: z.array(z.string()),
  hover_text: z.string().min(1),
});

export type AdminBlog = z.infer<typeof AdminBlogSchema>;
export type UpdateAdminBlog = z.infer<typeof UpdateAdminBlogSchema>;
