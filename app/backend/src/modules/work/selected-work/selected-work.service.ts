import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { RedisService } from '@/lib/redis/redis.service';
import { ResponseSelectedWork } from './dto/response.dto';

const CACHE_TTL = 43200; // This will cache the data for 12 hours

@Injectable()
export class SelectedWorkService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll(): Promise<ResponseSelectedWork[]> {
    const cacheKey = 'works:selected:all';

    const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const selectedWorks = await this.prisma.work.findMany({
      where: {
        is_selected: true,
      },
    });

    if (selectedWorks.length > 0) {
      await this.redis.set(cacheKey, JSON.stringify(selectedWorks), 'EX', CACHE_TTL);
    }

    return selectedWorks;
  }

  async findOne(name: string): Promise<ResponseSelectedWork> {
    const cacheKey = `works:name:${name.toLowerCase()}`;

    const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const selectedWorks = await this.prisma.work.findFirstOrThrow({
      where: {
        name: name,
        is_selected: true,
      },
    });

    if (selectedWorks) {
      await this.redis.set(cacheKey, JSON.stringify(selectedWorks), 'EX', CACHE_TTL);
    }

    return selectedWorks;
  }
}
