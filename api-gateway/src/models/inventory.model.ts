import { ApiProperty } from '@nestjs/swagger';

export interface inventoryData {
  _id?: string;
  barcode: string;
  name: string;
  price?: number;
  stock?: number;
  created_at: Date;
  updated_at: Date;
}

export class NewItemDto {
  @ApiProperty({
    example: 'Potato Chips',
    description: 'The name of the item',
    required: true,
  })
  name: string;

  @ApiProperty({
    example: '7730900224055',
    description: 'The barcode of the item',
    required: true,
  })
  barcode: string;
}
export class UpdateItemDto {
  @ApiProperty({
    example: 100,
    description: 'Price of item',
    required: true,
  })
  price: number;

  @ApiProperty({
    example: 10,
    description: 'Stock of item',
    required: true,
  })
  stock: number;
}
