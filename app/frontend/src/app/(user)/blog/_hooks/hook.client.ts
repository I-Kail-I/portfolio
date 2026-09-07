import { useQuery } from '@tanstack/react-query';
import { fetchBlogByTitle, fetchBlogs } from './hook';

export function useBlogList() {
  return useQuery({
    queryKey: ['blog'],
    queryFn: fetchBlogs,
    staleTime: 1000 * 60 * 5,
  });
}

export function useBlogByTitle(title: string) {
  return useQuery({
    queryKey: ['blog', title],
    queryFn: () => fetchBlogByTitle(title),
    staleTime: 1000 * 60 * 5,
    enabled: !!title,
  });
}
