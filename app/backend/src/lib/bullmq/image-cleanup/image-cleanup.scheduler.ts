import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  IMAGE_CLEANUP_CRON,
  IMAGE_CLEANUP_JOB,
  IMAGE_CLEANUP_JOB_ID,
  IMAGE_CLEANUP_QUEUE,
  IMAGE_CLEANUP_TIMEZONE,
} from './image-cleanup.constants';

@Injectable()
export class ImageCleanupScheduler implements OnModuleInit {
  private readonly logger = new Logger(ImageCleanupScheduler.name);

  constructor(@InjectQueue(IMAGE_CLEANUP_QUEUE) private readonly queue: Queue) {}

  async onModuleInit(): Promise<void> {
    await this.queue.add(
      IMAGE_CLEANUP_JOB,
      {},
      {
        jobId: IMAGE_CLEANUP_JOB_ID,
        repeat: { pattern: IMAGE_CLEANUP_CRON, tz: IMAGE_CLEANUP_TIMEZONE },
        removeOnComplete: true,
        removeOnFail: 100,
      },
    );
    this.logger.log(`Image cleanup scheduled: ${IMAGE_CLEANUP_CRON} (${IMAGE_CLEANUP_TIMEZONE})`);
  }
}
