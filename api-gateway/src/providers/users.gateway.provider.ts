import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserData } from 'src/entities/user.entitie';

@Injectable()
export class UsersProvider {
  constructor(@Inject('users-microservice') private usersClient: ClientProxy) {}

  async registerUser(user: UserData) {
    const response = await this.usersClient
      .send('register_user', user)
      .toPromise();
    return response;
  }

  async loginUser(user: UserData) {
    const response = await this.usersClient
      .send('login_user', user)
      .toPromise();
    return response;
  }

}
