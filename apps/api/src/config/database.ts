import knex, { Knex } from 'knex';
import { logger } from '@/utils/logger';

const config: Knex.Config = {
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'webduh_db',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
  pool: {
    min: parseInt(process.env.DB_POOL_MIN || '2'),
    max: parseInt(process.env.DB_POOL_MAX || '10'),
  },
  migrations: {
    directory: './src/migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './src/seeds',
    extension: 'ts',
  },
  acquireConnectionTimeout: 60000,
  debug: process.env.NODE_ENV === 'development',
};

export const db = knex(config);

export async function connectDatabase(): Promise<void> {
  try {
    await db.raw('SELECT 1+1 as result');
    logger.info('Database connection established');
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  try {
    await db.destroy();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
}

export default db; 