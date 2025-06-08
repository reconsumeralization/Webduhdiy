#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing webduh 10X Database Configuration...');
console.log('='.repeat(50));

// Correct database configuration
const envContent = `# webduh 10X API Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/webduh_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=webduh_db
DB_USER=postgres
DB_PASSWORD=password

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

# 10X Platform Features
QUANTUM_SECURITY=enabled
PREDICTIVE_SCALING=enabled
GLOBAL_EDGE=enabled
COST_OPTIMIZATION=enabled
`;

// Write .env file
const envPath = path.join(__dirname, '..', 'apps', 'api', '.env');
fs.writeFileSync(envPath, envContent);
console.log('✅ Fixed API .env file with correct postgres credentials');

console.log('\n🗄️ Database Setup Commands:');
console.log('='.repeat(50));
console.log('1. Make sure PostgreSQL is running');
console.log('2. Run: createdb webduh_db');
console.log(
  '3. Or use Docker: docker run --name webduh-postgres -e POSTGRES_DB=webduh_db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15',
);
console.log('');
console.log('🚀 Now restart your API server: npm run dev');
console.log('✨ Database configuration fixed for 10X performance!');
