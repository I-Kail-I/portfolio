import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it, beforeEach, afterEach, jest, type Mock } from 'bun:test';
import { ImageStatus } from '@/generated/prisma/enums';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { FileUploadService } from './file-upload.service';

const asMock = <T extends (...args: any[]) => any>(fn: unknown): Mock<T> => fn as Mock<T>;

const mockPrisma = {
  image: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

function createMockFile(overrides = {}) {
  return {
    originalname: 'photo.jpg',
    mimetype: 'image/jpeg',
    size: 100,
    filename: 'abc.jpg',
    path: 'uploads/images/abc.jpg',
    ...overrides,
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

describe('FileUploadService', () => {
  let service: FileUploadService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [FileUploadService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveImage', () => {
    it('should save an image record', async () => {
      const file = createMockFile();
      const image = createMockImage();
      asMock(mockPrisma.image.create).mockResolvedValue(image);

      const result = await service.saveImage(file);

      expect(result).toEqual(image);
      expect(asMock(mockPrisma.image.create)).toHaveBeenCalledWith({
        data: expect.objectContaining({
          file_path: file.path,
          file_name: file.filename,
          mime_type: file.mimetype,
        }),
      });
    });
  });

  describe('getImage', () => {
    it('should return the image when found', async () => {
      const image = createMockImage();
      asMock(mockPrisma.image.findUnique).mockResolvedValue(image);

      const result = await service.getImage(image.id);

      expect(result).toEqual(image);
      expect(asMock(mockPrisma.image.findUnique)).toHaveBeenCalledWith({
        where: { id: image.id },
      });
    });

    it('should throw NotFoundException when image is not found', async () => {
      asMock(mockPrisma.image.findUnique).mockResolvedValue(null);

      await expect(service.getImage('nope')).rejects.toThrow(NotFoundException);
    });
  });
});
