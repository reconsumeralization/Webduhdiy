import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'webduh_db',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './src/migrations',
      extension: 'ts',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './src/seeds',
      extension: 'ts',
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './src/migrations',
      extension: 'ts',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './src/seeds',
      extension: 'ts',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 20,
    },
    migrations: {
      directory: './src/migrations',
      extension: 'ts',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './src/seeds',
      extension: 'ts',
    },
    acquireConnectionTimeout: 60000,
    useNullAsDefault: true,
  },
};

export default config; 