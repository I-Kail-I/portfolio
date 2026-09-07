import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WorkService } from './work.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { WorkResponseDto } from './dto/response-dto';
import { PassportSessionGuard } from '../auth/passport-session.guard';

@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @UseGuards(PassportSessionGuard)
  @ApiBody({
    type: CreateWorkDto,
    description: 'The work data to create',
  })
  @ApiOkResponse({ type: WorkResponseDto })
  @Post()
  create(@Body() createWorkDto: CreateWorkDto) {
    return this.workService.create(createWorkDto);
  }

  @ApiOkResponse({ type: WorkResponseDto })
  @Get()
  findAll() {
    return this.workService.findAll();
  }

  @ApiParam({
    name: 'name',
    type: String,
    description: 'The name of the work to retrieve',
    required: true,
  })
  @ApiOkResponse({ type: WorkResponseDto })
  @Get('name/:name')
  findByName(@Param('name') name: string) {
    return this.workService.findByName(name);
  }

  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the work to retrieve',
    required: true,
  })
  @ApiOkResponse({ type: WorkResponseDto })
  // NOTE: 'id/:id' not ':id' — bare ':id' swallows GET /work/selected
  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.workService.findOne(id);
  }

  @UseGuards(PassportSessionGuard)
  @ApiOkResponse({ type: WorkResponseDto })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the work to update',
    required: true,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkDto: UpdateWorkDto) {
    return this.workService.update(id, updateWorkDto);
  }

  @UseGuards(PassportSessionGuard)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the work to delete',
    required: true,
  })
  @ApiOkResponse({ type: WorkResponseDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workService.remove(id);
  }
}
