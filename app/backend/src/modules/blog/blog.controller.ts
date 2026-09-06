import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { BlogResponseDto } from './dto/response.dto';
import { PassportSessionGuard } from '../auth/passport-session.guard';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(PassportSessionGuard)
  @ApiBody({
    type: CreateBlogDto,
    description: 'The blog data to create',
  })
  @ApiOkResponse({ type: BlogResponseDto })
  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @ApiOkResponse({ type: BlogResponseDto, isArray: true })
  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @ApiParam({
    name: 'title',
    type: String,
    description: 'The title of the blog to retrieve',
    required: true,
  })
  @ApiOkResponse({ type: BlogResponseDto })
  @Get('title/:title')
  findByTitle(@Param('title') title: string) {
    return this.blogService.findByTitle(title);
  }

  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the blog to retrieve',
    required: true,
  })
  @ApiOkResponse({ type: BlogResponseDto })
  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @UseGuards(PassportSessionGuard)
  @ApiOkResponse({ type: BlogResponseDto })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the blog to update',
    required: true,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @UseGuards(PassportSessionGuard)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the blog to delete',
    required: true,
  })
  @ApiOkResponse({ type: BlogResponseDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
