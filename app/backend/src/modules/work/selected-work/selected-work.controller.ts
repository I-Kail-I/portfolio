import { Controller, Get, Param } from '@nestjs/common';
import { SelectedWorkService } from './selected-work.service';

@Controller('work/selected')
export class SelectedWorkController {
  constructor(private readonly selectedWorkService: SelectedWorkService) {}

  @Get()
  findAll() {
    return this.selectedWorkService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.selectedWorkService.findOne(name);
  }
}
