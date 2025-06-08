-- Migration: 001_initial_schema.sql
-- Description: Initial WebduhVercel database schema
-- Created: 2024-02-06

-- This migration creates the complete WebduhVercel database schema
-- Run this with: psql -d webduh -f db/migrations/001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create all tables (same as schema.sql but organized as migration)
\i ../../schema.sql

-- Migration tracking
INSERT INTO schema_migrations (version, applied_at) VALUES ('001', NOW()) 
ON CONFLICT (version) DO NOTHING; 