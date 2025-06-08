const { Pool } = require('pg');
const winston = require('winston');

class DatabaseService {
  constructor() {
    this.pool = null;
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'database.log' }),
      ],
    });
  }

  async initialize() {
    try {
      const config = {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'webduh',
        user: process.env.DB_USER || 'webduh',
        password: process.env.DB_PASSWORD || 'webduh123',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      };

      this.pool = new Pool(config);

      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      this.logger.info('Database connection established successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async query(text, params) {
    try {
      const start = Date.now();
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;

      this.logger.debug('Executed query', {
        query: text,
        duration,
        rows: result.rowCount,
      });

      return result;
    } catch (error) {
      this.logger.error('Database query error:', {
        query: text,
        error: error.message,
      });
      throw error;
    }
  }

  async getClient() {
    return await this.pool.connect();
  }

  async isHealthy() {
    try {
      if (!this.pool) return false;

      const client = await this.pool.connect();
      await client.query('SELECT 1');
      client.release();
      return true;
    } catch (error) {
      this.logger.warn('Database health check failed:', error.message);
      return false;
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.logger.info('Database connection pool closed');
    }
  }

  // Helper methods for common operations
  async findById(table, id) {
    const result = await this.query(`SELECT * FROM ${table} WHERE id = $1`, [
      id,
    ]);
    return result.rows[0];
  }

  async findAll(table, conditions = {}) {
    let query = `SELECT * FROM ${table}`;
    const params = [];

    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(' AND ');
      query += ` WHERE ${whereClause}`;
      params.push(...Object.values(conditions));
    }

    const result = await this.query(query, params);
    return result.rows;
  }

  async create(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

    const query = `
      INSERT INTO ${table} (${keys.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await this.query(query, values);
    return result.rows[0];
  }

  async update(table, id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const query = `
      UPDATE ${table}
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const result = await this.query(query, [id, ...values]);
    return result.rows[0];
  }

  async delete(table, id) {
    const result = await this.query(
      `DELETE FROM ${table} WHERE id = $1 RETURNING *`,
      [id],
    );
    return result.rows[0];
  }
}

module.exports = DatabaseService;
