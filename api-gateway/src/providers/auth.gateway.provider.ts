import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class AuthProvider {
  private readonly secret = process.env.JWT_SECRET;
  private readonly algorithm = 'HS256';

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
