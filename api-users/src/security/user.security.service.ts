import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { userData } from 'src/entities/user.entity';

@Injectable()
export class SecurityService {
  private readonly secret = process.env.JWT_SECRET;
  private readonly algorithm = 'HS256';

  generateToken(user: userData): string {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iat: now,
      exp: now + 24 * 60 * 60,
      _id: user._id,
      name: user.name,
      email: user.email,
    };
    return jwt.sign(payload, this.secret, { algorithm: this.algorithm });
  }

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

  verifySession(req: Request, next: Function): any {
    const headers = req.headers;
    const payload = this.verifyToken(headers.authorization);
    const userId = payload.id;
    if (userId) {
      return next(userId);
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
