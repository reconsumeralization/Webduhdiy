#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up webduh 10X Database...');
console.log('='.repeat(50));

// Database configuration
const DB_CONFIG = {
  host: 'localhost',
  port: 5432,
  database: 'webduh_db',
  username: 'postgres',
  password: 'password',
};

// Create .env file for API
const envContent = `# webduh API Configuration
DATABASE_URL=postgresql://${DB_CONFIG.username}:${DB_CONFIG.password}@${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}
DB_HOST=${DB_CONFIG.host}
DB_PORT=${DB_CONFIG.port}
DB_NAME=${DB_CONFIG.database}
DB_USER=${DB_CONFIG.username}
DB_PASSWORD=${DB_CONFIG.password}

REDIS_URL=redis://localhost:6379
PORT=3001
NODE_ENV=development
JWT_SECRET=webduh_super_secure_jwt_secret_2024
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# AI Features
OPENAI_API_KEY=your_openai_api_key
AI_ENABLED=true
AUTO_OPTIMIZATION=true

# Monitoring
LOG_LEVEL=info
METRICS_ENABLED=true
`;

// Write .env file
const envPath = path.join(__dirname, '..', 'apps', 'api', '.env');
fs.writeFileSync(envPath, envContent);
console.log('✅ Created API .env file');

console.log('\n🔧 Database Setup Instructions:');
console.log('='.repeat(50));
console.log('1. Make sure PostgreSQL is running on your system');
console.log('2. Run: createdb webduh_db');
console.log(
  '3. Or use Docker: docker run --name webduh-postgres -e POSTGRES_DB=webduh_db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15',
);
console.log('\n✨ Database configured! Restart your API server.');

// Auto-run if PostgreSQL is available
console.log('\n🚀 Attempting automatic setup...');

const child = spawn('createdb', ['webduh_db'], { stdio: 'inherit' });
child.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Database created successfully');

    const sqlChild = spawn('psql', ['-d', 'webduh_db', '-f', sqlPath], {
      stdio: 'inherit',
    });
    sqlChild.on('close', (sqlCode) => {
      if (sqlCode === 0) {
        console.log('🎉 Database setup completed successfully!');
        console.log('🚀 You can now restart your webduh API server');
      } else {
        console.log('⚠️  Manual setup required - see instructions above');
      }
    });
  } else {
    console.log(
      '⚠️  PostgreSQL not available or database exists - see manual instructions above',
    );
  }
});
