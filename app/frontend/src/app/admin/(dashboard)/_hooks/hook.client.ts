import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchMe, logout } from './hook';

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useLogout() {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
  });
}
