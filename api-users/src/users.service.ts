import { Injectable } from '@nestjs/common';
import { DatabaseService } from './databases/db_connection';
import { User, userData } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SecurityService } from './security/user.security.service';
process.loadEnvFile();

/**
 * Service responsible for user-related operations.
 */
@Injectable()
export class UsersServices {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly securityService: SecurityService,
  ) {}

  /**
   * Registers a new user.
   * @param data - The user data.
   * @returns An object containing the registration status, success flag, and message.
   */
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
      return { status: 409, success: false, message: 'User already exists' };
    }
    await usersCollection.insertOne(userInstance);
    return { status: 201, success: true, message: 'User created successfully' };
  }

  /**
   * Logs in a user.
   * @param data - The user login data.
   * @returns An object containing the login status, success flag, message, user data, and token.
   */
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
      return { status: 401, success: false, message: 'Invalid credentials' };
    }
    const passwordMatch = bcrypt.compareSync(data.password, user.password);
    if (!passwordMatch) {
      return { status: 401, success: false, message: 'Invalid credentials' };
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

  /**
   * Verifies the validity of a token.
   * @param token - The token to verify.
   * @returns The verification result.
   */
  verifyToken(token: string) {
    return this.securityService.verifyToken(token);
  }

  /**
   * Validates the user data for registration.
   * @param data - The user data to validate.
   * @returns An object containing the validation status, success flag, and message.
   */
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
    console.log('entro en validacion de usuairo');
    const validate = this.validateDataLogin(data);
    if (!validate.success) {
      return validate;
    }

    return { success: true };
  }

  /**
   * Validates the user data for login.
   * @param data - The user data to validate.
   * @returns An object containing the validation status, success flag, and message.
   */
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

  /**
   * Creates a new User instance.
   * @param data - The user data.
   * @returns The created User instance.
   */
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
