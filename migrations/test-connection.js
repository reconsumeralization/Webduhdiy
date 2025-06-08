#!/usr/bin/env node

/**
 * WebduhVercel Database Connection Test
 * Tests PostgreSQL connectivity before running migrations
 */

const { Pool } = require('pg');

// Configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'webduhvercel',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

// Colors for console output
const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testConnection() {
  log('🔍 Testing database connection...', 'cyan');
  log(`📍 Host: ${config.host}:${config.port}`, 'yellow');
  log(`📊 Database: ${config.database}`, 'yellow');
  log(`👤 User: ${config.user}`, 'yellow');
  log(
    `🔐 Password: ${config.password ? '*'.repeat(config.password.length) : 'Not set'}`,
    'yellow',
  );

  const pool = new Pool(config);

  try {
    // Test connection
    const client = await pool.connect();
    log('✅ Connection successful!', 'green');

    // Test query
    const result = await client.query('SELECT version()');
    log(`🐘 PostgreSQL Version: ${result.rows[0].version}`, 'green');

    // Check if database exists
    const dbCheck = await client.query('SELECT current_database()');
    log(
      `📊 Connected to database: ${dbCheck.rows[0].current_database}`,
      'green',
    );

    // Check for existing tables
    const tableCheck = await client.query(`
      SELECT count(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    log(`📋 Existing tables: ${tableCheck.rows[0].table_count}`, 'green');

    client.release();

    log('🎉 Database connection test passed!', 'green');
    return true;
  } catch (error) {
    log(`❌ Connection failed: ${error.message}`, 'red');

    if (error.code === 'ECONNREFUSED') {
      log('💡 PostgreSQL might not be running. Try:', 'yellow');
      log('   • Windows: Start PostgreSQL service', 'yellow');
      log('   • macOS: brew services start postgresql', 'yellow');
      log('   • Linux: sudo systemctl start postgresql', 'yellow');
    } else if (error.code === '3D000') {
      log('💡 Database does not exist. Create it with:', 'yellow');
      log(
        `   createdb -h ${config.host} -p ${config.port} -U ${config.user} ${config.database}`,
        'yellow',
      );
    } else if (error.code === '28P01') {
      log('💡 Authentication failed. Check:', 'yellow');
      log('   • Username and password are correct', 'yellow');
      log('   • pg_hba.conf allows connections', 'yellow');
    }

    return false;
  } finally {
    await pool.end();
  }
}

// Run test
if (require.main === module) {
  testConnection()
    .then((success) => process.exit(success ? 0 : 1))
    .catch((error) => {
      log(`❌ Unexpected error: ${error.message}`, 'red');
      process.exit(1);
    });
}

module.exports = { testConnection, config };
