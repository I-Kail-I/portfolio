import { useQuery } from '@tanstack/react-query';
import { fetchWorkByName } from './hook';

export function useWorkByName(name: string) {
  return useQuery({
    queryKey: ['work', name],
    queryFn: () => fetchWorkByName(name),
    staleTime: 1000 * 60 * 5,
    enabled: !!name,
  });
}
