#!/usr/bin/env node

/**
 * WebduhVercel Database Creator
 * Creates the webduhvercel database if it doesn't exist
 */

const { Pool } = require('pg');

// Configuration for connecting to postgres database (default)
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: 'postgres', // Connect to default postgres database first
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

const targetDatabase = process.env.DB_NAME || 'webduhvercel';

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

async function createDatabase() {
  log('🔧 Creating WebduhVercel database...', 'cyan');
  log(`📍 Host: ${config.host}:${config.port}`, 'yellow');
  log(`📊 Target Database: ${targetDatabase}`, 'yellow');
  log(`👤 User: ${config.user}`, 'yellow');

  const pool = new Pool(config);

  try {
    // Connect to postgres database
    const client = await pool.connect();
    log('✅ Connected to PostgreSQL!', 'green');

    // Check if database already exists
    const checkResult = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDatabase],
    );

    if (checkResult.rows.length > 0) {
      log(`📊 Database '${targetDatabase}' already exists!`, 'yellow');
      client.release();
      return true;
    }

    // Create the database
    await client.query(`CREATE DATABASE "${targetDatabase}"`);
    log(`🎉 Database '${targetDatabase}' created successfully!`, 'green');

    client.release();
    return true;
  } catch (error) {
    log(`❌ Failed to create database: ${error.message}`, 'red');

    if (error.code === 'ECONNREFUSED') {
      log('💡 PostgreSQL might not be running. Try:', 'yellow');
      log('   • Windows: Start PostgreSQL service', 'yellow');
      log('   • macOS: brew services start postgresql', 'yellow');
      log('   • Linux: sudo systemctl start postgresql', 'yellow');
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

// Run database creation
if (require.main === module) {
  createDatabase()
    .then((success) => process.exit(success ? 0 : 1))
    .catch((error) => {
      log(`❌ Unexpected error: ${error.message}`, 'red');
      process.exit(1);
    });
}

module.exports = { createDatabase };
