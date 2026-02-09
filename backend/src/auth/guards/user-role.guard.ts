import { Reflector } from '@nestjs/core';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected';
import { Role } from 'src/generated/prisma/enums';
import { Request } from 'express';
import { Payload } from 'src/interfaces';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: Role[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles) {
      return true;
    }

    if (validRoles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();

    if (!req.user) {
      throw new BadRequestException('User not found');
    }

    const user = req.user as Payload;

    if (!user.role || !validRoles.includes(user.role)) {
      throw new ForbiddenException(
        `User with role ${user.role} is not allowed to access this resource`,
      );
    }

    return true;
  }
}
