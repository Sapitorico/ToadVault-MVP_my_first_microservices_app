import { ApiProperty } from '@nestjs/swagger';

export interface User {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserDto {
  @ApiProperty({
    example: 'Sapardo',
    required: true,
  })
  name: string;

  @ApiProperty({
    example: 'sapardo@gmail.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: '12345678',
    required: true,
  })
  password: string;
}

export class LoginUserDto {

  @ApiProperty({
    example: 'sapardo@gmail.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: '12345678',
    required: true,
  })
  password: string;
}
