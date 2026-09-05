import { useQuery } from '@tanstack/react-query';
import { fetchSelectedWorks } from './hooks';

export function useSelectedWorks() {
  return useQuery({
    queryKey: ['selected-work'],
    queryFn: fetchSelectedWorks,
    staleTime: 1000 * 60 * 5,
  });
}
