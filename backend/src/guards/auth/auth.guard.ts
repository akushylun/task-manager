import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/user.entity';
import { IS_PUBLIC_KEY } from 'src/decorators/public/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      session: { userId: number | null };
      currentUser: User | null;
    }>();

    if (!request.session.userId) {
      return false;
    }

    const user = await this.authService.findOneById(request.session.userId);

    if (!user) {
      return false;
    }

    request.currentUser = user;
    return true;
  }
}
