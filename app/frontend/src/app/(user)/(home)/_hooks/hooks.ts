import { axiosInstance } from '@/lib/axios';
import { SelectedWorkList, type SelectedWorkType } from '../work.dto';

export async function fetchSelectedWorks(): Promise<SelectedWorkType[]> {
  const response = await axiosInstance.get('/work/selected');

  return SelectedWorkList.parse(response.data);
}
