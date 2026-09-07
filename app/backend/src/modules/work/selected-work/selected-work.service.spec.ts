import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it, beforeEach, afterEach, jest, type Mock } from 'bun:test';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { RedisService } from '@/lib/redis/redis.service';
import type { ResponseSelectedWork } from './dto/response.dto';
import { SelectedWorkService } from './selected-work.service';

const asMock = <T extends (...args: any[]) => any>(fn: unknown): Mock<T> => fn as Mock<T>;

const CACHE_TTL_SECONDS = 43200;
const ALL_CACHE_KEY = 'works:selected:all';

const mockPrisma = {
  work: {
    findMany: jest.fn(),
    findFirstOrThrow: jest.fn(),
  },
};

const mockRedis = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK'),
  del: jest.fn().mockResolvedValue(1),
};

function createMockSelectedWork(overrides = {}): ResponseSelectedWork {
  return {
    id: '1',
    name: 'My Work',
    is_selected: true,
    description: 'This is the description',
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

describe('SelectedWorkService', () => {
  let service: SelectedWorkService;

  beforeEach(async () => {
    jest.clearAllMocks();
    asMock(mockRedis.get).mockResolvedValue(null);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SelectedWorkService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<SelectedWorkService>(SelectedWorkService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return cached selected work entries without hitting the database', async () => {
      const expected = [
        createMockSelectedWork(),
        createMockSelectedWork({ id: '2', name: 'Another Work' }),
      ];
      asMock(mockRedis.get).mockResolvedValue(JSON.stringify(expected));

      const result = await service.findAll();

      expect(result).toEqual(JSON.parse(JSON.stringify(expected)));
      expect(asMock(mockPrisma.work.findMany)).not.toHaveBeenCalled();
      expect(asMock(mockRedis.set)).not.toHaveBeenCalled();
    });

    it('should query selected work and populate the cache on a miss', async () => {
      const expected = [createMockSelectedWork()];
      asMock(mockPrisma.work.findMany).mockResolvedValue(expected);

      const result = await service.findAll();

      expect(result).toEqual(expected);
      expect(asMock(mockRedis.get)).toHaveBeenCalledWith(ALL_CACHE_KEY);
      expect(asMock(mockPrisma.work.findMany)).toHaveBeenCalledWith({
        where: { is_selected: true },
      });
      expect(asMock(mockRedis.set)).toHaveBeenCalledWith(
        ALL_CACHE_KEY,
        JSON.stringify(expected),
        'EX',
        CACHE_TTL_SECONDS,
      );
    });

    it('should not populate the cache when no selected work exists', async () => {
      asMock(mockPrisma.work.findMany).mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(asMock(mockRedis.set)).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const name = 'My Work';
    const cacheKey = `works:name:${name.toLowerCase()}`;

    it('should return the cached work entry without hitting the database', async () => {
      const work = createMockSelectedWork();
      asMock(mockRedis.get).mockResolvedValue(JSON.stringify(work));

      const result = await service.findOne(name);

      expect(result).toEqual(JSON.parse(JSON.stringify(work)));
      expect(asMock(mockPrisma.work.findFirstOrThrow)).not.toHaveBeenCalled();
      expect(asMock(mockRedis.set)).not.toHaveBeenCalled();
    });

    it('should query the database and populate the cache on a miss', async () => {
      const work = createMockSelectedWork();
      asMock(mockRedis.get).mockResolvedValue(null);
      asMock(mockPrisma.work.findFirstOrThrow).mockResolvedValue(work);

      const result = await service.findOne(name);

      expect(result).toEqual(work);
      expect(asMock(mockRedis.get)).toHaveBeenCalledWith(cacheKey);
      expect(asMock(mockPrisma.work.findFirstOrThrow)).toHaveBeenCalledWith({
        where: { name, is_selected: true },
      });
      expect(asMock(mockRedis.set)).toHaveBeenCalledWith(
        cacheKey,
        JSON.stringify(work),
        'EX',
        CACHE_TTL_SECONDS,
      );
    });

    it('should propagate when the work entry is not found', async () => {
      asMock(mockPrisma.work.findFirstOrThrow).mockRejectedValue(new Error('Not found'));

      await expect(service.findOne('missing-name')).rejects.toThrow('Not found');
    });
  });
});
