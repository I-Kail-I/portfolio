import { Module } from '@nestjs/common';
import { SelectedWorkService } from './selected-work.service';
import { SelectedWorkController } from './selected-work.controller';

@Module({
  providers: [SelectedWorkService],
  controllers: [SelectedWorkController],
})
export class SelectedWorkModule {}
