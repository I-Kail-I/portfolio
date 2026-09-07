import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminBlog,
  deleteAdminBlog,
  fetchAdminBlog,
  fetchAdminBlogs,
  updateAdminBlog,
} from './hook';

export function useAdminBlogs() {
  return useQuery({
    queryKey: ['admin-blogs'],
    queryFn: fetchAdminBlogs,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminBlog(id: string) {
  return useQuery({
    queryKey: ['admin-blogs', id],
    queryFn: () => fetchAdminBlog(id),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(id),
  });
}

export function useDeleteAdminBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['admin-blogs-delete'],
    mutationFn: deleteAdminBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
    },
  });
}

export function useUpdateAdminBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['admin-blogs-update'],
    mutationFn: updateAdminBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
    },
  });
}

export function useCreateAdminBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['admin-blogs-create'],
    mutationFn: createAdminBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
    },
  });
}
