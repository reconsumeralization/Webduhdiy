-- Migration 010: Create Edge Functions and Serverless Infrastructure Tables
-- WebduhVercel Database Migration
-- Created: 2024-02-06

-- Edge Runtime Configurations Table
CREATE TABLE edge_runtimes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL, -- nodejs18, nodejs20, deno, bun, python3.11, etc.
    version VARCHAR(50) NOT NULL,
    runtime_type VARCHAR(50) NOT NULL, -- nodejs, deno, bun, python, go, rust, etc.
    supported_regions TEXT[] DEFAULT '{}',
    default_timeout INTEGER DEFAULT 30000, -- milliseconds
    max_timeout INTEGER DEFAULT 900000, -- 15 minutes
    memory_limit INTEGER DEFAULT 128, -- MB
    max_memory INTEGER DEFAULT 3008, -- MB
    environment_variables JSONB DEFAULT '{}',
    configuration JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    is_beta BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Edge Functions Table
CREATE TABLE edge_functions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    runtime_id UUID NOT NULL REFERENCES edge_runtimes(id),
    source_code TEXT NOT NULL,
    source_file_path VARCHAR(1000), -- Path in project
    source_file_hash VARCHAR(64), -- SHA-256 hash
    handler VARCHAR(255) DEFAULT 'index.handler',
    timeout INTEGER DEFAULT 30000, -- milliseconds
    memory_limit INTEGER DEFAULT 128, -- MB
    environment_variables JSONB DEFAULT '{}',
    regions TEXT[] DEFAULT '{}', -- Specific regions for deployment
    auto_scaling_config JSONB DEFAULT '{}',
    concurrent_executions_limit INTEGER DEFAULT 1000,
    reserved_concurrency INTEGER, -- Reserved concurrent executions
    dead_letter_config JSONB DEFAULT '{}',
    tracing_config JSONB DEFAULT '{}',
    vpc_config JSONB DEFAULT '{}',
    layers TEXT[] DEFAULT '{}', -- Layer ARNs or IDs
    tags JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'draft', -- draft, active, inactive, deprecated
    is_public BOOLEAN DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, slug)
);

-- Edge Function Versions Table
CREATE TABLE edge_function_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    function_id UUID NOT NULL REFERENCES edge_functions(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    description TEXT,
    source_code TEXT NOT NULL,
    source_file_hash VARCHAR(64),
    runtime_id UUID NOT NULL REFERENCES edge_runtimes(id),
    configuration_snapshot JSONB DEFAULT '{}',
    build_logs TEXT,
    build_status VARCHAR(50) DEFAULT 'building', -- building, success, failed
    size_bytes BIGINT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(function_id, version_number)
);

-- Edge Function Deployments Table
CREATE TABLE edge_function_deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    function_id UUID NOT NULL REFERENCES edge_functions(id) ON DELETE CASCADE,
    version_id UUID NOT NULL REFERENCES edge_function_versions(id),
    deployment_id UUID REFERENCES deployments(id),
    environment VARCHAR(50) NOT NULL, -- production, preview, development
    regions TEXT[] NOT NULL DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'deploying', -- deploying, active, failed, rollback
    alias VARCHAR(255), -- URL alias
    urls JSONB DEFAULT '{}', -- Region-specific URLs
    configuration JSONB DEFAULT '{}',
    deployment_logs TEXT,
    health_check_config JSONB DEFAULT '{}',
    health_check_status VARCHAR(50) DEFAULT 'unknown', -- healthy, unhealthy, unknown
    last_health_check TIMESTAMPTZ,
    deployed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Edge Function Invocation Logs Table
