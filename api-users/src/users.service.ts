import { Injectable } from '@nestjs/common';
import { DatabaseService } from './databases/db_connection';
import { User, userData } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SecurityService } from './security/user.security.service';

@Injectable()
export class UsersServices {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly securityService: SecurityService,
  ) {}

  async register(
    data: userData,
  ): Promise<{ status: number; success: boolean; message: string }> {
    const userInstance = this.instanceUser(data);
    const db = this.databaseService.getDb();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({
      $or: [{ email: data.email }, { name: data.name }],
    });
    if (user) {
      return { status: 404, success: false, message: 'User already exists' };
    }
    await usersCollection.insertOne(userInstance);
    return { status: 200, success: true, message: 'User created successfully' };
  }

  async login(data: userData): Promise<{
    status: number;
    success: boolean;
    message: string;
    user?: userData;
    token?: string;
  }> {
    const db = this.databaseService.getDb();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({
      email: data.email,
    });
    if (!user) {
      return { status: 404, success: false, message: 'Invalid credentials' };
    }
    const passwordMatch = bcrypt.compareSync(data.password, user.password);
    if (!passwordMatch) {
      return { status: 400, success: false, message: 'Invalid credentials' };
    }
    delete user.password;
    const token = this.securityService.generateToken({ ...user } as userData);
    return {
      status: 200,
      success: true,
      message: 'User created successfully',
      user: { ...user } as userData,
      token: token,
    };
  }

  verifyToken(token: string) {
    return this.securityService.verifyToken(token);
  }

  validateDataRegister(data: userData): {
    status?: number;
    success: boolean;
    message?: string;
  } {
    if (typeof data.name !== 'string') {
      return {
        status: 400,
        success: false,
        message: "'name' must be a string",
      };
    }

    if (
      typeof data.email !== 'string' ||
      !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    ) {
      return {
        status: 400,
        success: false,
        message: "'email' must be a valid email address",
      };
    }

    if (typeof data.password !== 'string' || data.password.length < 8) {
      return {
        status: 400,
        success: false,
        message:
          "'password' must be a string with a minimum length of 8 characters",
      };
    }

    return { success: true };
  }

  validateDataLogin(data: userData): {
    status?: number;
    success: boolean;
    message?: string;
  } {
    if (
      typeof data.email !== 'string' ||
      !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    ) {
      return {
        status: 400,
        success: false,
        message: "'email' must be a valid email address",
      };
    }

    if (typeof data.password !== 'string' || data.password.length < 8) {
      return {
        status: 400,
        success: false,
        message:
          "'password' must be a string with a minimum length of 8 characters",
      };
    }

    return { success: true };
  }

  instanceUser(data: userData): User {
    const hashedPassword = bcrypt.hashSync(
      data.password,
      parseInt(process.env.PASSWORD_SALT),
    );
    return new User(
      data.name,
      data.email,
      hashedPassword,
      new Date(),
      new Date(),
    );
  }
}
