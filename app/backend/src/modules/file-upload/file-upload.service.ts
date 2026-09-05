import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma/prisma.service';
import type { MulterFile } from './storage/image-storage';

@Injectable()
export class FileUploadService {
  constructor(private readonly prisma: PrismaService) {}

  async saveImage(file: MulterFile) {
    return this.prisma.image.create({
      data: {
        file_path: file.path,
        file_name: file.filename,
        mime_type: file.mimetype,
        created_at: new Date(),
      },
    });
  }

  async getImage(id: string) {
    const image = await this.prisma.image.findUnique({ where: { id } });
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return image;
  }
}
