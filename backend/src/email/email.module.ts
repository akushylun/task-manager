import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WelcomeEmailProcessor } from './welcome-email.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';

// Registered again here, with the same name AuthModule uses. AuthModule is the
// producer, this module is the worker — they never talk to each other, they
// both only talk to Redis.
@Module({
  imports: [
    BullModule.registerQueue({ name: 'welcome-email' }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [WelcomeEmailProcessor],
})
export class EmailModule {}
