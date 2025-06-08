const winston = require('winston');

// Create logger
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({ filename: 'error.log' }),
  ],
});

// Custom error classes
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, fields = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.fields = fields;
  }
}

class DatabaseError extends AppError {
  constructor(message, originalError) {
    super(message, 500, 'DATABASE_ERROR');
    this.originalError = originalError;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR');
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err);

  // PostgreSQL specific errors
  if (err.code === '23505') {
    // Duplicate key error
    const field = err.detail.match(/\(([^)]+)\)/)?.[1] || 'field';
    error = new ValidationError(`${field} already exists`, [field]);
  }

  if (err.code === '23503') {
    // Foreign key constraint error
    error = new ValidationError('Referenced resource does not exist');
  }

  if (err.code === '23502') {
    // Not null constraint error
    const field = err.column || 'field';
    error = new ValidationError(`${field} is required`, [field]);
  }

  if (err.code === '28P01') {
    // Authentication failed
    error = new DatabaseError(
      'Database authentication failed. Please check your credentials.',
    );
  }

  if (err.code === 'ECONNREFUSED') {
    error = new DatabaseError(
      'Database connection refused. Please check if the database is running.',
    );
  }

  // Mongoose/MongoDB errors (if used)
  if (err.name === 'ValidationError') {
    const fields = Object.keys(err.errors);
    error = new ValidationError('Validation error', fields);
  }

  if (err.name === 'CastError') {
    error = new ValidationError('Invalid ID format');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AuthenticationError('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = new AuthenticationError('Token expired');
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new ValidationError('File too large');
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    error = new ValidationError('Too many files');
  }

  // Default to 500 server error
  if (!error.isOperational) {
    error = new AppError('Something went wrong', 500, 'INTERNAL_SERVER_ERROR');
  }

  // Send error response
  const response = {
    success: false,
    error: {
      message: error.message,
      code: error.code,
      status: error.status,
    },
  };

  // Add additional error details in development
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
    response.error.details = err;
  }

  // Add validation fields if available
  if (error.fields) {
    response.error.fields = error.fields;
  }

  res.status(error.statusCode || 500).json(response);
};

// 404 handler
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Health check middleware
const healthCheck = async (req, res) => {
  try {
    // Add database health check here
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    };

    // Check database connection if available
    if (req.app.locals.db) {
      try {
        const isHealthy = await req.app.locals.db.isHealthy();
        health.database = isHealthy ? 'connected' : 'disconnected';
      } catch (error) {
        health.database = 'error';
        health.status = 'unhealthy';
      }
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  healthCheck,
  AppError,
  ValidationError,
  DatabaseError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  RateLimitError,
};
