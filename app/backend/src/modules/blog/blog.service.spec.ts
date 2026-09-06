import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it, beforeEach, afterEach, jest, type Mock } from 'bun:test';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { RedisService } from '@/lib/redis/redis.service';
import type { CreateBlogDto } from './dto/create-blog.dto';
import type { UpdateBlogDto } from './dto/update-blog.dto';
import type { BlogResponseDto } from './dto/response.dto';
import {
  ALL_BLOG_CACHE_KEY,
  blogCacheKey,
  BLOG_CACHE_TTL_SECONDS,
  BlogService,
} from './blog.service';

const asMock = <T extends (...args: any[]) => any>(fn: unknown): Mock<T> => fn as Mock<T>;

const mockPrisma = {
  blog: {
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

function createMockBlog(overrides = {}): BlogResponseDto {
  return {
    id: '1',
    title: 'My Blog',
    content: 'This is my blog.',
    image_url: 'upload/image.jpg',
    image_id: 'image-1',
    badge: ['badge1', 'badge2'],
    hover_text: 'Hover text',
    description: 'This is the description',
    created_at: new Date('2026-01-01T00:00:00.000Z'),
    updated_at: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a blog entry and invalidate the list cache', async () => {
      const dto: CreateBlogDto = {
        title: 'My Blog',
        content: 'This is my blog.',
        image_url: 'upload/image.jpg',
        image_id: 'image-1',
        badge: ['badge1'],
        hover_text: 'Hover text',
        description: 'This is the description',
      };
      const expected = createMockBlog({ badge: dto.badge });
      asMock(mockPrisma.blog.create).mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(result).toEqual(expected);
      expect(asMock(mockPrisma.blog.create)).toHaveBeenCalledWith({
        data: { ...dto },
      });
      expect(asMock(mockRedis.del)).toHaveBeenCalledWith(ALL_BLOG_CACHE_KEY);
    });
  });

  describe('findAll', () => {
    it('should return cached blog entries without hitting the database', async () => {
      const expected = [createMockBlog(), createMockBlog({ id: '2' })];
      asMock(mockRedis.get).mockResolvedValue(JSON.stringify(expected));

      const result = await service.findAll();

      expect(result).toEqual(JSON.parse(JSON.stringify(expected)));
      expect(asMock(mockPrisma.blog.findMany)).not.toHaveBeenCalled();
      expect(asMock(mockRedis.set)).not.toHaveBeenCalled();
    });

    it('should query the database and populate the cache on a miss', async () => {
      const expected = [createMockBlog(), createMockBlog({ id: '2' })];
      asMock(mockRedis.get).mockResolvedValue(null);
      asMock(mockPrisma.blog.findMany).mockResolvedValue(expected);

      const result = await service.findAll();

      expect(result).toEqual(expected);
      expect(asMock(mockRedis.get)).toHaveBeenCalledWith(ALL_BLOG_CACHE_KEY);
      expect(asMock(mockPrisma.blog.findMany)).toHaveBeenCalled();
      expect(asMock(mockRedis.set)).toHaveBeenCalledWith(
        ALL_BLOG_CACHE_KEY,
        JSON.stringify(expected),
        'EX',
        BLOG_CACHE_TTL_SECONDS,
      );
    });

    it('should return an empty array when no blog exists', async () => {
      asMock(mockPrisma.blog.findMany).mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return the cached blog entry without hitting the database', async () => {
      const blog = createMockBlog();
      asMock(mockRedis.get).mockResolvedValue(JSON.stringify(blog));

      const result = await service.findOne('1');

      expect(result).toEqual(JSON.parse(JSON.stringify(blog)));
      expect(asMock(mockPrisma.blog.findUniqueOrThrow)).not.toHaveBeenCalled();
      expect(asMock(mockRedis.set)).not.toHaveBeenCalled();
    });

    it('should query the database and populate the cache on a miss', async () => {
      const blog = createMockBlog();
      asMock(mockRedis.get).mockResolvedValue(null);
      asMock(mockPrisma.blog.findUniqueOrThrow).mockResolvedValue(blog);

      const result = await service.findOne('1');

      expect(result).toEqual(blog);
      expect(asMock(mockRedis.get)).toHaveBeenCalledWith(blogCacheKey('1'));
      expect(asMock(mockPrisma.blog.findUniqueOrThrow)).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(asMock(mockRedis.set)).toHaveBeenCalledWith(
        blogCacheKey('1'),
        JSON.stringify(blog),
        'EX',
        BLOG_CACHE_TTL_SECONDS,
      );
    });

    it('should propagate when the blog entry is not found', async () => {
      asMock(mockPrisma.blog.findUniqueOrThrow).mockRejectedValue(new Error('Not found'));

      await expect(service.findOne('missing-id')).rejects.toThrow('Not found');
    });
  });

  describe('findByTitle', () => {
    const title = 'My Blog';
    const cacheKey = `blog:title:${title}`;

    it('should return the cached blog entry without hitting the database', async () => {
      const blog = createMockBlog();
      asMock(mockRedis.get).mockResolvedValue(JSON.stringify(blog));

      const result = await service.findByTitle(title);

      expect(result).toEqual(JSON.parse(JSON.stringify(blog)));
      expect(asMock(mockPrisma.blog.findFirstOrThrow)).not.toHaveBeenCalled();
      expect(asMock(mockRedis.set)).not.toHaveBeenCalled();
    });

    it('should query the database and populate the cache on a miss', async () => {
      const blog = createMockBlog();
      asMock(mockRedis.get).mockResolvedValue(null);
      asMock(mockPrisma.blog.findFirstOrThrow).mockResolvedValue(blog);

      const result = await service.findByTitle(title);

      expect(result).toEqual(blog);
      expect(asMock(mockRedis.get)).toHaveBeenCalledWith(cacheKey);
      expect(asMock(mockPrisma.blog.findFirstOrThrow)).toHaveBeenCalledWith({
        where: { title },
      });
      expect(asMock(mockRedis.set)).toHaveBeenCalledWith(
        cacheKey,
        JSON.stringify(blog),
        'EX',
        BLOG_CACHE_TTL_SECONDS,
      );
    });

    it('should propagate when the blog entry is not found', async () => {
      asMock(mockPrisma.blog.findFirstOrThrow).mockRejectedValue(new Error('Not found'));

      await expect(service.findByTitle('missing-title')).rejects.toThrow('Not found');
    });
  });

  describe('update', () => {
    it('should update the blog entry and invalidate the caches', async () => {
      const updateDto: UpdateBlogDto = { title: 'Updated Blog' };
      const expected = createMockBlog({ title: 'Updated Blog' });
      asMock(mockPrisma.blog.update).mockResolvedValue(expected);

      const result = await service.update('1', updateDto);

      expect(result).toEqual(expected);
      expect(asMock(mockPrisma.blog.update)).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { ...updateDto },
      });
      expect(asMock(mockRedis.del)).toHaveBeenCalledWith(ALL_BLOG_CACHE_KEY);
      expect(asMock(mockRedis.del)).toHaveBeenCalledWith(blogCacheKey('1'));
    });
  });

  describe('remove', () => {
    it('should delete the blog entry and invalidate the caches', async () => {
      const blog = createMockBlog();
      asMock(mockPrisma.blog.delete).mockResolvedValue(blog);

      const result = await service.remove('1');

      expect(result).toEqual(blog);
      expect(asMock(mockPrisma.blog.delete)).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(asMock(mockRedis.del)).toHaveBeenCalledWith(ALL_BLOG_CACHE_KEY);
      expect(asMock(mockRedis.del)).toHaveBeenCalledWith(blogCacheKey('1'));
    });
  });
});
