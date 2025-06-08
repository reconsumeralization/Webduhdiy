const rateLimit = require('express-rate-limit');

// Create different rate limiters for different endpoints
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too Many Requests',
      message,
      retryAfter: Math.ceil(windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Use IP address for rate limiting
    keyGenerator: (req) => {
      return req.ip || req.connection.remoteAddress;
    },
    // Skip rate limiting for certain conditions
    skip: (req) => {
      // Skip rate limiting in test environment
      if (process.env.NODE_ENV === 'test') {
        return true;
      }

      // Skip for health checks
      if (req.path === '/health') {
        return true;
      }

      return false;
    },
  });
};

// General API rate limiter - 100 requests per 15 minutes
const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100,
  'Too many requests from this IP, please try again later',
);

// Strict rate limiter for auth endpoints - 5 requests per 15 minutes
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5,
  'Too many authentication attempts, please try again later',
);

// Deployment rate limiter - 10 deployments per hour
const deploymentLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  10,
  'Too many deployments, please wait before starting another deployment',
);

// Export the appropriate limiter based on the route
const rateLimiterMiddleware = (req, res, next) => {
  // Apply stricter limits to authentication routes
  if (req.path.startsWith('/api/auth')) {
    return authLimiter(req, res, next);
  }

  // Apply deployment limits to deployment routes
  if (req.path.startsWith('/api/deployments') && req.method === 'POST') {
    return deploymentLimiter(req, res, next);
  }

  // Apply general limits to all other routes
  return generalLimiter(req, res, next);
};

module.exports = rateLimiterMiddleware;
