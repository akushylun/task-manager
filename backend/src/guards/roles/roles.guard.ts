import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/auth/role.enum';
import { AuthService } from 'src/auth/auth.service';
import { ROLES_KEY } from 'src/decorators/roles/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      session: { userId: number | null };
    }>();
    const userId = request.session?.userId;
    if (!userId) {
      return false;
    }

    const user = await this.authService.findOneById(userId);
    if (!user) {
      return false;
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
