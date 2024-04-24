import { ApiProperty } from '@nestjs/swagger';

export interface Payment {
  cash: number;
}

export class PaymentDto {
  @ApiProperty({
    example: 100,
    description: 'The amount of cash',
    required: true,
  })
  cash: number;
}
