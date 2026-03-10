import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private readonly taskRepository: Repository<Task>) {}

  findAll() {
    return this.taskRepository.find();
  }

  createTask(value: Pick<Task, 'title' | 'status'>) {
    const task = this.taskRepository.create(value);
    return this.taskRepository.save(task);
  }

  async updateTask(id: Task['id'], value: Partial<Task>) {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException('not found task');
    }
    return this.taskRepository.save({ ...task, ...value });
  }
}