CREATE TABLE edge_function_invocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    function_deployment_id UUID NOT NULL REFERENCES edge_function_deployments(id),
    request_id VARCHAR(255) NOT NULL,
    region VARCHAR(50) NOT NULL,
    cold_start BOOLEAN DEFAULT FALSE,
    duration_ms INTEGER NOT NULL,
    billed_duration_ms INTEGER NOT NULL,
    memory_used_mb INTEGER,
    memory_limit_mb INTEGER,
    status_code INTEGER,
    error_type VARCHAR(100),
    error_message TEXT,
    log_output TEXT,
    user_agent TEXT,
    ip_address INET,
    request_size_bytes INTEGER,
    response_size_bytes INTEGER,
    init_duration_ms INTEGER, -- Cold start initialization time
    invoked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Edge Function Triggers Table
CREATE TABLE edge_function_triggers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    function_id UUID NOT NULL REFERENCES edge_functions(id) ON DELETE CASCADE,
    trigger_type VARCHAR(50) NOT NULL, -- http, schedule, webhook, event
    trigger_config JSONB NOT NULL,
    path_patterns TEXT[] DEFAULT '{}', -- For HTTP triggers
    methods TEXT[] DEFAULT '{}', -- HTTP methods
    headers JSONB DEFAULT '{}',
    schedule_expression VARCHAR(255), -- Cron expression for scheduled triggers
    event_sources TEXT[] DEFAULT '{}', -- Event source ARNs
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Edge Function Aliases Table
CREATE TABLE edge_function_aliases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    function_id UUID NOT NULL REFERENCES edge_functions(id) ON DELETE CASCADE,
    alias VARCHAR(255) NOT NULL,
    version_id UUID NOT NULL REFERENCES edge_function_versions(id),
    description TEXT,
    traffic_weight DECIMAL(5,2) DEFAULT 100.00, -- 0.00 to 100.00
    additional_version_weights JSONB DEFAULT '{}', -- For canary deployments
    routing_config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(function_id, alias)
);

-- Edge Function Layers Table
CREATE TABLE edge_function_layers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    runtime_id UUID NOT NULL REFERENCES edge_runtimes(id),
    content_uri TEXT NOT NULL, -- S3 or storage location
    content_hash VARCHAR(64),
    size_bytes BIGINT,
    version INTEGER NOT NULL DEFAULT 1,
    license_info VARCHAR(255),
    compatible_architectures TEXT[] DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CDN Cache Configurations Table
CREATE TABLE cdn_cache_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    path_patterns TEXT[] NOT NULL DEFAULT '{}',
    cache_behavior VARCHAR(50) NOT NULL, -- cache, no-cache, private
    ttl_seconds INTEGER DEFAULT 3600,
    browser_ttl_seconds INTEGER DEFAULT 3600,
    edge_ttl_seconds INTEGER DEFAULT 86400,
    vary_headers TEXT[] DEFAULT '{}',
    cache_key_config JSONB DEFAULT '{}',
    compression_enabled BOOLEAN DEFAULT TRUE,
    gzip_enabled BOOLEAN DEFAULT TRUE,
    brotli_enabled BOOLEAN DEFAULT TRUE,
    http2_enabled BOOLEAN DEFAULT TRUE,
    http3_enabled BOOLEAN DEFAULT FALSE,
    cors_config JSONB DEFAULT '{}',
    security_headers JSONB DEFAULT '{}',
    redirect_rules JSONB DEFAULT '{}',
    custom_error_pages JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Edge Cache Analytics Table
CREATE TABLE edge_cache_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    cache_config_id UUID REFERENCES cdn_cache_configs(id),
    region VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    hour INTEGER NOT NULL, -- 0-23
    total_requests INTEGER DEFAULT 0,
    cache_hits INTEGER DEFAULT 0,
    cache_misses INTEGER DEFAULT 0,
    origin_requests INTEGER DEFAULT 0,
    bytes_served BIGINT DEFAULT 0,
    bytes_cached BIGINT DEFAULT 0,
    average_response_time_ms INTEGER DEFAULT 0,
    error_4xx_count INTEGER DEFAULT 0,
    error_5xx_count INTEGER DEFAULT 0,
    top_paths JSONB DEFAULT '{}',
    top_user_agents JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, region, date, hour)
);

