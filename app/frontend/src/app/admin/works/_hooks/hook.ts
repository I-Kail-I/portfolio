import { axiosInstance } from '@/lib/axios';
import {
  AdminWorkListSchema,
  AdminWorkSchema,
  type AdminWork,
  type UpdateAdminWork,
} from '../works.dto';

export async function fetchAdminWorks(): Promise<AdminWork[]> {
  const response = await axiosInstance.get('/work');

  return AdminWorkListSchema.parse(response.data);
}

export async function fetchAdminWork(id: string): Promise<AdminWork> {
  const response = await axiosInstance.get(`/work/id/${id}`);

  return AdminWorkSchema.parse(response.data);
}

export async function deleteAdminWork(id: string): Promise<AdminWork> {
  const response = await axiosInstance.delete(`/work/${id}`);

  return AdminWorkSchema.parse(response.data);
}

export async function updateAdminWork({
  id,
  data,
}: {
  id: string;
  data: UpdateAdminWork;
}): Promise<AdminWork> {
  const response = await axiosInstance.patch(`/work/${id}`, data);

  return AdminWorkSchema.parse(response.data);
}
