import { Controller, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsersProvider } from 'src/providers/users.gateway.provider';
import { Post, Body } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User, RegisterUserDto, LoginUserDto } from 'src/models/user.model';

@ApiTags('authentication')
@Controller('users')
export class UsersController {
  constructor(private readonly usersProvider: UsersProvider) {}

  /**
   * Register a new user.
   *
   * @param user - The user object to register.
   * @param res - The response object.
   * @returns The response status and message.
   */
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'Created successfully.' })
  @ApiResponse({ status: 400, description: 'Missing fields.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  @ApiBody({
    type: RegisterUserDto,
    description: 'Json structure for user object',
  })
  @Post('register')
  async Register(@Body() user: User, @Res() res: Response) {
    console.log('entor en el gateway');
    const response = await this.usersProvider.registerUser(user);
    console.log(response);
    return res.status(response.status as number).json({
      success: response.success,
      message: response.message,
    });
  }

  /**
   * Login a user.
   *
   * @param user - The user object to login.
   * @param res - The response object.
   * @returns The response status, message, user object, and token.
   */
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'Logged in successfully.' })
  @ApiResponse({ status: 400, description: 'Missing fields.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiBody({
    type: LoginUserDto,
    description: 'Json structure for user object',
  })
  @Post('login')
  async Login(@Body() user: User, @Res() res: Response) {
    const response = await this.usersProvider.loginUser(user);
    return res.status(response.status as number).json({
      success: response.success,
      message: response.message,
      user: response.user,
      token: response.token,
    });
  }
}
