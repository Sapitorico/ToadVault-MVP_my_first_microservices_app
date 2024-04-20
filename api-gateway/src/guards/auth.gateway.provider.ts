import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthProvider } from 'src/providers/auth.gateway.provider';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authProvider: AuthProvider) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId = this.authProvider.verifySession(request);
    request.userId = userId;
    return true;
    // return new Promise((resolve, reject) => {
    //   resolve({ userValid: true, userId: userId });
    // });
  }
}
