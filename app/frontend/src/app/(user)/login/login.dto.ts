import { z } from '@/lib/zod';

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, { message: 'Password is required ' }),
});

export const LoginResponseSchema = z.looseObject({
  first_name: z.string(),
  last_name: z.string(),
  email: z.email(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  expires_at: z.iso.datetime(),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
