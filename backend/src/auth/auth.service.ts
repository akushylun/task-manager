import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

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
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const draftUser = { email, password: hash };
    const user = this.repo.create(draftUser);

    return this.repo.save(user);
  }

  async isValidPassword(password: string, hashPassword: string) {
    const passwordHash = await bcrypt.compare(password, hashPassword);

    if (!passwordHash) {
      throw new NotFoundException('invalid password');
    }

    return passwordHash;
  }
}
