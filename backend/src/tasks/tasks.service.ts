import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  findAll(user: User) {
    return this.taskRepository.findBy({ user });
  }

  /**
   * `save()` returns the very instance it was handed, so a task built with
   * `{ ...value, user }` still carries the full owner entity — password hash and
   * all. The other methods here are safe only by accident: they load through
   * `findOneBy`, which does not populate the relation.
   *
   * The owner is dropped here rather than in a response interceptor on purpose.
   * An interceptor only runs on the HTTP path; a WebSocket emit never touches
   * one. Removing it from the returned value covers every channel at once.
   */
  async createTask(value: Pick<Task, 'title' | 'status'>, user: User) {
    const task = this.taskRepository.create({ ...value, user });
    const { user: _owner, ...saved } = await this.taskRepository.save(task);
    return saved;
  }

  async updateTask(id: Task['id'], value: Partial<Task>, user: User) {
    const task = await this.taskRepository.findOneBy({ id, user });
    if (!task) {
      throw new NotFoundException('not found task');
    }
    return this.taskRepository.save({ ...task, ...value });
  }

  async removeTask(id: Task['id'], user: User) {
    const task = await this.taskRepository.findOneBy({ id, user });
    if (!task) {
      throw new NotFoundException('not found task');
    }
    return this.taskRepository.remove(task);
  }
}
