-- Migration 001: Create PostgreSQL Extensions
-- WebduhVercel Database Migration
-- Created: 2024-02-06

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable trigram extension for text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Add migration tracking
INSERT INTO schema_migrations (version, description) 
VALUES (1, 'Create PostgreSQL extensions')
ON CONFLICT (version) DO NOTHING; 