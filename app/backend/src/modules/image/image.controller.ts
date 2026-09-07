import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { ImageResponseDto } from './dto/response.dto';
import { PassportSessionGuard } from '../auth/passport-session.guard';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOkResponse({ type: ImageResponseDto, isArray: true })
  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the image to retrieve',
    required: true,
  })
  @ApiOkResponse({ type: ImageResponseDto })
  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(id);
  }

  @UseGuards(PassportSessionGuard)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the image to delete',
    required: true,
  })
  @ApiOkResponse({ type: ImageResponseDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(id);
  }
}
