import { ApiProperty } from '@nestjs/swagger';
import { ImageStatus } from '@/generated/prisma/enums';

export class ImageResponseDto {
  @ApiProperty({ example: '01a05b3d-a607-775f-b3cc-ecc76e601d98' })
  id!: string;

  @ApiProperty({ example: 'upload/image.jpg' })
  file_path!: string;

  @ApiProperty({ example: 'image.jpg' })
  file_name!: string;

  @ApiProperty({ example: 'image/jpeg' })
  mime_type!: string;

  @ApiProperty({ example: ImageStatus.active, enum: ImageStatus })
  status!: ImageStatus;

  @ApiProperty({ example: new Date() })
  created_at!: Date;
}
