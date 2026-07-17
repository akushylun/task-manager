import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
