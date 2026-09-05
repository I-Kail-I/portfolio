import { randomUUID } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { BadRequestException } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

const IMAGE_EXTENSIONS: Record<(typeof IMAGE_MIME_TYPES)[number], string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? 'uploads/images';

export interface MulterFile {
  originalname: string;
  mimetype: string;
  size: number;
  filename: string;
  path: string;
}

const imageStorage = {
  async _handleFile(
    _req: never,
    file: { mimetype: string; originalname: string; stream: NodeJS.ReadableStream },
    callback: (
      error: Error | null,
      info?: { filename: string; path: string; size: number },
    ) => void,
  ): Promise<void> {
    const extension = IMAGE_EXTENSIONS[file.mimetype as (typeof IMAGE_MIME_TYPES)[number]];
    if (!extension) {
      callback(new BadRequestException('Unsupported image type'));
      return;
    }

    const filename = `${randomUUID()}${extension}`;
    const destination = join(process.cwd(), UPLOAD_DIR);
    const filePath = join(UPLOAD_DIR, filename);

    try {
      await mkdir(destination, { recursive: true });
    } catch (error) {
      callback(error as Error);
      return;
    }

    const writeStream = createWriteStream(filePath);
    file.stream.pipe(writeStream);

    writeStream.on('error', (error) => callback(error));
    writeStream.on('finish', () =>
      callback(null, { filename, path: filePath, size: writeStream.bytesWritten }),
    );
  },

  _removeFile(_req: never, file: { path?: string }, callback: (error: Error | null) => void): void {
    const filePath = file.path;
    if (filePath) {
      import('node:fs').then(({ unlink }) => unlink(filePath, () => callback(null)));
    } else {
      callback(null);
    }
  },
};

export const imageMulterOptions: MulterOptions = {
  storage: imageStorage,
  // Limit file size to 5MB and 1 file only
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (
    _req: never,
    file: { mimetype: string },
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (IMAGE_MIME_TYPES.includes(file.mimetype as (typeof IMAGE_MIME_TYPES)[number])) {
      callback(null, true);
      return;
    }
    callback(new BadRequestException('Only JPEG, PNG and WebP images are allowed'), false);
  },
};
