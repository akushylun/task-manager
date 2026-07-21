import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from './database/data-source-options';

// Standalone DataSource for the TypeORM CLI (migrations). Shares the connection
// config with the running app via dataSourceOptions; adds the migrations glob,
// which only the CLI needs.
export default new DataSource({
  ...dataSourceOptions,
  migrations: ['src/migrations/*.ts'],
});
