import { useMutation } from '@tanstack/react-query';
import { uploadImage } from './hook';

export function useUploadImage() {
  return useMutation({
    mutationKey: ['upload-image'],
    mutationFn: uploadImage,
  });
}
