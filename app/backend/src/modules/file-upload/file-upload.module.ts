import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { PassportSessionGuard } from '../auth/passport-session.guard';

@Module({
  imports: [PassportModule.register({ session: false })],
  controllers: [FileUploadController],
  providers: [FileUploadService, PassportSessionGuard],
})
export class FileUploadModule {}
