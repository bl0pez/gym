import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Payload } from 'src/interfaces';
import type { Request } from 'express';

export const AuthUser = createParamDecorator(
  (data: keyof Payload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request?.user as Payload | undefined;

    if (!user) throw new UnauthorizedException();

    return data ? user?.[data] : user;
  },
);
