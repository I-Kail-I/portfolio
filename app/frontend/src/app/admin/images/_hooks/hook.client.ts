import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteGalleryImage, fetchGalleryImages, uploadImage } from './hook';

export function useUploadImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['upload-image'],
    mutationFn: uploadImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
    },
  });
}

export function useGalleryImages() {
  return useQuery({
    queryKey: ['gallery-images'],
    queryFn: fetchGalleryImages,
    staleTime: 1000 * 60 * 5,
  });
}

export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['gallery-images-delete'],
    mutationFn: deleteGalleryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
    },
  });
}
