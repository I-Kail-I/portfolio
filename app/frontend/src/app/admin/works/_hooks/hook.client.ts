import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteAdminWork, fetchAdminWork, fetchAdminWorks, updateAdminWork } from './hook';

export function useAdminWorks() {
  return useQuery({
    queryKey: ['admin-works'],
    queryFn: fetchAdminWorks,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminWork(id: string) {
  return useQuery({
    queryKey: ['admin-works', id],
    queryFn: () => fetchAdminWork(id),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(id),
  });
}

export function useDeleteAdminWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['admin-works-delete'],
    mutationFn: deleteAdminWork,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-works'] });
    },
  });
}

export function useUpdateAdminWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['admin-works-update'],
    mutationFn: updateAdminWork,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-works'] });
    },
  });
}
