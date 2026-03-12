import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/user.entity';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<{
      session: { userId: number | null };
      currentUser: User | null;
    }>();
    const { userId } = request.session || {};

    if (userId) {
      const user = await this.authService.findOneById(userId);
      request.currentUser = user;
    }

    return next.handle();
  }
}
