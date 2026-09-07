import { axiosInstance } from '@/lib/axios';
import { ImageListSchema, ImageSchema, type Image } from '../images.dto';

export async function uploadImage(file: File): Promise<Image> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post('/file-upload/upload', formData);

  return ImageSchema.parse(response.data);
}

export async function fetchGalleryImages(): Promise<Image[]> {
  const response = await axiosInstance.get('/image');

  return ImageListSchema.parse(response.data);
}

export async function deleteGalleryImage(id: string): Promise<Image> {
  const response = await axiosInstance.delete(`/image/${id}`);

  return ImageSchema.parse(response.data);
}
