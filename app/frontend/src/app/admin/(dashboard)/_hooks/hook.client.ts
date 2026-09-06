import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchBlogs, fetchHealth, fetchImages, fetchMe, logout } from './hook';

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    staleTime: 1000 * 30,
    retry: false,
  });
}

export function useLogout() {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
  });
}

export function useBlogs() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
    staleTime: 1000 * 60 * 5,
  });
}

export function useImages() {
  return useQuery({
    queryKey: ['images'],
    queryFn: fetchImages,
    staleTime: 1000 * 60 * 5,
  });
}
