module.exports = {
  type: 'postgres',
  cache: {
    type: 'redis',
    options: {
      host: 'redis',
      port: 6379,
    },
  },
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/**/*.js'],
  cli: {
    migrationsDir: ['dist/database/migrations/'],
    entitiesDir: ['dist/**/*.entity{.ts,.js}'],
  },
  synchronize: process.env.DB_SYNC == 'true',
};
