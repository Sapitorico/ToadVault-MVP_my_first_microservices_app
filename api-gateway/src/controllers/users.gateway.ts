import { Controller, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsersProvider } from 'src/providers/users.gateway.provider';
import { Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserData } from 'src/entities/user.entitie';

@Controller('users')
export class UsersController {
  constructor(private readonly usersProvider: UsersProvider) {}

  @Post('register')
  async Register(@Body() user: UserData, @Res() res: Response) {
    const response = await this.usersProvider.registerUser(user);
    return res.status(response.status as number).json({
      success: response.success,
      message: response.message,
    });
  }

  @Post('login')
  async Login(@Body() user: UserData, @Res() res: Response) {
    const response = await this.usersProvider.loginUser(user);
    return res.status(response.status as number).json({
      success: response.success,
      message: response.message,
      user: response.user,
      token: response.token,
    });
  }
}
