import { Pool, PoolClient, QueryResult } from 'pg';

interface DatabaseConfig {
  user?: string;
  host?: string;
  database?: string;
  password?: string;
  port?: number;
  ssl?: boolean | { rejectUnauthorized: boolean };
}

interface QueryConditions {
  [key: string]: any;
}

interface FindOptions {
  include?: string[];
  orderBy?: { [key: string]: 'ASC' | 'DESC' };
  limit?: number;
  offset?: number;
}

class DatabaseService {
  private pool: Pool | null;
  private isInitialized: boolean;

  constructor() {
    this.pool = null;
    this.isInitialized = false;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('Database service already initialized');
      return;
    }

    const config: DatabaseConfig = {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'webduhvercel',
      password: process.env.DB_PASSWORD || 'password',
      port: parseInt(process.env.DB_PORT || '5432'),
    };

    if (process.env.NODE_ENV === 'production') {
      config.ssl = {
        rejectUnauthorized: false,
      };
    }

    try {
      this.pool = new Pool(config);

      // Test the connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      console.log('Database connected successfully');
      this.isInitialized = true;
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  async query(text: string, params?: any[]): Promise<QueryResult> {
    if (!this.pool) {
      throw new Error('Database not initialized');
    }

    try {
      const start = Date.now();
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;

      console.log('Executed query', {
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        duration: `${duration}ms`,
        rows: result.rowCount,
      });

      return result;
    } catch (error) {
      console.error('Database query error:', {
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        params,
        error,
      });
      throw error;
    }
  }

  async getClient(): Promise<PoolClient> {
    if (!this.pool) {
      throw new Error('Database not initialized');
    }
    return await this.pool.connect();
  }

  async isHealthy(): Promise<boolean> {
    try {
      if (!this.pool) {
        return false;
      }
      
      const result = await this.pool.query('SELECT 1');
      return result.rows.length > 0;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.isInitialized = false;
      console.log('Database connection closed');
    }
  }

  // Helper methods for common database operations
  async findById(table: string, id: string | number, options: FindOptions = {}): Promise<any> {
    const query = `SELECT * FROM ${table} WHERE id = $1`;
    const result = await this.query(query, [id]);
    return result.rows[0] || null;
  }

  async findAll(table: string, conditions: QueryConditions = {}, options: FindOptions = {}): Promise<any[]> {
    let query = `SELECT * FROM ${table}`;
    const params: any[] = [];
    let paramIndex = 1;

    // Add WHERE conditions
    const whereConditions = Object.keys(conditions);
    if (whereConditions.length > 0) {
      const whereClause = whereConditions.map(key => {
        params.push(conditions[key]);
        return `${key} = $${paramIndex++}`;
      }).join(' AND ');
      query += ` WHERE ${whereClause}`;
    }

    // Add ORDER BY
    if (options.orderBy) {
      const orderClauses = Object.keys(options.orderBy).map(
        key => `${key} ${options.orderBy![key]}`
      );
      query += ` ORDER BY ${orderClauses.join(', ')}`;
    }

    // Add LIMIT and OFFSET
    if (options.limit) {
      query += ` LIMIT $${paramIndex++}`;
      params.push(options.limit);
    }

    if (options.offset) {
      query += ` OFFSET $${paramIndex++}`;
      params.push(options.offset);
    }

    const result = await this.query(query, params);
    return result.rows;
  }

  async create(table: string, data: Record<string, any>): Promise<any> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`);

    const query = `
      INSERT INTO ${table} (${keys.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;

    const result = await this.query(query, values);
    return result.rows[0];
  }

  async update(table: string, id: string | number, data: Record<string, any>): Promise<any> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    values.push(id);

    const query = `
      UPDATE ${table}
      SET ${setClause}
      WHERE id = $${keys.length + 1}
      RETURNING *
    `;

    const result = await this.query(query, values);
    return result.rows[0];
  }

  async delete(table: string, id: string | number): Promise<boolean> {
    const query = `DELETE FROM ${table} WHERE id = $1`;
    const result = await this.query(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async count(table: string, conditions: QueryConditions = {}): Promise<number> {
    let query = `SELECT COUNT(*) FROM ${table}`;
    const params: any[] = [];
    let paramIndex = 1;

    const whereConditions = Object.keys(conditions);
    if (whereConditions.length > 0) {
      const whereClause = whereConditions.map(key => {
        params.push(conditions[key]);
        return `${key} = $${paramIndex++}`;
      }).join(' AND ');
      query += ` WHERE ${whereClause}`;
    }

    const result = await this.query(query, params);
    return parseInt(result.rows[0].count);
  }
}

export default DatabaseService; 