import { Injectable } from '@nestjs/common';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { WorkResponseDto } from './dto/response-dto';
import { RedisService } from '@/lib/redis/redis.service';

export const ALL_WORK_CACHE_KEY = 'work:all';
export const WORK_CACHE_TTL_SECONDS = 5 * 60;
export const workCacheKey = (id: string): string => `work:${id}`;

@Injectable()
export class WorkService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(createWorkDto: CreateWorkDto): Promise<WorkResponseDto> {
    const { image_id, ...data } = createWorkDto;
    const work = await this.prisma.work.create({
      data: {
        ...data,
        image: { connect: { id: image_id, status: 'active' } },
      },
    });
    await this.redis.del(ALL_WORK_CACHE_KEY).catch(() => undefined);
    return work;
  }

  async findAll(): Promise<WorkResponseDto[]> {
    const cached = await this.redis.get(ALL_WORK_CACHE_KEY).catch(() => null);
    if (cached) {
      return JSON.parse(cached) as WorkResponseDto[];
    }

    const works = await this.prisma.work.findMany();
    await this.redis
      .set(ALL_WORK_CACHE_KEY, JSON.stringify(works), 'EX', WORK_CACHE_TTL_SECONDS)
      .catch(() => undefined);
    return works;
  }

  async findOne(id: string) {
    const key = workCacheKey(id);
    const cached = await this.redis.get(key).catch(() => null);
    if (cached) {
      return JSON.parse(cached) as WorkResponseDto;
    }

    const work = await this.prisma.work.findUniqueOrThrow({ where: { id } });
    await this.redis
      .set(key, JSON.stringify(work), 'EX', WORK_CACHE_TTL_SECONDS)
      .catch(() => undefined);
    return work;
  }

  async update(id: string, updateWorkDto: UpdateWorkDto) {
    const work = await this.prisma.work.update({
      where: { id },
      data: { ...updateWorkDto },
    });
    await this.invalidateWorkCache(id);
    return work;
  }

  async remove(id: string) {
    const work = await this.prisma.work.delete({
      where: { id },
    });
    await this.invalidateWorkCache(id);
    return work;
  }

  private async invalidateWorkCache(id: string): Promise<void> {
    await Promise.all([this.redis.del(ALL_WORK_CACHE_KEY), this.redis.del(workCacheKey(id))]).catch(
      () => undefined,
    );
  }

  async findByName(name: string) {
    const key = `work:name:${name}`;
    const cached = await this.redis.get(key).catch(() => null);

    if (cached) {
      return JSON.parse(cached) as WorkResponseDto;
    }

    const work = await this.prisma.work.findFirstOrThrow({ where: { name } });

    await this.redis
      .set(key, JSON.stringify(work), 'EX', WORK_CACHE_TTL_SECONDS)
      .catch(() => undefined);

    return work;
  }
}
