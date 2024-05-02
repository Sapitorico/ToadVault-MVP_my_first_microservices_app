import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthProvider } from 'src/providers/auth.gateway.provider';

/**
 * AuthGuard class that implements the CanActivate interface.
 * This guard is responsible for authenticating requests and verifying sessions.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authProvider: AuthProvider) {}

  /**
   * Method that determines if a request can be activated.
   * It verifies the session and sets the userId property on the request object.
   * @param context - The execution context of the request.
   * @returns A boolean, a promise of a boolean, or an observable of a boolean indicating if the request can be activated.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId = this.authProvider.verifySession(request);
    request.userId = userId;
    return true;
  }
}
