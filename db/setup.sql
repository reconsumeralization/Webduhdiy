-- WebduhVercel Database Setup Script
-- This script sets up the PostgreSQL database for WebduhVercel

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE webduh'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'webduh')\gexec

-- Connect to the webduh database
\c webduh

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create schema_migrations table for tracking
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(20) PRIMARY KEY,
    applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Import the main schema
\i schema.sql

-- Create development user
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'webduh_dev') THEN
        CREATE ROLE webduh_dev WITH LOGIN PASSWORD 'webduh_dev_password';
    END IF;
END
$$;

-- Grant permissions
GRANT CONNECT ON DATABASE webduh TO webduh_dev;
GRANT USAGE ON SCHEMA public TO webduh_dev;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO webduh_dev;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO webduh_dev;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO webduh_dev;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO webduh_dev;

\echo 'WebduhVercel database setup completed successfully!'
\echo 'Database: webduh'
\echo 'Development user: webduh_dev'
\echo 'Admin user: postgres' 