-- Rate Limiting Rules Table
CREATE TABLE rate_limiting_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    path_patterns TEXT[] NOT NULL DEFAULT '{}',
    methods TEXT[] DEFAULT '{}',
    limit_type VARCHAR(50) NOT NULL, -- requests_per_minute, requests_per_hour, bandwidth
    limit_value INTEGER NOT NULL,
    window_size INTEGER NOT NULL, -- seconds
    identifier_type VARCHAR(50) NOT NULL, -- ip, user_id, api_key, custom
    identifier_header VARCHAR(255), -- Custom header for identification
    burst_limit INTEGER, -- Burst allowance
    queue_limit INTEGER, -- Queue size for rate-limited requests
    block_duration INTEGER DEFAULT 60, -- seconds to block after limit exceeded
    bypass_conditions JSONB DEFAULT '{}',
    response_config JSONB DEFAULT '{}', -- Custom error response
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Edge Functions
CREATE INDEX idx_edge_runtimes_name ON edge_runtimes(name);
CREATE INDEX idx_edge_runtimes_is_active ON edge_runtimes(is_active);

CREATE INDEX idx_edge_functions_project_id ON edge_functions(project_id);
CREATE INDEX idx_edge_functions_slug ON edge_functions(slug);
CREATE INDEX idx_edge_functions_status ON edge_functions(status);
CREATE INDEX idx_edge_functions_runtime_id ON edge_functions(runtime_id);

CREATE INDEX idx_edge_function_versions_function_id ON edge_function_versions(function_id);
CREATE INDEX idx_edge_function_versions_version_number ON edge_function_versions(version_number);

CREATE INDEX idx_edge_function_deployments_function_id ON edge_function_deployments(function_id);
CREATE INDEX idx_edge_function_deployments_environment ON edge_function_deployments(environment);
CREATE INDEX idx_edge_function_deployments_status ON edge_function_deployments(status);

CREATE INDEX idx_edge_function_invocations_function_deployment_id ON edge_function_invocations(function_deployment_id);
CREATE INDEX idx_edge_function_invocations_region ON edge_function_invocations(region);
CREATE INDEX idx_edge_function_invocations_invoked_at_brin ON edge_function_invocations USING BRIN(invoked_at); -- Time-series optimized
CREATE INDEX idx_edge_function_invocations_status_code ON edge_function_invocations(status_code);

CREATE INDEX idx_edge_function_triggers_function_id ON edge_function_triggers(function_id);
CREATE INDEX idx_edge_function_triggers_trigger_type ON edge_function_triggers(trigger_type);

CREATE INDEX idx_edge_function_aliases_function_id ON edge_function_aliases(function_id);
CREATE INDEX idx_edge_function_aliases_alias ON edge_function_aliases(alias);

CREATE INDEX idx_edge_function_layers_runtime_id ON edge_function_layers(runtime_id);
CREATE INDEX idx_edge_function_layers_name ON edge_function_layers(name);

CREATE INDEX idx_cdn_cache_configs_project_id ON cdn_cache_configs(project_id);
CREATE INDEX idx_cdn_cache_configs_is_active ON cdn_cache_configs(is_active);

CREATE INDEX idx_edge_cache_analytics_project_id_date ON edge_cache_analytics(project_id, date);
CREATE INDEX idx_edge_cache_analytics_region ON edge_cache_analytics(region);

CREATE INDEX idx_rate_limiting_rules_project_id ON rate_limiting_rules(project_id);
CREATE INDEX idx_rate_limiting_rules_is_active ON rate_limiting_rules(is_active);

-- Add migration tracking
INSERT INTO schema_migrations (version, description) 
VALUES (10, 'Create edge functions and serverless infrastructure tables')
ON CONFLICT (version) DO NOTHING; 