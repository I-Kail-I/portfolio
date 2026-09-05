import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it, beforeEach, jest } from 'bun:test';
import type { CreateWorkDto } from './dto/create-work.dto';
import type { UpdateWorkDto } from './dto/update-work.dto';
import type { WorkResponseDto } from './dto/response-dto';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';
import { PassportSessionGuard } from '../auth/passport-session.guard';

describe('WorkController', () => {
  let controller: WorkController;

  const mockWorkService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByName: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  function createWork(): WorkResponseDto {
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
    };
  }

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkController],
      providers: [{ provide: WorkService, useValue: mockWorkService }],
    })
      .overrideGuard(PassportSessionGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<WorkController>(WorkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call workService.create and return the result', async () => {
      const dto: CreateWorkDto = {
        name: 'My Work',
        content: 'This is my work.',
        image_url: 'upload/image.jpg',
        image_id: 'image-1',
        badge: ['badge1'],
        hover_text: 'Hover text',
      };
      const expected = createWork();
      mockWorkService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(result).toEqual(expected);
      expect(mockWorkService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call workService.findAll and return the result', async () => {
      const expected = [createWork()];
      mockWorkService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(result).toEqual(expected);
      expect(mockWorkService.findAll).toHaveBeenCalled();
    });
  });

  describe('findByName', () => {
    it('should call workService.findByName with the name and return the result', async () => {
      const expected = createWork();
      mockWorkService.findByName.mockResolvedValue(expected);

      const result = await controller.findByName('My Work');

      expect(result).toEqual(expected);
      expect(mockWorkService.findByName).toHaveBeenCalledWith('My Work');
    });
  });

  describe('findOne', () => {
    it('should call workService.findOne with the id and return the result', async () => {
      const expected = createWork();
      mockWorkService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne('1');

      expect(result).toEqual(expected);
      expect(mockWorkService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should call workService.update with the id and dto and return the result', async () => {
      const updateDto: UpdateWorkDto = { name: 'Updated Work' };
      const expected = createWork();
      mockWorkService.update.mockResolvedValue(expected);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(expected);
      expect(mockWorkService.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should call workService.remove with the id and return the result', async () => {
      const expected = createWork();
      mockWorkService.remove.mockResolvedValue(expected);

      const result = await controller.remove('1');

      expect(result).toEqual(expected);
      expect(mockWorkService.remove).toHaveBeenCalledWith('1');
    });
  });
});
