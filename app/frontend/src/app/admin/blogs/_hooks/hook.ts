import { axiosInstance } from '@/lib/axios';
import {
  AdminBlogListSchema,
  AdminBlogSchema,
  type AdminBlog,
  type UpdateAdminBlog,
} from '../blogs.dto';

export async function fetchAdminBlogs(): Promise<AdminBlog[]> {
  const response = await axiosInstance.get('/blog');

  return AdminBlogListSchema.parse(response.data);
}

export async function fetchAdminBlog(id: string): Promise<AdminBlog> {
  const response = await axiosInstance.get(`/blog/id/${id}`);

  return AdminBlogSchema.parse(response.data);
}

export async function deleteAdminBlog(id: string): Promise<AdminBlog> {
  const response = await axiosInstance.delete(`/blog/${id}`);

  return AdminBlogSchema.parse(response.data);
}

export async function updateAdminBlog({
  id,
  data,
}: {
  id: string;
  data: UpdateAdminBlog;
}): Promise<AdminBlog> {
  const response = await axiosInstance.patch(`/blog/${id}`, data);

  return AdminBlogSchema.parse(response.data);
}

export async function createAdminBlog(data: UpdateAdminBlog): Promise<AdminBlog> {
  const response = await axiosInstance.post('/blog', data);

  return AdminBlogSchema.parse(response.data);
}
