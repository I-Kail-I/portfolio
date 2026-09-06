import { z } from '@/lib/zod';

export const MeSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.email(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export type Me = z.infer<typeof MeSchema>;
