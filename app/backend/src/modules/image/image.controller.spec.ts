import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it, beforeEach, jest } from 'bun:test';
import type { ImageResponseDto } from './dto/response.dto';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

describe('ImageController', () => {
  let controller: ImageController;

  const mockImageService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  function createImage(): ImageResponseDto {
    return {
      id: '1',
      file_path: 'upload/image.jpg',
      file_name: 'image.jpg',
      mime_type: 'image/jpeg',
      status: 'active',
      created_at: new Date('2026-01-01T00:00:00.000Z'),
    };
  }

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageController],
      providers: [{ provide: ImageService, useValue: mockImageService }],
    }).compile();

    controller = module.get<ImageController>(ImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call imageService.findAll and return the result', async () => {
      const expected = [createImage()];
      mockImageService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(result).toEqual(expected);
      expect(mockImageService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call imageService.findOne with the id and return the result', async () => {
      const expected = createImage();
      mockImageService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne('1');

      expect(result).toEqual(expected);
      expect(mockImageService.findOne).toHaveBeenCalledWith('1');
    });
  });
});
