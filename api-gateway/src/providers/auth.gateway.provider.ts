import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
process.loadEnvFile();

@Injectable()
export class AuthProvider {
  private readonly secret = process.env.JWT_SECRET;
  private readonly algorithm = process.env.ALGORITHM;

  /**
   * Verifies the authenticity of a JWT token.
   * @param authorization - The authorization header containing the JWT token.
   * @returns The decoded payload of the JWT token.
   * @throws UnauthorizedException if the authorization header is missing or the token is invalid.
   */
  verifyToken(authorization: string): any {
    if (!authorization) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      const token = authorization.split(' ')[1];
      return jwt.verify(token, this.secret, { algorithms: [this.algorithm] });
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      } else if (err instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw err;
      }
    }
  }

  /**
   * Verifies the authenticity of a user session.
   * @param req - The HTTP request object.
   * @returns The user ID extracted from the session token.
   * @throws UnauthorizedException if the session token is missing or invalid.
   */
  verifySession(req: Request): any {
    const headers = req.headers;
    const payload = this.verifyToken(headers.authorization);
    const userId = payload._id;
    if (userId) {
      return userId;
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
