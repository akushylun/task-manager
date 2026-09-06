import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { BullModule } from '@nestjs/bullmq';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([User]),
    BullModule.registerQueue({ name: 'welcome-email' }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
