import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Role } from 'src/auth/role.enum';
import { User } from 'src/auth/user.entity';
import { CurrentUser } from 'src/decorators/current-user/current-user.decorator';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TasksService } from './tasks.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('tasks')
@ApiCookieAuth()
@Roles(Role.User)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.tasksService.findAll(user);
  }

  @Post()
  createTask(@Body() body: CreateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.createTask(body, user);
  }

  @Put('/:id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.updateTask(id, body, user);
  }

  @Delete('/:id')
  removeTask(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.tasksService.removeTask(id, user);
  }
}
