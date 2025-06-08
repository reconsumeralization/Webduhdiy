#!/usr/bin/env node

/**
 * WebduhVercel Database Migration Runner (Node.js)
 * Cross-platform migration runner using Node.js and pg
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'webduhvercel',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || '',
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

async function runMigrations() {
  log('🔌 Connecting to PostgreSQL...', 'cyan');

  const pool = new Pool(config);

  try {
    // Test connection
    const client = await pool.connect();
    log('✅ PostgreSQL connection successful', 'green');
    client.release();

    // Get migration files
    const migrationsDir = __dirname;
    log(`📁 Migration directory: ${migrationsDir}`, 'cyan');

    const files = fs
      .readdirSync(migrationsDir)
      .filter(
        (file) =>
          file.endsWith('.sql') &&
          !file.includes('run-migrations') &&
          !file.includes('seed-data') &&
          file.match(/^\d+/),
      ) // Only numbered migration files
      .sort((a, b) => {
        const aNum = parseInt(a.match(/^(\d+)/)?.[1] || '0');
        const bNum = parseInt(b.match(/^(\d+)/)?.[1] || '0');
        return aNum - bNum;
      });

    if (files.length === 0) {
      log('❌ No migration files found', 'red');
      process.exit(1);
    }

    log('🔄 Starting database migrations...', 'cyan');

    // Get already applied migrations
    let appliedMigrations = new Set();
    try {
      const result = await pool.query('SELECT version FROM schema_migrations');
      appliedMigrations = new Set(result.rows.map((row) => row.version));
    } catch (error) {
      log(
        '⚠️  Could not read migration history, running all migrations',
        'yellow',
      );
    }

    // Run each migration
    for (const file of files) {
      const migrationName = path.basename(file, '.sql');
      const migrationVersion = parseInt(file.match(/^(\d+)/)?.[1] || '0');

      if (appliedMigrations.has(migrationVersion)) {
        log(
          `⏭️  Skipping migration: ${migrationName} (already applied)`,
          'yellow',
        );
        continue;
      }

      log(`🚀 Running migration: ${migrationName}`, 'yellow');

      try {
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await pool.query(sql);
        log(`✅ ${migrationName} completed successfully`, 'green');
      } catch (error) {
        log(`❌ ${migrationName} failed: ${error.message}`, 'red');
        console.error(error);
        process.exit(1);
      }
    }

    console.log('');
    log('🎉 All migrations completed successfully!', 'green');
    console.log('');

    // Show migration status
    log('📊 Migration status:', 'cyan');
    try {
      const result = await pool.query(`
        SELECT 
          version, 
          description, 
          applied_at 
        FROM schema_migrations 
        ORDER BY version
      `);

      console.table(result.rows);
    } catch (error) {
      log('⚠️  Could not retrieve migration status', 'yellow');
    }

    console.log('');
    log('🔍 Database summary:', 'cyan');
    try {
      const result = await pool.query(`
        SELECT 
          schemaname,
          tablename,
          tableowner
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename
      `);

      console.table(result.rows);
    } catch (error) {
      log('⚠️  Could not retrieve table summary', 'yellow');
    }

    console.log('');
    log(
      '✨ Database setup complete! Your WebduhVercel database is ready to use.',
      'green',
    );
  } catch (error) {
    log(`❌ Migration failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Check if pg module is available
try {
  require.resolve('pg');
} catch (error) {
  log('❌ pg module not found. Please install it with: npm install pg', 'red');
  log('💡 Or run: npm install in the project root directory', 'yellow');
  process.exit(1);
}

// Run migrations
if (require.main === module) {
  runMigrations().catch((error) => {
    log(`❌ Unexpected error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });
}

module.exports = { runMigrations, config };
