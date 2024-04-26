import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from 'src/models/user.model';

@Injectable()
export class UsersProvider {
  constructor(
    @Inject(process.env.USERS_MICROSERVICE_NAME)
    private usersClient: ClientProxy,
  ) {}

  /**
   * Registers a new user.
   * @param user The user object to be registered.
   * @returns A promise that resolves to the response from the users microservice.
   */
  async registerUser(user: User) {
    const response = await this.usersClient
      .send('register_user', user)
      .toPromise();
    return response;
  }

  /**
   * Logs in a user.
   * @param user The user object to be logged in.
   * @returns A promise that resolves to the response from the users microservice.
   */
  async loginUser(user: User) {
    const response = await this.usersClient
      .send('login_user', user)
      .toPromise();
    return response;
  }
}
