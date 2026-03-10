import { IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  status: 'pending' | 'in-progress' | 'completed';
}