import { createReadStream, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';
import { imageMulterOptions, type MulterFile, UPLOAD_DIR } from './storage/image-storage';
import { PassportSessionGuard } from '../auth/passport-session.guard';

@Controller('file-upload')
@UseGuards(PassportSessionGuard)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOkResponse({ description: 'Image uploaded successfully' })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', imageMulterOptions))
  uploadImage(@UploadedFile() file: MulterFile) {
    return this.fileUploadService.saveImage(file);
  }

  @ApiOkResponse({ description: 'Image file' })
  @Get(':id')
  async getImage(@Param('id') id: string) {
    const image = await this.fileUploadService.getImage(id);
    const filePath = join(process.cwd(), UPLOAD_DIR, image.file_name);
    if (!existsSync(filePath)) {
      throw new NotFoundException('Image file not found');
    }
    return new StreamableFile(createReadStream(filePath), {
      type: image.mime_type,
      disposition: `inline; filename="${image.file_name}"`,
    });
  }
}
