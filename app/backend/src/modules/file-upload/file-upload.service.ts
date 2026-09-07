import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { RedisService } from '@/lib/redis/redis.service';
import { ALL_IMAGE_CACHE_KEY } from '../image/image.service';
import type { MulterFile } from './storage/image-storage';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async saveImage(file: MulterFile) {
    // Admin uploads are trusted: mark active so work.create can connect.
    // The uploader is session-guarded; anonymous users never reach here.
    const image = await this.prisma.image.create({
      data: {
        file_path: file.path,
        file_name: file.filename,
        mime_type: file.mimetype,
        status: 'active',
        created_at: new Date(),
      },
    });
    await this.redis.del(ALL_IMAGE_CACHE_KEY).catch(() => undefined);
    return image;
  }

  async getImage(id: string) {
    const image = await this.prisma.image.findUnique({ where: { id } });
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return image;
  }
}
