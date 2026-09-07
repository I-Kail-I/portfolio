import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { describe, expect, it, beforeEach, jest, type Mock } from 'bun:test';
import {
  IMAGE_CLEANUP_CRON,
  IMAGE_CLEANUP_JOB,
  IMAGE_CLEANUP_JOB_ID,
  IMAGE_CLEANUP_QUEUE,
  IMAGE_CLEANUP_TIMEZONE,
} from './image-cleanup.constants';
import { ImageCleanupScheduler } from './image-cleanup.scheduler';

const asMock = <T extends (...args: any[]) => any>(fn: unknown): Mock<T> => fn as Mock<T>;

const mockQueue = {
  add: jest.fn().mockResolvedValue({}),
};

describe('ImageCleanupScheduler', () => {
  let scheduler: ImageCleanupScheduler;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageCleanupScheduler,
        { provide: getQueueToken(IMAGE_CLEANUP_QUEUE), useValue: mockQueue },
      ],
    }).compile();

    scheduler = module.get<ImageCleanupScheduler>(ImageCleanupScheduler);
  });

  it('should be defined', () => {
    expect(scheduler).toBeDefined();
  });

  it('should register a nightly repeat job on module init', async () => {
    await scheduler.onModuleInit();

    expect(asMock(mockQueue.add)).toHaveBeenCalledTimes(1);
    expect(asMock(mockQueue.add)).toHaveBeenCalledWith(
      IMAGE_CLEANUP_JOB,
      {},
      {
        jobId: IMAGE_CLEANUP_JOB_ID,
        repeat: { pattern: IMAGE_CLEANUP_CRON, tz: IMAGE_CLEANUP_TIMEZONE },
        removeOnComplete: true,
        removeOnFail: 100,
      },
    );
  });

  it('should run every day at 12AM UTC', () => {
    expect(IMAGE_CLEANUP_CRON).toBe('0 0 * * *');
    expect(IMAGE_CLEANUP_TIMEZONE).toBe('UTC');
  });
});
