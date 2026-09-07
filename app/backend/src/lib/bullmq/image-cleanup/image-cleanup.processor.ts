import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { isAbsolute, join } from 'node:path';
import { unlink } from 'node:fs/promises';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { RedisService } from '@/lib/redis/redis.service';
import { UPLOAD_DIR } from '@/modules/file-upload/storage/image-storage';
import { ALL_IMAGE_CACHE_KEY } from '@/modules/image/image.service';
import {
  IMAGE_CLEANUP_JOB,
  IMAGE_CLEANUP_QUEUE,
} from './image-cleanup.constants';

@Processor(IMAGE_CLEANUP_QUEUE)
export class ImageCleanupProcessor extends WorkerHost {
  private readonly logger = new Logger(ImageCleanupProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {
    super();
  }

  async process(job: Job): Promise<{ deleted: number }> {
    if (job.name !== IMAGE_CLEANUP_JOB) {
      return { deleted: 0 };
    }

    const pending = await this.prisma.image.findMany({
      where: { status: 'pending' },
      select: { id: true, file_path: true, file_name: true },
    });

    if (pending.length === 0) {
      this.logger.log('Image cleanup: no pending images');
      return { deleted: 0 };
    }

    await Promise.allSettled(pending.map((image) => this.removeFile(image)));

    const { count } = await this.prisma.image.deleteMany({
      where: { id: { in: pending.map((image) => image.id) } },
    });

    const cacheKeys = pending.map((image) => `image:${image.id}`);
    await this.redis.del(ALL_IMAGE_CACHE_KEY, ...cacheKeys).catch(() => undefined);

    this.logger.log(`Image cleanup: deleted ${count} pending images`);
    return { deleted: count };
  }

  private async removeFile(image: { file_path: string; file_name: string }): Promise<void> {
    const candidates = new Set<string>();
    if (image.file_path) {
      candidates.add(
        isAbsolute(image.file_path) ? image.file_path : join(process.cwd(), image.file_path),
      );
    }
    if (image.file_name) {
      candidates.add(join(process.cwd(), UPLOAD_DIR, image.file_name));
    }
    await Promise.allSettled(
      [...candidates].map((path) => unlink(path).catch(() => undefined)),
    );
  }
}
