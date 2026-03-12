import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { map, Observable } from 'rxjs';

export const Serialize = (dto) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: new (...args: any[]) => any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) =>
        plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        }),
      ),
    );
  }
}
