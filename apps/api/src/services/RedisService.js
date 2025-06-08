const Redis = require('ioredis');
const winston = require('winston');

class RedisService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.fallbackStorage = new Map(); // In-memory fallback
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'redis.log' }),
      ],
    });
  }

  async initialize() {
    try {
      const config = {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
        db: process.env.REDIS_DB || 0,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 2, // Reduced retries
        lazyConnect: true,
        connectTimeout: 5000, // 5 second timeout
        commandTimeout: 3000, // 3 second command timeout
      };

      this.client = new Redis(config);

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.info('Redis connection established');
      });

      this.client.on('error', (error) => {
        this.isConnected = false;
        this.logger.warn(
          'Redis connection error, using fallback storage:',
          error.message,
        );
      });

      this.client.on('close', () => {
        this.isConnected = false;
        this.logger.warn('Redis connection closed, using fallback storage');
      });

      // Test connection with timeout
      try {
        await Promise.race([
          this.client.ping(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Connection timeout')), 3000),
          ),
        ]);
        this.isConnected = true;
        this.logger.info('Redis service initialized successfully');
      } catch (error) {
        this.isConnected = false;
        this.logger.warn(
          'Redis connection failed, using in-memory fallback:',
          error.message,
        );
        // Continue without Redis - use fallback storage
      }
    } catch (error) {
      this.isConnected = false;
      this.logger.warn(
        'Failed to initialize Redis service, using fallback storage:',
        error.message,
      );
      // Don't throw error - allow service to continue with fallback
    }
  }

  async isHealthy() {
    if (!this.isConnected || !this.client) {
      return false; // Fallback storage is always "healthy"
    }

    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch (error) {
      this.isConnected = false;
      this.logger.warn('Redis health check failed:', error.message);
      return false;
    }
  }

  _getFallbackKey(key) {
    return `fallback:${key}`;
  }

  // Basic operations with fallback
  async get(key) {
    try {
      if (this.isConnected && this.client) {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        // Use fallback storage
        const fallbackKey = this._getFallbackKey(key);
        const entry = this.fallbackStorage.get(fallbackKey);
        if (entry && (!entry.expires || entry.expires > Date.now())) {
          return entry.value;
        }
        return null;
      }
    } catch (error) {
      this.logger.error('Redis GET error:', { key, error: error.message });
      return null;
    }
  }

  async set(key, value, ttlSeconds = null) {
    try {
      if (this.isConnected && this.client) {
        const serialized = JSON.stringify(value);

        if (ttlSeconds) {
          await this.client.setex(key, ttlSeconds, serialized);
        } else {
          await this.client.set(key, serialized);
        }
        return true;
      } else {
        // Use fallback storage
        const fallbackKey = this._getFallbackKey(key);
        const entry = {
          value,
          expires: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
        };
        this.fallbackStorage.set(fallbackKey, entry);
        return true;
      }
    } catch (error) {
      this.logger.error('Redis SET error:', { key, error: error.message });
      return false;
    }
  }

  async del(key) {
    try {
      if (this.isConnected && this.client) {
        const result = await this.client.del(key);
        return result > 0;
      } else {
        // Use fallback storage
        const fallbackKey = this._getFallbackKey(key);
        return this.fallbackStorage.delete(fallbackKey);
      }
    } catch (error) {
      this.logger.error('Redis DEL error:', { key, error: error.message });
      return false;
    }
  }

  async exists(key) {
    try {
      if (this.isConnected && this.client) {
        const result = await this.client.exists(key);
        return result === 1;
      } else {
        // Use fallback storage
        const fallbackKey = this._getFallbackKey(key);
        const entry = this.fallbackStorage.get(fallbackKey);
        return entry && (!entry.expires || entry.expires > Date.now());
      }
    } catch (error) {
      this.logger.error('Redis EXISTS error:', { key, error: error.message });
      return false;
    }
  }

  async expire(key, seconds) {
    try {
      if (this.isConnected && this.client) {
        const result = await this.client.expire(key, seconds);
        return result === 1;
      } else {
        // Use fallback storage
        const fallbackKey = this._getFallbackKey(key);
        const entry = this.fallbackStorage.get(fallbackKey);
        if (entry) {
          entry.expires = Date.now() + seconds * 1000;
          return true;
        }
        return false;
      }
    } catch (error) {
      this.logger.error('Redis EXPIRE error:', { key, error: error.message });
      return false;
    }
  }

  // Hash operations
  async hget(key, field) {
    try {
      const value = await this.client.hget(key, field);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error('Redis HGET error:', {
        key,
        field,
        error: error.message,
      });
      return null;
    }
  }

  async hset(key, field, value) {
    try {
      const serialized = JSON.stringify(value);
      await this.client.hset(key, field, serialized);
      return true;
    } catch (error) {
      this.logger.error('Redis HSET error:', {
        key,
        field,
        error: error.message,
      });
      return false;
    }
  }

  async hgetall(key) {
    try {
      const hash = await this.client.hgetall(key);
      const result = {};

      for (const [field, value] of Object.entries(hash)) {
        try {
          result[field] = JSON.parse(value);
        } catch {
          result[field] = value;
        }
      }

      return result;
    } catch (error) {
      this.logger.error('Redis HGETALL error:', { key, error: error.message });
      return {};
    }
  }

  // List operations
  async lpush(key, ...values) {
    try {
      const serialized = values.map((v) => JSON.stringify(v));
      const result = await this.client.lpush(key, ...serialized);
      return result;
    } catch (error) {
      this.logger.error('Redis LPUSH error:', { key, error: error.message });
      return 0;
    }
  }

  async rpush(key, ...values) {
    try {
      const serialized = values.map((v) => JSON.stringify(v));
      const result = await this.client.rpush(key, ...serialized);
      return result;
    } catch (error) {
      this.logger.error('Redis RPUSH error:', { key, error: error.message });
      return 0;
    }
  }

  async lrange(key, start = 0, stop = -1) {
    try {
      const values = await this.client.lrange(key, start, stop);
      return values.map((v) => {
        try {
          return JSON.parse(v);
        } catch {
          return v;
        }
      });
    } catch (error) {
      this.logger.error('Redis LRANGE error:', { key, error: error.message });
      return [];
    }
  }

  // Session management
  async setSession(sessionId, data, ttlSeconds = 3600) {
    const key = `session:${sessionId}`;
    return await this.set(key, data, ttlSeconds);
  }

  async getSession(sessionId) {
    const key = `session:${sessionId}`;
    return await this.get(key);
  }

  async deleteSession(sessionId) {
    const key = `session:${sessionId}`;
    return await this.del(key);
  }

  // Cache management
  async cache(key, fetchFunction, ttlSeconds = 300) {
    try {
      // Try to get from cache first
      let value = await this.get(key);

      if (value === null) {
        // Not in cache, fetch the data
        value = await fetchFunction();

        // Store in cache
        await this.set(key, value, ttlSeconds);
      }

      return value;
    } catch (error) {
      this.logger.error('Cache operation error:', {
        key,
        error: error.message,
      });
      // Fallback to direct fetch if cache fails
      return await fetchFunction();
    }
  }

  // Deployment logs management
  async addDeploymentLog(deploymentId, logEntry) {
    const key = `deployment:logs:${deploymentId}`;
    await this.rpush(key, logEntry);
    await this.expire(key, 3600); // Expire logs after 1 hour
  }

  async getDeploymentLogs(deploymentId) {
    const key = `deployment:logs:${deploymentId}`;
    return await this.lrange(key);
  }

  // Rate limiting
  async checkRateLimit(identifier, limit, windowSeconds) {
    const key = `rate_limit:${identifier}`;

    try {
      const current = await this.client.incr(key);

      if (current === 1) {
        await this.client.expire(key, windowSeconds);
      }

      return {
        count: current,
        limit,
        remaining: Math.max(0, limit - current),
        resetTime: windowSeconds,
      };
    } catch (error) {
      this.logger.error('Rate limit check error:', {
        identifier,
        error: error.message,
      });
      return { count: 0, limit, remaining: limit, resetTime: windowSeconds };
    }
  }

  async close() {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.logger.info('Redis connection closed');
    }
  }
}

module.exports = RedisService;
