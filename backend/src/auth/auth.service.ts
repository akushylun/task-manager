import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

import * as bcrypt from 'bcrypt';
import { Task } from '../tasks/task.entity';
import { TaskStatus } from '../tasks/task-status.enum';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @InjectQueue('welcome-email') private welcomeEmailQueue: Queue,
    private dataSource: DataSource,
  ) {}

  findOne(email: string) {
    if (!email) {
      return null;
    }
    return this.repo.findOneBy({ email });
  }

  findOneById(id: number) {
    return this.repo.findOneBy({ id });
  }

  async create({ email, password }: CreateUserDto) {
    const user = await this.dataSource.transaction(async (manager) => {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      const draftUser = { email, password: hash };
      const user = await manager.save(User, draftUser);
      await manager.save(Task, {
        title: 'Welcome!',
        status: TaskStatus.Pending,
        user,
      });
      return user;
    });

    await this.welcomeEmailQueue.add(
      'welcome-email',
      {
        userId: user.id,
      },
      {
        jobId: `welcome-email-${user.id}`,
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      },
    );
    return user;
  }

  isValidPassword(password: string, hashPassword: string) {
    return bcrypt.compare(password, hashPassword);
  }
}
