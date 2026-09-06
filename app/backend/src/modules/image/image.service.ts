import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { RedisService } from '@/lib/redis/redis.service';
import { ImageResponseDto } from './dto/response.dto';

export const ALL_IMAGE_CACHE_KEY = 'image:all';
export const IMAGE_CACHE_TTL_SECONDS = 5 * 60;
export const imageCacheKey = (id: string): string => `image:${id}`;

@Injectable()
export class ImageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll(): Promise<ImageResponseDto[]> {
    const cached = await this.redis.get(ALL_IMAGE_CACHE_KEY).catch(() => null);
    if (cached) {
      return JSON.parse(cached) as ImageResponseDto[];
    }

    const images = await this.prisma.image.findMany();
    await this.redis
      .set(ALL_IMAGE_CACHE_KEY, JSON.stringify(images), 'EX', IMAGE_CACHE_TTL_SECONDS)
      .catch(() => undefined);
    return images;
  }

  async findOne(id: string) {
    const key = imageCacheKey(id);
    const cached = await this.redis.get(key).catch(() => null);
    if (cached) {
      return JSON.parse(cached) as ImageResponseDto;
    }

    const image = await this.prisma.image.findUniqueOrThrow({ where: { id } });
    await this.redis
      .set(key, JSON.stringify(image), 'EX', IMAGE_CACHE_TTL_SECONDS)
      .catch(() => undefined);
    return image;
  }
}
