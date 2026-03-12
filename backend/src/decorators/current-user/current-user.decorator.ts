import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/auth/user.entity';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ session: { userId: number | null }; currentUser: User }>();
    return request.currentUser;
  },
);
