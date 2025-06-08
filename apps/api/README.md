# WebduhVercel API - Backend Services with Database Integration

A comprehensive backend API service built with Express.js, TypeScript, PostgreSQL, and Redis for the WebduhVercel platform.

## 🚀 Features

- **RESTful API** with Express.js and TypeScript
- **Database Integration** with PostgreSQL using Knex.js
- **Caching** with Redis for improved performance
- **Authentication** with JWT tokens
- **API Documentation** with Swagger/OpenAPI
- **Comprehensive Logging** with Winston
- **Error Handling** with custom error middleware
- **Rate Limiting** for API protection
- **Health Checks** for monitoring
- **Database Migrations** for schema management
- **Input Validation** with Joi and express-validator
- **Security** with Helmet.js and CORS

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- Redis 6+
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WebduhVercel/apps/api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3001
   API_URL=http://localhost:3001
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=password
   DB_NAME=webduh_db
   DB_POOL_MIN=2
   DB_POOL_MAX=10

   # Redis Configuration
   REDIS_URL=redis://localhost:6379
   REDIS_PASSWORD=
   REDIS_DB=0

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   # Logging
   LOG_LEVEL=info

   # Email Configuration (for password reset, etc.)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=noreply@webduh.com
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb webduh_db

   # Run migrations
   npm run migrate

   # Seed database (optional)
   npm run seed
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run migrate` - Run database migrations
- `npm run migrate:rollback` - Rollback last migration
- `npm run seed` - Run database seeds
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## 📚 API Documentation

Once the server is running, you can access the interactive API documentation at:
- **Swagger UI**: http://localhost:3001/api/docs

## 🏥 Health Checks

The API provides several health check endpoints:

- `GET /health` - Basic health check
- `GET /api/health` - Basic health check with system info
- `GET /api/health/detailed` - Detailed health check including database and Redis
- `GET /api/health/readiness` - Kubernetes readiness probe
- `GET /api/health/liveness` - Kubernetes liveness probe

## 🔐 Authentication

The API uses JWT-based authentication with access and refresh tokens:

### Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/resend-verification` - Resend verification email

### Usage
Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📊 API Endpoints

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin only)

### Projects
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Deployments
- `GET /api/deployments` - Get deployments
- `POST /api/deployments` - Create new deployment
- `GET /api/deployments/:id` - Get deployment details
- `PUT /api/deployments/:id` - Update deployment
- `DELETE /api/deployments/:id` - Delete deployment

### Analytics
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/projects/:id` - Get project analytics
- `GET /api/analytics/deployments` - Get deployment analytics

## 🗄️ Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `username` (String, Unique)
- `password` (String, Hashed)
- `firstName` (String)
- `lastName` (String)
- `avatar` (String, Optional)
- `role` (Enum: user, admin, developer)
- `isActive` (Boolean)
- `isEmailVerified` (Boolean)
- `emailVerifiedAt` (Timestamp)
- `emailVerificationToken` (String)
- `passwordResetToken` (String)
- `passwordResetTokenExpires` (Timestamp)
- `lastLoginAt` (Timestamp)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Projects Table
- `id` (UUID, Primary Key)
- `name` (String)
- `description` (Text)
- `repository` (String)
- `framework` (String)
- `domain` (String)
- `subdomain` (String)
- `status` (Enum: active, inactive, building, error)
- `envVariables` (JSON)
- `buildSettings` (JSON)
- `rootDirectory` (String)
- `outputDirectory` (String)
- `installCommand` (String)
- `buildCommand` (String)
- `devCommand` (String)
- `userId` (UUID, Foreign Key)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Deployments Table
- `id` (UUID, Primary Key)
- `projectId` (UUID, Foreign Key)
- `commit` (String)
- `branch` (String)
- `message` (String)
- `status` (Enum: pending, building, ready, error, canceled)
- `url` (String)
- `buildTime` (Integer, seconds)
- `buildLogs` (JSON)
- `errorLogs` (JSON)
- `buildId` (String)
- `previewUrl` (String)
- `metadata` (JSON)
- `startedAt` (Timestamp)
- `completedAt` (Timestamp)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3001` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `password` |
| `DB_NAME` | Database name | `webduh_db` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_REFRESH_SECRET` | JWT refresh secret | Required |
| `LOG_LEVEL` | Logging level | `info` |

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Logging

The application uses Winston for structured logging:

- **Console**: Colored output for development
- **Files**: Separate files for errors and combined logs
- **Rotation**: Automatic log rotation with size limits

Log files are stored in the `logs/` directory:
- `error.log` - Error level logs only
- `combined.log` - All logs
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API request limiting
- **Input Validation**: Request validation with Joi
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **SQL Injection Protection**: Parameterized queries

## 🚀 Deployment

### Docker
```bash
# Build image
docker build -t webduh-api .

# Run container
docker run -p 3001:3001 --env-file .env webduh-api
```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure production database
- [ ] Set up Redis cluster
- [ ] Configure SSL/TLS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation at `/api/docs`

---

**WebduhVercel API** - Built with ❤️ for the modern web 