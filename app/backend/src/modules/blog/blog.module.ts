import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { PassportSessionGuard } from '../auth/passport-session.guard';

@Module({
  imports: [PassportModule.register({ session: false })],
  controllers: [BlogController],
  providers: [BlogService, PassportSessionGuard],
})
export class BlogModule {}
