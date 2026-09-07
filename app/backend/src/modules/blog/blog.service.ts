import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { BlogResponseDto } from './dto/response.dto';
import { RedisService } from '@/lib/redis/redis.service';

export const ALL_BLOG_CACHE_KEY = 'blog:all';
export const BLOG_CACHE_TTL_SECONDS = 5 * 60;
export const blogCacheKey = (id: string): string => `blog:${id}`;

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<BlogResponseDto> {
    // NOTE: Blog has no Image relation in schema (unlike Work),
    // so image_id stored directly, no connect.
    const blog = await this.prisma.blog.create({
      data: { ...createBlogDto },
    });
    await this.redis.del(ALL_BLOG_CACHE_KEY).catch(() => undefined);
    return blog;
  }

  async findAll(): Promise<BlogResponseDto[]> {
    const cached = await this.redis.get(ALL_BLOG_CACHE_KEY).catch(() => null);
    if (cached) {
      return JSON.parse(cached) as BlogResponseDto[];
    }

    const blogs = await this.prisma.blog.findMany();
    await this.redis
      .set(ALL_BLOG_CACHE_KEY, JSON.stringify(blogs), 'EX', BLOG_CACHE_TTL_SECONDS)
      .catch(() => undefined);
    return blogs;
  }

  async findOne(id: string) {
    const key = blogCacheKey(id);
    const cached = await this.redis.get(key).catch(() => null);
    if (cached) {
      return JSON.parse(cached) as BlogResponseDto;
    }

    const blog = await this.prisma.blog.findUniqueOrThrow({ where: { id } });
    await this.redis
      .set(key, JSON.stringify(blog), 'EX', BLOG_CACHE_TTL_SECONDS)
      .catch(() => undefined);
    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    const blog = await this.prisma.blog.update({
      where: { id },
      data: { ...updateBlogDto },
    });
    await this.invalidateBlogCache(id);
    return blog;
  }

  async remove(id: string) {
    const blog = await this.prisma.blog.delete({
      where: { id },
    });
    await this.invalidateBlogCache(id);
    return blog;
  }

  private async invalidateBlogCache(id: string): Promise<void> {
    await Promise.all([this.redis.del(ALL_BLOG_CACHE_KEY), this.redis.del(blogCacheKey(id))]).catch(
      () => undefined,
    );
  }

  async findByTitle(title: string) {
    const key = `blog:title:${title}`;
    const cached = await this.redis.get(key).catch(() => null);

    if (cached) {
      return JSON.parse(cached) as BlogResponseDto;
    }

    const blog = await this.prisma.blog.findFirstOrThrow({ where: { title } });

    await this.redis
      .set(key, JSON.stringify(blog), 'EX', BLOG_CACHE_TTL_SECONDS)
      .catch(() => undefined);

    return blog;
  }
}
