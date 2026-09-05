import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it, beforeEach, jest } from 'bun:test';
import type { ResponseSelectedWork } from './dto/response.dto';
import { SelectedWorkController } from './selected-work.controller';
import { SelectedWorkService } from './selected-work.service';

describe('SelectedWorkController', () => {
  let controller: SelectedWorkController;

  const mockSelectedWorkService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  function createSelectedWork(): ResponseSelectedWork {
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
    };
  }

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SelectedWorkController],
      providers: [{ provide: SelectedWorkService, useValue: mockSelectedWorkService }],
    }).compile();

    controller = module.get<SelectedWorkController>(SelectedWorkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call selectedWorkService.findAll and return the result', async () => {
      const expected = [createSelectedWork()];
      mockSelectedWorkService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(result).toEqual(expected);
      expect(mockSelectedWorkService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call selectedWorkService.findOne with the name and return the result', async () => {
      const expected = createSelectedWork();
      mockSelectedWorkService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne('My Work');

      expect(result).toEqual(expected);
      expect(mockSelectedWorkService.findOne).toHaveBeenCalledWith('My Work');
    });
  });
});
