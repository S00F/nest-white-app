const Postgrator = require('postgrator'); // eslint-disable-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv'); // eslint-disable-line @typescript-eslint/no-var-requires

dotenv.config({ path: '.env.postgrator' });
const env = process.env;

let version = 'max';

const rollbackVersionParam = process.argv[2];
if (rollbackVersionParam && rollbackVersionParam === '--version') {
  console.log('Processing rollback...');
  version = process.argv[3] || 'max';
}

const instanciatePostgrator = (sqlDirs, schemaTable) => {
  const postgrator = new Postgrator({
    migrationPattern: sqlDirs,
    driver: 'pg',
    host: env.DB_ADDRESS,
    port: Number(env.DB_PORT),
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    currentSchema: env.DB_SCHEMA,
    schemaTable,
    ssl: Boolean(env.DB_SSL) || false,
  });
  postgrator.on('validation-started', migration =>
    console.log('validation-started ', migration),
  );
  postgrator.on('validation-finished', migration =>
    console.log('validation-finished ', migration),
  );
  postgrator.on('migration-started', migration =>
    console.log('validation-started ', migration),
  );
  postgrator.on('migration-finished', migration =>
    console.log('migration-finished', migration),
  );
  return postgrator;
};

let postgrator = instanciatePostgrator(
  `${__dirname}/*.sql`,
  `${env.DB_SCHEMA}.schemaversion`,
);
postgrator
  .migrate(version)
  .then(appliedMigrations => {
    console.log('Applied migrations', appliedMigrations);
    if (env.NODE_ENV !== 'homologation' && env.NODE_ENV !== 'production') {
      postgrator = instanciatePostgrator(
        `${__dirname}/local/*.sql`,
        `${env.DB_SCHEMA}.schemalocalversion`,
      );
      postgrator
        .migrate()
        .then(appliedLocalMigrations =>
          console.log('Applied local migrations', appliedLocalMigrations),
        );
    }
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
