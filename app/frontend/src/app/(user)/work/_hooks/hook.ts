import { axiosInstance } from '@/lib/axios';
import { WorkListSchema, type WorkType } from '../work.dto';

export async function fetchWorks(): Promise<WorkType[]> {
  const response = await axiosInstance.get('/work');

  return WorkListSchema.parse(response.data);
}
