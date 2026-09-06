import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({ example: 'My Blog' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'This is my blog.' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ example: 'This is the description' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 'upload/image.jpg' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^upload\//, { message: 'The path must start with "upload/"' })
  image_url!: string;

  @ApiProperty({ example: '01a05b3d-a607-775f-b3cc-ecc76e601d98' })
  @IsString()
  @IsNotEmpty()
  image_id!: string;

  @ApiProperty({ example: ['badge1', 'badge2'] })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  badge!: string[];

  @ApiProperty({ example: 'Hover text' })
  @IsString()
  @IsNotEmpty()
  hover_text!: string;
}
