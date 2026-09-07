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
    const image = await this.prisma.image.create({
      data: {
        file_path: file.path,
        file_name: file.filename,
        mime_type: file.mimetype,
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
