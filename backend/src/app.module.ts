import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/task.entity';

@Module({
  imports: [TasksModule, TypeOrmModule.forRoot({type: 'sqlite', database: 'db.sqlite', synchronize: true, entities: [Task]})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
