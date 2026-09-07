import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it, beforeEach, jest } from 'bun:test';
import type { CreateBlogDto } from './dto/create-blog.dto';
import type { UpdateBlogDto } from './dto/update-blog.dto';
import type { BlogResponseDto } from './dto/response.dto';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { PassportSessionGuard } from '../auth/passport-session.guard';

describe('BlogController', () => {
  let controller: BlogController;

  const mockBlogService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByTitle: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  function createBlog(): BlogResponseDto {
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
    };
  }

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [{ provide: BlogService, useValue: mockBlogService }],
    })
      .overrideGuard(PassportSessionGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<BlogController>(BlogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call blogService.create and return the result', async () => {
      const dto: CreateBlogDto = {
        title: 'My Blog',
        content: 'This is my blog.',
        image_url: 'upload/image.jpg',
        image_id: 'image-1',
        badge: ['badge1'],
        hover_text: 'Hover text',
        description: 'This is the description',
      };
      const expected = createBlog();
      mockBlogService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(result).toEqual(expected);
      expect(mockBlogService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call blogService.findAll and return the result', async () => {
      const expected = [createBlog()];
      mockBlogService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(result).toEqual(expected);
      expect(mockBlogService.findAll).toHaveBeenCalled();
    });
  });

  describe('findByTitle', () => {
    it('should call blogService.findByTitle with the title and return the result', async () => {
      const expected = createBlog();
      mockBlogService.findByTitle.mockResolvedValue(expected);

      const result = await controller.findByTitle('My Blog');

      expect(result).toEqual(expected);
      expect(mockBlogService.findByTitle).toHaveBeenCalledWith('My Blog');
    });
  });

  describe('findOne', () => {
    it('should call blogService.findOne with the id and return the result', async () => {
      const expected = createBlog();
      mockBlogService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne('1');

      expect(result).toEqual(expected);
      expect(mockBlogService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should call blogService.update with the id and dto and return the result', async () => {
      const updateDto: UpdateBlogDto = { title: 'Updated Blog' };
      const expected = createBlog();
      mockBlogService.update.mockResolvedValue(expected);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(expected);
      expect(mockBlogService.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should call blogService.remove with the id and return the result', async () => {
      const expected = createBlog();
      mockBlogService.remove.mockResolvedValue(expected);

      const result = await controller.remove('1');

      expect(result).toEqual(expected);
      expect(mockBlogService.remove).toHaveBeenCalledWith('1');
    });
  });
});
