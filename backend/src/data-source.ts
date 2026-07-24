import 'reflect-metadata';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from './database/data-source-options';

// Standalone DataSource for the TypeORM CLI (migrations). Shares the connection
// config with the running app via dataSourceOptions; adds the migrations glob,
// which only the CLI needs.
//
// The glob is resolved from __dirname so it works in both worlds: run locally
// through ts-node it resolves to src/migrations/*.ts, and run from the compiled
// output (as it is inside the container, which ships no src/) it resolves to
// dist/migrations/*.js. Matching on the current extension avoids picking up the
// emitted .d.ts declaration files.
const migrationExtension = __filename.endsWith('.js') ? '*.js' : '*.ts';

export default new DataSource({
  ...dataSourceOptions,
  migrations: [join(__dirname, 'migrations', migrationExtension)],
});
