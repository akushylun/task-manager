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
import { Role } from '../auth/role.enum';
import { User } from '../auth/user.entity';
import { CurrentUser } from '../decorators/current-user/current-user.decorator';
import { Roles } from '../decorators/roles/roles.decorator';
import { Serialize } from '../interceptors/serialize/serialize.interceptor';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TaskDto } from './dtos/task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TasksGateway } from './tasks.gateway';
import { TasksService } from './tasks.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('tasks')
@ApiCookieAuth()
@Roles(Role.User)
@Serialize(TaskDto)
@Controller('tasks')
export class TasksController {
  /**
   * The emit lives here rather than in `TasksService` on purpose. The service is
   * the one thing in this backend with a complete unit-test suite, and those
   * tests assume a pure persistence layer with nothing but a repository behind
   * it. The controller is also where the request's user is already resolved.
   *
   * The cost, stated plainly: a future non-HTTP writer — a queue job, a seed
   * script — would change tasks without telling anyone. If that day comes, this
   * moves into the service or becomes a domain event; it does not stay here.
   */
  constructor(
    private readonly tasksService: TasksService,
    private readonly tasksGateway: TasksGateway,
  ) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.tasksService.findAll(user);
  }

  @Post()
  async createTask(@Body() body: CreateTaskDto, @CurrentUser() user: User) {
    const task = await this.tasksService.createTask(body, user);
    this.tasksGateway.emitTaskCreated(user.id, task);
    return task;
  }

  @Put('/:id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    const task = await this.tasksService.updateTask(id, body, user);
    this.tasksGateway.emitTaskUpdated(user.id, task);
    return task;
  }

  @Delete('/:id')
  async removeTask(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    const removed = await this.tasksService.removeTask(id, user);
    // The route param, not the returned entity: TypeORM's `remove()` deletes the
    // id from the object it hands back.
    this.tasksGateway.emitTaskDeleted(user.id, id);
    return removed;
  }
}
