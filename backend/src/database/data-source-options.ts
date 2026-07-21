import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';
import { Task } from '../tasks/task.entity';
import { User } from '../auth/user.entity';

// Single source of truth for the DB connection, shared by the running app
// (app.module.ts -> TypeOrmModule.forRoot) and the migration CLI (data-source.ts).
// Each consumer adds its own behavioural options (e.g. the CLI adds `migrations`).
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Task, User],
  synchronize: false,
};
