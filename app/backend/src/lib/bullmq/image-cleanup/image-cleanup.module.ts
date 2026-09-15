import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { IMAGE_CLEANUP_QUEUE } from './image-cleanup.constants';
import { ImageCleanupProcessor } from './image-cleanup.processor';
import { ImageCleanupScheduler } from './image-cleanup.scheduler';

@Module({
  imports: [BullModule.registerQueue({ name: IMAGE_CLEANUP_QUEUE })],
  providers: [ImageCleanupProcessor, ImageCleanupScheduler],
})
export class ImageCleanupModule {}
