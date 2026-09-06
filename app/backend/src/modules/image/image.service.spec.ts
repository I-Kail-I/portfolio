import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it, beforeEach, afterEach, jest, type Mock } from 'bun:test';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { RedisService } from '@/lib/redis/redis.service';
import type { ImageResponseDto } from './dto/response.dto';
import {
  ALL_IMAGE_CACHE_KEY,
  imageCacheKey,
  IMAGE_CACHE_TTL_SECONDS,
  ImageService,
} from './image.service';

const asMock = <T extends (...args: any[]) => any>(fn: unknown): Mock<T> => fn as Mock<T>;

const mockPrisma = {
  image: {
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
  },
};

const mockRedis = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK'),
  del: jest.fn().mockResolvedValue(1),
};

function createMockImage(overrides = {}): ImageResponseDto {
  return {
    id: '1',
    file_path: 'upload/image.jpg',
    file_name: 'image.jpg',
    mime_type: 'image/jpeg',
    status: 'active',
    created_at: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<ImageService>(ImageService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return cached images without hitting the database', async () => {
      const expected = [createMockImage(), createMockImage({ id: '2' })];
      asMock(mockRedis.get).mockResolvedValue(JSON.stringify(expected));

      const result = await service.findAll();

      expect(result).toEqual(JSON.parse(JSON.stringify(expected)));
      expect(asMock(mockPrisma.image.findMany)).not.toHaveBeenCalled();
      expect(asMock(mockRedis.set)).not.toHaveBeenCalled();
    });

    it('should query the database and populate the cache on a miss', async () => {
      const expected = [createMockImage(), createMockImage({ id: '2' })];
      asMock(mockRedis.get).mockResolvedValue(null);
      asMock(mockPrisma.image.findMany).mockResolvedValue(expected);

      const result = await service.findAll();

      expect(result).toEqual(expected);
      expect(asMock(mockRedis.get)).toHaveBeenCalledWith(ALL_IMAGE_CACHE_KEY);
      expect(asMock(mockPrisma.image.findMany)).toHaveBeenCalled();
      expect(asMock(mockRedis.set)).toHaveBeenCalledWith(
        ALL_IMAGE_CACHE_KEY,
        JSON.stringify(expected),
        'EX',
        IMAGE_CACHE_TTL_SECONDS,
      );
    });

    it('should return an empty array when no image exists', async () => {
      asMock(mockPrisma.image.findMany).mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return the cached image without hitting the database', async () => {
      const image = createMockImage();
      asMock(mockRedis.get).mockResolvedValue(JSON.stringify(image));

      const result = await service.findOne('1');

      expect(result).toEqual(JSON.parse(JSON.stringify(image)));
      expect(asMock(mockPrisma.image.findUniqueOrThrow)).not.toHaveBeenCalled();
      expect(asMock(mockRedis.set)).not.toHaveBeenCalled();
    });

    it('should query the database and populate the cache on a miss', async () => {
      const image = createMockImage();
      asMock(mockRedis.get).mockResolvedValue(null);
      asMock(mockPrisma.image.findUniqueOrThrow).mockResolvedValue(image);

      const result = await service.findOne('1');

      expect(result).toEqual(image);
      expect(asMock(mockRedis.get)).toHaveBeenCalledWith(imageCacheKey('1'));
      expect(asMock(mockPrisma.image.findUniqueOrThrow)).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(asMock(mockRedis.set)).toHaveBeenCalledWith(
        imageCacheKey('1'),
        JSON.stringify(image),
        'EX',
        IMAGE_CACHE_TTL_SECONDS,
      );
    });

    it('should propagate when the image is not found', async () => {
      asMock(mockPrisma.image.findUniqueOrThrow).mockRejectedValue(new Error('Not found'));

      await expect(service.findOne('missing-id')).rejects.toThrow('Not found');
    });
  });
});
