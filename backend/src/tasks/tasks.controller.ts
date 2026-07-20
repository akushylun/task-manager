import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { CurrentUser } from 'src/decorators/current-user/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/guards/roles/roles.guard';

@Roles(Role.User)
@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseGuards(RolesGuard)
  findAll(@CurrentUser() user: User) {
    return this.tasksService.findAll(user);
  }

  @Post()
  createTask(@Body() body: CreateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.createTask(body, user);
  }

  @Put('/:id')
  updateTask(
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.updateTask(parseInt(id), body, user);
  }

  @Delete('/:id')
  removeTask(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.removeTask(parseInt(id), user);
  }
}
