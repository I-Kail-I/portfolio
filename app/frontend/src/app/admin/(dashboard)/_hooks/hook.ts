import { axiosInstance } from '@/lib/axios';
import { ImageListSchema } from '../../images/images.dto';
import type { Image } from '../../images/images.dto';
import { BlogListSchema, type BlogType } from '../blog.dto';
import { HealthSchema, MeSchema, type Health, type Me } from '../dashboard.dto';

export async function fetchMe(): Promise<Me> {
  const response = await axiosInstance.get('/auth/me');

  return MeSchema.parse(response.data);
}

export async function fetchHealth(): Promise<Health> {
  const response = await axiosInstance.get('/health');

  return HealthSchema.parse(response.data);
}

export async function logout(): Promise<void> {
  await axiosInstance.post('/auth/logout');
}

export async function fetchBlogs(): Promise<BlogType[]> {
  const response = await axiosInstance.get('/blog');

  return BlogListSchema.parse(response.data);
}

export async function fetchImages(): Promise<Image[]> {
  const response = await axiosInstance.get('/image');

  return ImageListSchema.parse(response.data);
}
