import { z } from '@/lib/zod';

export const AdminWorkSchema = z.object({
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

export const AdminWorkListSchema = z.array(AdminWorkSchema);

export const UpdateAdminWorkSchema = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
  is_selected: z.boolean(),
  description: z.string().min(1),
  image_url: z.string().min(1),
  image_id: z.string().min(1),
  badge: z.array(z.string()),
  hover_text: z.string().min(1),
});

export type AdminWork = z.infer<typeof AdminWorkSchema>;
export type UpdateAdminWork = z.infer<typeof UpdateAdminWorkSchema>;
