import { Controller } from '@nestjs/common';
import { UsersServices } from './users.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersServices) {}

  @EventPattern('register_user')
  async handleRegister(data: any) {
    const validate = this.usersService.validateDataRegister(data);
    if (!validate.success) {
      return validate;
    }
    const response = await this.usersService.register(data);
    return response;
  }

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
