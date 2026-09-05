import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { WorkService } from './work.service';
import { WorkController } from './work.controller';
import { PassportSessionGuard } from '../auth/passport-session.guard';

@Module({
  imports: [PassportModule.register({ session: false })],
  controllers: [WorkController],
  providers: [WorkService, PassportSessionGuard],
})
export class WorkModule {}
