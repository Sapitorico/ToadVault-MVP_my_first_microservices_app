import { Controller } from '@nestjs/common';
import { UsersServices } from './users.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersServices) {}

  /**
   * Handles the 'register_user' event.
   * Validates the registration data and registers the user.
   * @param data - The data for user registration.
   * @returns The response from the registration process.
   */
  @EventPattern('register_user')
  async handleRegister(data: any) {
    const validate = this.usersService.validateDataRegister(data);
    if (!validate.success) {
      return validate;
    }
    const response = await this.usersService.register(data);
    return response;
  }

  /**
   * Handles the 'login_user' event.
   * Validates the login data and performs user login.
   * @param data - The data for user login.
   * @returns The response from the login process.
   */
  @EventPattern('login_user')
  async handleLogin(data: any) {
    const validate = this.usersService.validateDataLogin(data);
    if (!validate.success) {
      return validate;
    }
    const response = await this.usersService.login(data);
    return response;
  }
}
