import { ApiProperty } from '@nestjs/swagger';

export class ResponseSelectedWork {
  @ApiProperty({ example: '01a05b3d-a607-775f-b3cc-ecc76e601d98' })
  id!: string;

  @ApiProperty({ example: 'My Work' })
  name!: string;

  @ApiProperty({ example: false })
  is_selected!: boolean;

  @ApiProperty({ example: 'This is the description' })
  description!: string;

  @ApiProperty({ example: 'This is my work.' })
  content!: string;

  @ApiProperty({ example: 'upload/image.jpg' })
  image_url!: string;

  @ApiProperty({ example: '01a05b3d-a607-775f-b3cc-ecc76e601d98' })
  image_id!: string;

  @ApiProperty({ example: ['badge1', 'badge2'] })
  badge!: string[];

  @ApiProperty({ example: 'Hover text' })
  hover_text!: string;

  @ApiProperty({ example: new Date() })
  created_at!: Date;

  @ApiProperty({ example: new Date() })
  updated_at!: Date;
}
