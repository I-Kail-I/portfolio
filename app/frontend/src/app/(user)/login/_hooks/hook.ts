import { axiosInstance } from '@/lib/axios';
import { LoginResponseSchema, type LoginInput, type LoginResponse } from '../login.dto';

export async function login(input: LoginInput): Promise<LoginResponse> {
  const response = await axiosInstance.post('/auth/login/email-password', input);

  return LoginResponseSchema.parse(response.data);
}
