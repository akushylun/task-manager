import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

import * as bcrypt from 'bcrypt';
import { Task } from 'src/tasks/task.entity';
import { TaskStatus } from 'src/tasks/task-status.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
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
    return this.dataSource.transaction(async (manager) => {
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
  }

  isValidPassword(password: string, hashPassword: string) {
    return bcrypt.compare(password, hashPassword);
  }
}
