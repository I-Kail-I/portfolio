import { axiosInstance } from '@/lib/axios';
import { MeSchema, type Me } from '../dashboard.dto';

export async function fetchMe(): Promise<Me> {
  const response = await axiosInstance.get('/auth/me');

  return MeSchema.parse(response.data);
}

export async function logout(): Promise<void> {
  await axiosInstance.post('/auth/logout');
}
