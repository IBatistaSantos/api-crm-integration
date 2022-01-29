import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Observable } from 'rxjs';

@Injectable()
class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest();

    const requiredRole = this.reflector.get<string | undefined>(
      'role',
      context.getHandler(),
    );

    if (!requiredRole) return true;

    return user.role === requiredRole;
  }
}

export { RolesGuard };
