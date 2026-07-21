import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Task } from './tasks/task.entity';
import { User } from './auth/user.entity';

// Standalone DataSource for the TypeORM CLI (migrations). The Nest app builds its
// own DataSource in app.module.ts via forRootAsync — the CLI can't read that, so it
// reads this instead. Keep the connection fields in sync with app.module.ts by hand.
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Task, User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
