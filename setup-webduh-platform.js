#!/usr/bin/env node

/**
 * WebduhVercel Platform Setup Script
 * Comprehensive setup for the enterprise-grade deployment platform
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Pool } = require('pg');

// Colors for console output
const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(message) {
  console.log('');
  log('='.repeat(60), 'cyan');
  log(`🚀 ${message}`, 'bold');
  log('='.repeat(60), 'cyan');
  console.log('');
}

async function checkPrerequisites() {
  header('Checking Prerequisites');

  const requirements = [
    { name: 'Node.js', command: 'node --version', min: '18.0.0' },
    { name: 'npm', command: 'npm --version', min: '8.0.0' },
    { name: 'PostgreSQL', command: 'psql --version', min: '13.0' },
  ];

  for (const req of requirements) {
    try {
      const version = execSync(req.command, { encoding: 'utf8' }).trim();
      log(`✅ ${req.name}: ${version}`, 'green');
    } catch (error) {
      log(`❌ ${req.name}: Not found or not in PATH`, 'red');
      log(
        `💡 Please install ${req.name} version ${req.min} or higher`,
        'yellow',
      );
      return false;
    }
  }

  return true;
}

async function installDependencies() {
  header('Installing Dependencies');

  try {
    log('📦 Installing root dependencies...', 'cyan');
    execSync('npm install', { stdio: 'inherit' });

    log('📦 Installing dashboard dependencies...', 'cyan');
    execSync('npm install', { cwd: 'apps/dashboard', stdio: 'inherit' });

    log('📦 Installing API dependencies...', 'cyan');
    execSync('npm install', { cwd: 'apps/api', stdio: 'inherit' });

    log('📦 Installing Bolt DIY dependencies...', 'cyan');
    execSync('npm install', { cwd: 'apps/bolt-diy', stdio: 'inherit' });

    log('✅ All dependencies installed successfully!', 'green');
    return true;
  } catch (error) {
    log(`❌ Failed to install dependencies: ${error.message}`, 'red');
    return false;
  }
}

async function setupDatabase() {
  header('Setting Up Database');

  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  };

  log(`📍 Database Host: ${config.host}:${config.port}`, 'yellow');
  log(`👤 Database User: ${config.user}`, 'yellow');

  try {
    // Create database
    log('🔧 Creating database...', 'cyan');
    const { createDatabase } = require('./migrations/create-database.js');
    await createDatabase();

    // Run migrations
    log('🔄 Running database migrations...', 'cyan');
    const { runMigrations } = require('./migrations/migrate.js');
    await runMigrations();

    log('✅ Database setup completed successfully!', 'green');
    return true;
  } catch (error) {
    log(`❌ Database setup failed: ${error.message}`, 'red');
    return false;
  }
}

async function createEnvironmentFiles() {
  header('Creating Environment Files');

  const envTemplate = `# WebduhVercel Environment Configuration
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=webduhvercel
DB_USER=postgres
DB_PASSWORD=

# Application Configuration
NODE_ENV=development
PORT=3000
API_PORT=3001

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ENCRYPTION_KEY=your-32-character-encryption-key-here

# External Services (Optional)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Email Configuration (Optional)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Storage Configuration (Optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
S3_BUCKET=

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379
`;

  try {
    if (!fs.existsSync('.env')) {
      fs.writeFileSync('.env', envTemplate);
      log('✅ Created .env file with default configuration', 'green');
    } else {
      log('⚠️  .env file already exists, skipping creation', 'yellow');
    }

    if (!fs.existsSync('.env.local')) {
      fs.writeFileSync('.env.local', '# Local environment overrides\n');
      log('✅ Created .env.local file for local overrides', 'green');
    }

    return true;
  } catch (error) {
    log(`❌ Failed to create environment files: ${error.message}`, 'red');
    return false;
  }
}

async function setupProjectTemplates() {
  header('Setting Up Project Templates');

  const templates = [
    {
      name: 'Next.js App Router',
      path: 'apps/dashboard/templates/nextjs',
      description: 'Modern Next.js application with App Router',
    },
    {
      name: 'Static Site',
      path: 'apps/dashboard/templates/static-site',
      description: 'Simple static HTML/CSS/JS website',
    },
  ];

  try {
    for (const template of templates) {
      if (fs.existsSync(template.path)) {
        log(`✅ Template "${template.name}" already exists`, 'green');
      } else {
        log(
          `⚠️  Template "${template.name}" not found at ${template.path}`,
          'yellow',
        );
      }
    }

    log('✅ Project templates verified', 'green');
    return true;
  } catch (error) {
    log(`❌ Failed to setup project templates: ${error.message}`, 'red');
    return false;
  }
}

async function runInitialBuild() {
  header('Running Initial Build');

  try {
    log('🔨 Building dashboard...', 'cyan');
    execSync('npm run build', { cwd: 'apps/dashboard', stdio: 'inherit' });

    log('🔨 Building API...', 'cyan');
    execSync('npm run build', { cwd: 'apps/api', stdio: 'inherit' });

    log('✅ Initial build completed successfully!', 'green');
    return true;
  } catch (error) {
    log(`❌ Build failed: ${error.message}`, 'red');
    log('💡 You can run builds manually later with npm run build', 'yellow');
    return false;
  }
}

async function displaySuccessMessage() {
  header('Setup Complete!');

  log('🎉 WebduhVercel platform setup completed successfully!', 'green');
  console.log('');

  log('📋 Next Steps:', 'cyan');
  log('1. Update your .env file with your actual configuration', 'yellow');
  log('2. Start the development servers:', 'yellow');
  log('   npm run dev:dashboard  # Dashboard on http://localhost:3000', 'blue');
  log('   npm run dev:api        # API on http://localhost:3001', 'blue');
  log('   npm run dev:bolt       # Bolt DIY on http://localhost:5173', 'blue');
  log('3. Or start all services at once:', 'yellow');
  log('   npm run dev:all', 'blue');
  console.log('');

  log('🔗 Platform Features:', 'cyan');
  log('• Enterprise-grade deployment platform', 'green');
  log('• AI-powered code generation with Bolt DIY integration', 'green');
  log('• Advanced payment processing (Stripe, PayPal, Square)', 'green');
  log('• Edge functions and serverless infrastructure', 'green');
  log('• Enterprise security and compliance (SSO, SAML, GDPR)', 'green');
  log('• Real-time monitoring and analytics', 'green');
  log('• Multi-cloud storage and CDN integration', 'green');
  console.log('');

  log('📚 Documentation:', 'cyan');
  log('• Database Schema: ./migrations/README.md', 'blue');
  log('• API Documentation: ./API_DOCUMENTATION.md', 'blue');
  log('• Development Guide: ./DEVELOPMENT.md', 'blue');
  console.log('');

  log('🆘 Need Help?', 'cyan');
  log('• Check the troubleshooting guide: ./TROUBLESHOOTING.md', 'blue');
  log('• Review the comprehensive documentation', 'blue');
  log('• All enterprise features are ready to use!', 'green');
}

async function main() {
  log('🚀 WebduhVercel Platform Setup', 'bold');
  log('Enterprise-grade deployment platform with AI integration', 'cyan');
  console.log('');

  const steps = [
    { name: 'Prerequisites Check', fn: checkPrerequisites },
    { name: 'Install Dependencies', fn: installDependencies },
    { name: 'Setup Database', fn: setupDatabase },
    { name: 'Create Environment Files', fn: createEnvironmentFiles },
    { name: 'Setup Project Templates', fn: setupProjectTemplates },
    { name: 'Run Initial Build', fn: runInitialBuild },
  ];

  for (const step of steps) {
    const success = await step.fn();
    if (!success) {
      log(`❌ Setup failed at step: ${step.name}`, 'red');
      log('💡 Please fix the issues above and run the setup again', 'yellow');
      process.exit(1);
    }
  }

  await displaySuccessMessage();
}

// Run setup if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    log(`❌ Setup failed with unexpected error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });
}

module.exports = { main };
