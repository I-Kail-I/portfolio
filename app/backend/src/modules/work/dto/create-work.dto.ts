import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateWorkDto {
  @ApiProperty({ example: 'My Work' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'This is my work.' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ example: false })
  @IsNotEmpty()
  @IsBoolean()
  is_selected!: boolean;

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
