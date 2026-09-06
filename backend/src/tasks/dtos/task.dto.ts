import { Expose } from 'class-transformer';
import { TaskStatus } from '../task-status.enum';

/**
 * Response allowlist for every task route.
 *
 * `SerializeInterceptor` runs `plainToClass` with `excludeExtraneousValues`, so
 * anything not marked `@Expose()` is dropped — a route that later loads the
 * `user` relation cannot leak it by forgetting to strip it.
 *
 * This is the HTTP half of the fix only. Interceptors do not run on WebSocket
 * emits, which is why `TasksService.createTask` also drops the owner at source.
 */
export class TaskDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  status: TaskStatus;
}
