import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersProvider } from 'src/providers/users.gateway.provider';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    //const token = request.headers.authorization;

    //return this.usersProvider.verifyToken(token);
    return false;
  }
}
