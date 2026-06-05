import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserEntity } from 'src/modules/user/domain/user.entity';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest<{ user: UserEntity }>();
    return request.user;
  },
);
