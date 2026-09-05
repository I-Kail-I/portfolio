import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it, beforeEach, afterEach, jest, type Mock } from 'bun:test';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { RedisService } from '@/lib/redis/redis.service';
import type { CreateWorkDto } from './dto/create-work.dto';
import type { UpdateWorkDto } from './dto/update-work.dto';
import type { WorkResponseDto } from './dto/response-dto';
import {
  ALL_WORK_CACHE_KEY,
  workCacheKey,
  WORK_CACHE_TTL_SECONDS,
  WorkService,
} from './work.service';

const asMock = <T extends (...args: any[]) => any>(fn: unknown): Mock<T> => fn as Mock<T>;

const mockPrisma = {
  work: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    findFirstOrThrow: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockRedis = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK'),
  del: jest.fn().mockResolvedValue(1),
};

function createMockWork(overrides = {}): WorkResponseDto {
  return {
    id: '1',
    name: 'My Work',
    content: 'This is my work.',
    image_url: 'upload/image.jpg',
    image_id: 'image-1',
    badge: ['badge1', 'badge2'],
    hover_text: 'Hover text',
    created_at: new Date('2026-01-01T00:00:00.000Z'),
    updated_at: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

describe('WorkService', () => {
  let service: WorkService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<WorkService>(WorkService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a work entry and invalidate the list cache', async () => {
      const dto: CreateWorkDto = {
        name: 'My Work',
        content: 'This is my work.',
        image_url: 'upload/image.jpg',
        image_id: 'image-1',
        badge: ['badge1'],
        hover_text: 'Hover text',
      };
      const expected = createMockWork({ badge: dto.badge });
      asMock(mockPrisma.work.create).mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(result).toEqual(expected);
      const { image_id, ...expectedData } = dto;
      expect(asMock(mockPrisma.work.create)).toHaveBeenCalledWith({
        data: {
          ...expectedData,
          image: { connect: { id: image_id, status: 'active' } },
        },
      });
      expect(asMock(mockRedis.del)).toHaveBeenCalledWith(ALL_WORK_CACHE_KEY);
    });
  });

  describe('findAll', () => {
    it('should return cached work entries without hitting the database', async () => {
      const expected = [createMockWork(), createMockWork({ id: '2' })];
      asMock(mockRedis.get).mockResolvedValue(JSON.stringify(expected));

      const result = await service.findAll();

      expect(result).toEqual(JSON.parse(JSON.stringify(expected)));
      expect(asMock(mockPrisma.work.findMany)).not.toHaveBeenCalled();
      expect(asMock(mockRedis.set)).not.toHaveBeenCalled();
    });

    it('should query the database and populate the cache on a miss', async () => {
      const expected = [createMockWork(), createMockWork({ id: '2' })];
      asMock(mockRedis.get).mockResolvedValue(null);
      asMock(mockPrisma.work.findMany).mockResolvedValue(expected);

      const result = await service.findAll();

      expect(result).toEqual(expected);
      expect(asMock(mockRedis.get)).toHaveBeenCalledWith(ALL_WORK_CACHE_KEY);
      expect(asMock(mockPrisma.work.findMany)).toHaveBeenCalled();
      expect(asMock(mockRedis.set)).toHaveBeenCalledWith(
        ALL_WORK_CACHE_KEY,
        JSON.stringify(expected),
        'EX',
        WORK_CACHE_TTL_SECONDS,
      );
    });

    it('should return an empty array when no work exists', async () => {
      asMock(mockPrisma.work.findMany).mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return the cached work entry without hitting the database', async () => {
      const work = createMockWork();
      asMock(mockRedis.get).mockResolvedValue(JSON.stringify(work));

      const result = await service.findOne('1');

      expect(result).toEqual(JSON.parse(JSON.stringify(work)));
      expect(asMock(mockPrisma.work.findUniqueOrThrow)).not.toHaveBeenCalled();
      expect(asMock(mockRedis.set)).not.toHaveBeenCalled();
    });

    it('should query the database and populate the cache on a miss', async () => {
      const work = createMockWork();
      asMock(mockRedis.get).mockResolvedValue(null);
      asMock(mockPrisma.work.findUniqueOrThrow).mockResolvedValue(work);

      const result = await service.findOne('1');

      expect(result).toEqual(work);
      expect(asMock(mockRedis.get)).toHaveBeenCalledWith(workCacheKey('1'));
      expect(asMock(mockPrisma.work.findUniqueOrThrow)).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(asMock(mockRedis.set)).toHaveBeenCalledWith(
        workCacheKey('1'),
        JSON.stringify(work),
        'EX',
        WORK_CACHE_TTL_SECONDS,
      );
    });

    it('should propagate when the work entry is not found', async () => {
      asMock(mockPrisma.work.findUniqueOrThrow).mockRejectedValue(new Error('Not found'));

      await expect(service.findOne('missing-id')).rejects.toThrow('Not found');
    });
  });

  describe('findByName', () => {
    const name = 'My Work';
    const cacheKey = `work:name:${name}`;

    it('should return the cached work entry without hitting the database', async () => {
      const work = createMockWork();
      asMock(mockRedis.get).mockResolvedValue(JSON.stringify(work));

      const result = await service.findByName(name);

      expect(result).toEqual(JSON.parse(JSON.stringify(work)));
      expect(asMock(mockPrisma.work.findFirstOrThrow)).not.toHaveBeenCalled();
      expect(asMock(mockRedis.set)).not.toHaveBeenCalled();
    });

    it('should query the database and populate the cache on a miss', async () => {
      const work = createMockWork();
      asMock(mockRedis.get).mockResolvedValue(null);
      asMock(mockPrisma.work.findFirstOrThrow).mockResolvedValue(work);

      const result = await service.findByName(name);

      expect(result).toEqual(work);
      expect(asMock(mockRedis.get)).toHaveBeenCalledWith(cacheKey);
      expect(asMock(mockPrisma.work.findFirstOrThrow)).toHaveBeenCalledWith({
        where: { name },
      });
      expect(asMock(mockRedis.set)).toHaveBeenCalledWith(
        cacheKey,
        JSON.stringify(work),
        'EX',
        WORK_CACHE_TTL_SECONDS,
      );
    });

    it('should propagate when the work entry is not found', async () => {
      asMock(mockPrisma.work.findFirstOrThrow).mockRejectedValue(new Error('Not found'));

      await expect(service.findByName('missing-name')).rejects.toThrow('Not found');
    });
  });

  describe('update', () => {
    it('should update the work entry and invalidate the caches', async () => {
      const updateDto: UpdateWorkDto = { name: 'Updated Work' };
      const expected = createMockWork({ name: 'Updated Work' });
      asMock(mockPrisma.work.update).mockResolvedValue(expected);

      const result = await service.update('1', updateDto);

      expect(result).toEqual(expected);
      expect(asMock(mockPrisma.work.update)).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { ...updateDto },
      });
      expect(asMock(mockRedis.del)).toHaveBeenCalledWith(ALL_WORK_CACHE_KEY);
      expect(asMock(mockRedis.del)).toHaveBeenCalledWith(workCacheKey('1'));
    });
  });

  describe('remove', () => {
    it('should delete the work entry and invalidate the caches', async () => {
      const work = createMockWork();
      asMock(mockPrisma.work.delete).mockResolvedValue(work);

      const result = await service.remove('1');

      expect(result).toEqual(work);
      expect(asMock(mockPrisma.work.delete)).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(asMock(mockRedis.del)).toHaveBeenCalledWith(ALL_WORK_CACHE_KEY);
      expect(asMock(mockRedis.del)).toHaveBeenCalledWith(workCacheKey('1'));
    });
  });
});
