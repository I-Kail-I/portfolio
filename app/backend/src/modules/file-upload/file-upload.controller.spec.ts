import * as fs from 'node:fs';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { NotFoundException, StreamableFile } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it, beforeEach, afterEach, jest, type Mock } from 'bun:test';
import { ImageStatus } from '@/generated/prisma/enums';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { UPLOAD_DIR } from './storage/image-storage';
import { PassportSessionGuard } from '../auth/passport-session.guard';

const asMock = <T extends (...args: any[]) => any>(fn: unknown): Mock<T> => fn as Mock<T>;

const mockFileUploadService = {
  saveImage: jest.fn(),
  getImage: jest.fn(),
};

function createMockFile() {
  return {
    originalname: 'photo.jpg',
    mimetype: 'image/jpeg',
    size: 100,
    filename: 'abc.jpg',
    path: 'uploads/images/abc.jpg',
  };
}

function createMockImage(overrides = {}) {
  return {
    id: '1',
    file_path: 'uploads/images/abc.jpg',
    file_name: 'abc.jpg',
    mime_type: 'image/jpeg',
    status: ImageStatus.pending,
    created_at: new Date(),
    ...overrides,
  };
}

describe('FileUploadController', () => {
  let controller: FileUploadController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
      providers: [{ provide: FileUploadService, useValue: mockFileUploadService }],
    })
      .overrideGuard(PassportSessionGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<FileUploadController>(FileUploadController);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should save the uploaded file and return the image', async () => {
      const file = createMockFile();
      const image = createMockImage();
      asMock(mockFileUploadService.saveImage).mockResolvedValue(image);

      const result = await controller.uploadImage(file);

      expect(result).toEqual(image);
      expect(mockFileUploadService.saveImage).toHaveBeenCalledWith(file);
    });
  });

  describe('getImage', () => {
    it('should stream the image file when it exists', async () => {
      const image = createMockImage();
      const stream = new Readable({ read() {} });
      asMock(mockFileUploadService.getImage).mockResolvedValue(image);
      const existsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const readSpy = jest.spyOn(fs, 'createReadStream').mockReturnValue(stream as never);

      const result = await controller.getImage(image.id);

      const expectedPath = join(process.cwd(), UPLOAD_DIR, image.file_name);
      expect(result).toBeInstanceOf(StreamableFile);
      expect(mockFileUploadService.getImage).toHaveBeenCalledWith(image.id);
      expect(existsSpy).toHaveBeenCalledWith(expectedPath);
      expect(readSpy).toHaveBeenCalledWith(expectedPath);
    });

    it('should throw NotFoundException when the file does not exist on disk', async () => {
      const image = createMockImage();
      asMock(mockFileUploadService.getImage).mockResolvedValue(image);
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      const readSpy = jest.spyOn(fs, 'createReadStream');

      await expect(controller.getImage(image.id)).rejects.toThrow(NotFoundException);

      expect(readSpy).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when the image is not found', async () => {
      asMock(mockFileUploadService.getImage).mockRejectedValue(new NotFoundException());

      await expect(controller.getImage('nope')).rejects.toThrow(NotFoundException);
      expect(mockFileUploadService.getImage).toHaveBeenCalledWith('nope');
    });
  });
});
