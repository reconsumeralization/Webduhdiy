-- Migration 005: Create Deployment and Domain Tables
-- WebduhVercel Database Migration
-- Created: 2024-02-06

-- Deployments Table
CREATE TABLE deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255),
    url TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, building, ready, error, canceled
    type VARCHAR(50) DEFAULT 'preview', -- production, preview
    source VARCHAR(50) DEFAULT 'git', -- git, cli, api, ai-builder, bolt-diy, manual
    commit_sha VARCHAR(255),
    commit_message TEXT,
    branch VARCHAR(255),
    creator_id UUID REFERENCES users(id),
    build_logs TEXT,
    build_time_ms INTEGER,
    size_bytes BIGINT,
    functions_count INTEGER DEFAULT 0,
    edge_functions_count INTEGER DEFAULT 0,
    regions TEXT[] DEFAULT '{}',
    error_message TEXT,
    deployment_config JSONB DEFAULT '{}', -- Build settings, env vars, etc.
    file_snapshot JSONB, -- Snapshot of files at deployment time
    meta JSONB DEFAULT '{}',
    ready_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deployment Checks Table
CREATE TABLE deployment_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deployment_id UUID NOT NULL REFERENCES deployments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, running, success, failure, skipped
    conclusion VARCHAR(50), -- success, failure, neutral, cancelled, skipped, timed_out
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    details_url TEXT,
    output JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deployment Environments Table
CREATE TABLE deployment_environments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- production, preview, development
    description TEXT,
    auto_deploy BOOLEAN DEFAULT FALSE,
    branch_pattern VARCHAR(255), -- main, staging, preview/*, etc.
    environment_variables JSONB DEFAULT '{}',
    build_command TEXT,
    install_command TEXT,
    output_directory TEXT,
    node_version VARCHAR(20),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, name)
);

-- Domains Table
CREATE TABLE domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    verification_status VARCHAR(50) DEFAULT 'pending', -- pending, verified, failed
    ssl_status VARCHAR(50) DEFAULT 'pending', -- pending, provisioned, failed, renewing
    ssl_expires_at TIMESTAMPTZ,
    cdn_enabled BOOLEAN DEFAULT TRUE,
    redirect_to VARCHAR(255),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DNS Records Table
CREATE TABLE dns_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL, -- A, AAAA, CNAME, MX, TXT, etc.
    name VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    ttl INTEGER DEFAULT 300,
    priority INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Deployments
CREATE INDEX idx_deployments_project_id ON deployments(project_id);
CREATE INDEX idx_deployments_status ON deployments(status);
CREATE INDEX idx_deployments_created_at ON deployments(created_at);
CREATE INDEX idx_deployments_commit_sha ON deployments(commit_sha);
CREATE INDEX idx_deployments_source ON deployments(source);

-- Indexes for Deployment Checks
CREATE INDEX idx_deployment_checks_deployment_id ON deployment_checks(deployment_id);
CREATE INDEX idx_deployment_checks_status ON deployment_checks(status);

-- Indexes for Deployment Environments
CREATE INDEX idx_deployment_environments_project_id ON deployment_environments(project_id);

-- Indexes for Domains
CREATE INDEX idx_domains_project_id ON domains(project_id);
CREATE INDEX idx_domains_team_id ON domains(team_id);
CREATE INDEX idx_domains_verification_status ON domains(verification_status);

-- Indexes for DNS Records
CREATE INDEX idx_dns_records_domain_id ON dns_records(domain_id);

-- Add migration tracking
INSERT INTO schema_migrations (version, description) 
VALUES (5, 'Create deployment and domain tables')
ON CONFLICT (version) DO NOTHING; 