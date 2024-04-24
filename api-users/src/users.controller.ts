import { Controller } from '@nestjs/common';
import { UsersServices } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { userData } from './entities/user.entity';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersServices) {}

  /**
   * Handles the 'register_user' event.
   * Validates the registration data and registers the user.
   * @param data - The data for user registration.
   * @returns The response from the registration process.
   */
  // @EventPattern('register_user')
  @MessagePattern('register_user')
  async handleRegister(@Payload() data: userData) {
    console.log("entro en usuairos")
    const validate = this.usersService.validateDataRegister(data);
    if (!validate.success) {
      return validate;
    }
    const response = await this.usersService.register(data);
    console.log(response)
    return response;
  }

  /**
   * Handles the 'login_user' event.
   * Validates the login data and performs user login.
   * @param data - The data for user login.
   * @returns The response from the login process.
   */
  @MessagePattern('login_user')
  async handleLogin(@Payload() data: userData) {
    const validate = this.usersService.validateDataLogin(data);
    if (!validate.success) {
      return validate;
    }
    const response = await this.usersService.login(data);
    return response;
  }
}
