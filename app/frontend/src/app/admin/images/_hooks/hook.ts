import { axiosInstance } from '@/lib/axios';
import { ImageSchema, type Image } from '../images.dto';

export async function uploadImage(file: File): Promise<Image> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post('/file-upload/upload', formData);

  return ImageSchema.parse(response.data);
}
