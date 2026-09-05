import { useQuery } from '@tanstack/react-query';
import { fetchWorks } from './hook';

export function useWorkList() {
  return useQuery({
    queryKey: ['work'],
    queryFn: fetchWorks,
    staleTime: 1000 * 60 * 5,
  });
}
