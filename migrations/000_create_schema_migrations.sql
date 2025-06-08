-- Migration 000: Create Schema Migrations Table
-- WebduhVercel Database Migration
-- Created: 2025-02-06

-- Create schema_migrations table to track migration history
CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    description TEXT NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    checksum TEXT
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_schema_migrations_applied_at ON schema_migrations(applied_at);

-- Add initial migration record
INSERT INTO schema_migrations (version, description) 
VALUES (0, 'Create schema migrations table')
ON CONFLICT (version) DO NOTHING; 