import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it, beforeEach, afterEach, jest, type Mock } from 'bun:test';
import type { Job } from 'bullmq';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { RedisService } from '@/lib/redis/redis.service';
import { ALL_IMAGE_CACHE_KEY } from '@/modules/image/image.service';
import { IMAGE_CLEANUP_JOB } from './image-cleanup.constants';
import { ImageCleanupProcessor } from './image-cleanup.processor';

const asMock = <T extends (...args: any[]) => any>(fn: unknown): Mock<T> => fn as Mock<T>;

const mockPrisma = {
  image: {
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
};

const mockRedis = {
  del: jest.fn().mockResolvedValue(1),
};

const jobNamed = (name: string): Job => ({ name }) as Job;

describe('ImageCleanupProcessor', () => {
  let processor: ImageCleanupProcessor;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageCleanupProcessor,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    processor = module.get<ImageCleanupProcessor>(ImageCleanupProcessor);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  it('should skip jobs with unknown name without touching the database', async () => {
    const result = await processor.process(jobNamed('something-else'));

    expect(result).toEqual({ deleted: 0 });
    expect(asMock(mockPrisma.image.findMany)).not.toHaveBeenCalled();
    expect(asMock(mockPrisma.image.deleteMany)).not.toHaveBeenCalled();
  });

  it('should return zero and delete nothing when no pending images exist', async () => {
    asMock(mockPrisma.image.findMany).mockResolvedValue([]);

    const result = await processor.process(jobNamed(IMAGE_CLEANUP_JOB));

    expect(result).toEqual({ deleted: 0 });
    expect(asMock(mockPrisma.image.findMany)).toHaveBeenCalledWith({
      where: { status: 'pending' },
      select: { id: true, file_path: true, file_name: true },
    });
    expect(asMock(mockPrisma.image.deleteMany)).not.toHaveBeenCalled();
    expect(asMock(mockRedis.del)).not.toHaveBeenCalled();
  });

  it('should delete pending rows and invalidate cache keys', async () => {
    const pending = [
      { id: '1', file_path: 'uploads/images/a.jpg', file_name: 'a.jpg' },
      { id: '2', file_path: 'uploads/images/b.jpg', file_name: 'b.jpg' },
    ];
    asMock(mockPrisma.image.findMany).mockResolvedValue(pending);
    asMock(mockPrisma.image.deleteMany).mockResolvedValue({ count: 2 });

    const result = await processor.process(jobNamed(IMAGE_CLEANUP_JOB));

    expect(result).toEqual({ deleted: 2 });
    expect(asMock(mockPrisma.image.deleteMany)).toHaveBeenCalledWith({
      where: { id: { in: ['1', '2'] } },
    });
    expect(asMock(mockRedis.del)).toHaveBeenCalledWith(ALL_IMAGE_CACHE_KEY, 'image:1', 'image:2');
  });

  it('should still delete rows when file unlink fails (missing files)', async () => {
    const pending = [{ id: '9', file_path: 'uploads/images/missing.jpg', file_name: 'missing.jpg' }];
    asMock(mockPrisma.image.findMany).mockResolvedValue(pending);
    asMock(mockPrisma.image.deleteMany).mockResolvedValue({ count: 1 });

    const result = await processor.process(jobNamed(IMAGE_CLEANUP_JOB));

    expect(result).toEqual({ deleted: 1 });
    expect(asMock(mockPrisma.image.deleteMany)).toHaveBeenCalled();
  });

  it('should swallow redis failures and still report deleted count', async () => {
    const pending = [{ id: '3', file_path: 'uploads/images/c.jpg', file_name: 'c.jpg' }];
    asMock(mockPrisma.image.findMany).mockResolvedValue(pending);
    asMock(mockPrisma.image.deleteMany).mockResolvedValue({ count: 1 });
    asMock(mockRedis.del).mockRejectedValue(new Error('redis down'));

    const result = await processor.process(jobNamed(IMAGE_CLEANUP_JOB));

    expect(result).toEqual({ deleted: 1 });
  });
});
