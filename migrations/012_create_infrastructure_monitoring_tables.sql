-- Migration 012: Create Infrastructure and Monitoring Tables
-- WebduhVercel Database Migration
-- Created: 2024-02-06

-- Background Job Queues Table
CREATE TABLE job_queues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    queue_type VARCHAR(50) NOT NULL, -- redis, database, sqs, rabbitmq
    configuration JSONB DEFAULT '{}',
    max_workers INTEGER DEFAULT 1,
    max_retries INTEGER DEFAULT 3,
    retry_delay_seconds INTEGER DEFAULT 60,
    visibility_timeout_seconds INTEGER DEFAULT 30,
    dead_letter_queue VARCHAR(255),
    priority_levels INTEGER DEFAULT 1, -- 1-10
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Background Jobs Table
CREATE TABLE background_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    queue_id UUID NOT NULL REFERENCES job_queues(id),
    job_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    priority INTEGER DEFAULT 5, -- 1-10, higher is more priority
    status VARCHAR(50) DEFAULT 'pending', -- pending, running, completed, failed, cancelled
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    scheduled_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    error_message TEXT,
    error_stack TEXT,
    result JSONB DEFAULT '{}',
    execution_time_ms INTEGER,
    worker_id VARCHAR(255),
    timeout_seconds INTEGER DEFAULT 300,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- File Storage Systems Table
CREATE TABLE storage_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    storage_type VARCHAR(50) NOT NULL, -- s3, gcs, azure_blob, local, cdn
    provider VARCHAR(100) NOT NULL, -- aws, google, azure, cloudflare, etc.
    region VARCHAR(100),
    bucket_name VARCHAR(255),
    configuration JSONB NOT NULL, -- Provider-specific config
    encryption_config JSONB DEFAULT '{}',
    access_permissions JSONB DEFAULT '{}',
    usage_limits JSONB DEFAULT '{}', -- Storage limits, bandwidth limits
    cost_config JSONB DEFAULT '{}', -- Pricing information
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- File Storage Objects Table
CREATE TABLE storage_objects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    storage_system_id UUID NOT NULL REFERENCES storage_systems(id),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    object_key VARCHAR(1000) NOT NULL, -- Full path/key
    object_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(255),
    size_bytes BIGINT NOT NULL,
    etag VARCHAR(255),
    checksum_md5 VARCHAR(32),
    checksum_sha256 VARCHAR(64),
    encryption_algorithm VARCHAR(50),
    compression_algorithm VARCHAR(50),
    storage_class VARCHAR(50), -- standard, cold, archive
    access_level VARCHAR(50) DEFAULT 'private', -- public, private, team
    metadata JSONB DEFAULT '{}',
    tags JSONB DEFAULT '{}',
    expires_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ,
    last_modified_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cache Systems Table
CREATE TABLE cache_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    cache_type VARCHAR(50) NOT NULL, -- redis, memcached, database, memory
    provider VARCHAR(100), -- aws_elasticache, google_memorystore, etc.
    configuration JSONB NOT NULL,
    max_memory_mb INTEGER,
    eviction_policy VARCHAR(50), -- lru, lfu, ttl, random
    default_ttl_seconds INTEGER DEFAULT 3600,
    compression_enabled BOOLEAN DEFAULT FALSE,
    encryption_enabled BOOLEAN DEFAULT FALSE,
    is_distributed BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cache Entries Table
CREATE TABLE cache_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cache_system_id UUID NOT NULL REFERENCES cache_systems(id),
    cache_key VARCHAR(500) NOT NULL,
    namespace VARCHAR(100) DEFAULT 'default',
    value_compressed BYTEA, -- Compressed value
    value_size_bytes INTEGER,
    ttl_seconds INTEGER,
    hit_count INTEGER DEFAULT 0,
    last_hit_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cache_system_id, cache_key, namespace)
);

-- Infrastructure Metrics Table
CREATE TABLE infrastructure_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(255) NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- counter, gauge, histogram, summary
    labels JSONB DEFAULT '{}', -- Metric labels/tags
    value DECIMAL(20,6) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    source VARCHAR(255), -- Source system/service
    source_instance VARCHAR(255), -- Instance ID
    aggregation_window VARCHAR(50), -- raw, 1m, 5m, 1h, 1d
    unit VARCHAR(50), -- bytes, seconds, percent, count
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Health Checks Table
CREATE TABLE service_health_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name VARCHAR(255) NOT NULL,
    check_name VARCHAR(255) NOT NULL,
    check_type VARCHAR(50) NOT NULL, -- http, tcp, dns, command, custom
    endpoint_url TEXT,
    check_interval_seconds INTEGER DEFAULT 60,
    timeout_seconds INTEGER DEFAULT 30,
    expected_status_codes INTEGER[] DEFAULT '{200}',
    expected_response_body TEXT,
    expected_response_headers JSONB DEFAULT '{}',
    alert_on_failure BOOLEAN DEFAULT TRUE,
    alert_threshold INTEGER DEFAULT 3, -- Consecutive failures
    configuration JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(service_name, check_name)
);

-- Service Health Check Results Table
CREATE TABLE service_health_check_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    health_check_id UUID NOT NULL REFERENCES service_health_checks(id),
    status VARCHAR(50) NOT NULL, -- healthy, unhealthy, timeout, error
    response_time_ms INTEGER,
    status_code INTEGER,
    response_body TEXT,
    response_headers JSONB DEFAULT '{}',
    error_message TEXT,
    check_timestamp TIMESTAMPTZ NOT NULL,
    region VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alert Rules Table
CREATE TABLE alert_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rule_type VARCHAR(50) NOT NULL, -- metric_threshold, health_check, log_pattern, anomaly
    query VARCHAR(2000) NOT NULL, -- PromQL, SQL, or other query language
    threshold_value DECIMAL(20,6),
    threshold_operator VARCHAR(10), -- >, <, >=, <=, ==, !=
    evaluation_window VARCHAR(50) DEFAULT '5m', -- 1m, 5m, 15m, 1h, etc.
    evaluation_interval VARCHAR(50) DEFAULT '1m',
    severity VARCHAR(50) DEFAULT 'medium', -- low, medium, high, critical
    conditions JSONB DEFAULT '{}',
    annotations JSONB DEFAULT '{}', -- Alert annotations
    labels JSONB DEFAULT '{}', -- Alert labels
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alert Instances Table
CREATE TABLE alert_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_rule_id UUID NOT NULL REFERENCES alert_rules(id),
    fingerprint VARCHAR(64) UNIQUE NOT NULL, -- Unique identifier for this alert instance
    status VARCHAR(50) DEFAULT 'firing', -- firing, resolved, suppressed
    severity VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    description TEXT,
    labels JSONB DEFAULT '{}',
    annotations JSONB DEFAULT '{}',
    value DECIMAL(20,6), -- Value that triggered the alert
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ,
    generator_url TEXT, -- URL to view the alert details
    silence_until TIMESTAMPTZ,
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Log Aggregation Table
CREATE TABLE log_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name VARCHAR(255) NOT NULL,
    instance_id VARCHAR(255),
    level VARCHAR(20) NOT NULL, -- debug, info, warn, error, fatal
    message TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    source_file VARCHAR(500),
    source_line INTEGER,
    function_name VARCHAR(255),
    request_id VARCHAR(255),
    user_id UUID REFERENCES users(id),
    team_id UUID REFERENCES teams(id),
    project_id UUID REFERENCES projects(id),
    deployment_id UUID REFERENCES deployments(id),
    structured_data JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    region VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Database Connection Pools Table
CREATE TABLE connection_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    database_type VARCHAR(50) NOT NULL, -- postgresql, mysql, mongodb, redis
    host VARCHAR(255) NOT NULL,
    port INTEGER NOT NULL,
    database_name VARCHAR(255),
    username VARCHAR(255),
    password_encrypted TEXT,
    ssl_mode VARCHAR(50) DEFAULT 'prefer', -- disable, prefer, require
    ssl_cert TEXT,
    ssl_key_encrypted TEXT,
    ssl_ca TEXT,
    min_connections INTEGER DEFAULT 1,
    max_connections INTEGER DEFAULT 10,
    idle_timeout_seconds INTEGER DEFAULT 300,
    connection_timeout_seconds INTEGER DEFAULT 30,
    query_timeout_seconds INTEGER DEFAULT 60,
    pool_configuration JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Database Connection Pool Stats Table
CREATE TABLE connection_pool_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pool_id UUID NOT NULL REFERENCES connection_pools(id),
    active_connections INTEGER NOT NULL,
    idle_connections INTEGER NOT NULL,
    waiting_connections INTEGER NOT NULL,
    total_connections INTEGER NOT NULL,
    connections_created INTEGER DEFAULT 0,
    connections_destroyed INTEGER DEFAULT 0,
    query_count INTEGER DEFAULT 0,
    query_errors INTEGER DEFAULT 0,
    average_query_time_ms DECIMAL(10,3),
    timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Infrastructure and Monitoring
CREATE INDEX idx_job_queues_name ON job_queues(name);
CREATE INDEX idx_job_queues_is_active ON job_queues(is_active);

CREATE INDEX idx_background_jobs_queue_id ON background_jobs(queue_id);
CREATE INDEX idx_background_jobs_status ON background_jobs(status);
CREATE INDEX idx_background_jobs_job_type ON background_jobs(job_type);
CREATE INDEX idx_background_jobs_created_at_brin ON background_jobs USING BRIN(created_at); -- Time-series optimized
CREATE INDEX idx_background_jobs_scheduled_at_brin ON background_jobs USING BRIN(scheduled_at); -- Time-series optimized

CREATE INDEX idx_storage_systems_storage_type ON storage_systems(storage_type);
CREATE INDEX idx_storage_systems_is_active ON storage_systems(is_active);

CREATE INDEX idx_storage_objects_storage_system_id ON storage_objects(storage_system_id);
CREATE INDEX idx_storage_objects_team_id ON storage_objects(team_id);
CREATE INDEX idx_storage_objects_project_id ON storage_objects(project_id);
CREATE INDEX idx_storage_objects_object_key ON storage_objects(object_key);

CREATE INDEX idx_cache_systems_cache_type ON cache_systems(cache_type);
CREATE INDEX idx_cache_systems_is_active ON cache_systems(is_active);

CREATE INDEX idx_cache_entries_cache_system_id ON cache_entries(cache_system_id);
CREATE INDEX idx_cache_entries_expires_at ON cache_entries(expires_at);

CREATE INDEX idx_infrastructure_metrics_metric_name ON infrastructure_metrics(metric_name);
CREATE INDEX idx_infrastructure_metrics_timestamp_brin ON infrastructure_metrics USING BRIN(timestamp); -- Time-series optimized
CREATE INDEX idx_infrastructure_metrics_source ON infrastructure_metrics(source);

CREATE INDEX idx_service_health_checks_service_name ON service_health_checks(service_name);
CREATE INDEX idx_service_health_checks_is_active ON service_health_checks(is_active);

CREATE INDEX idx_service_health_check_results_health_check_id ON service_health_check_results(health_check_id);
CREATE INDEX idx_service_health_check_results_status ON service_health_check_results(status);
CREATE INDEX idx_service_health_check_results_check_timestamp_brin ON service_health_check_results USING BRIN(check_timestamp); -- Time-series optimized

CREATE INDEX idx_alert_rules_team_id ON alert_rules(team_id);
CREATE INDEX idx_alert_rules_rule_type ON alert_rules(rule_type);
CREATE INDEX idx_alert_rules_is_active ON alert_rules(is_active);

CREATE INDEX idx_alert_instances_alert_rule_id ON alert_instances(alert_rule_id);
CREATE INDEX idx_alert_instances_status ON alert_instances(status);
CREATE INDEX idx_alert_instances_severity ON alert_instances(severity);
CREATE INDEX idx_alert_instances_starts_at ON alert_instances(starts_at);

CREATE INDEX idx_log_entries_service_name ON log_entries(service_name);
CREATE INDEX idx_log_entries_level ON log_entries(level);
CREATE INDEX idx_log_entries_timestamp_brin ON log_entries USING BRIN(timestamp); -- Time-series optimized
CREATE INDEX idx_log_entries_structured_data_gin ON log_entries USING GIN(structured_data); -- JSONB search
CREATE INDEX idx_log_entries_tags_gin ON log_entries USING GIN(tags); -- Array search
CREATE INDEX idx_log_entries_user_id ON log_entries(user_id);
CREATE INDEX idx_log_entries_team_id ON log_entries(team_id);

CREATE INDEX idx_connection_pools_database_type ON connection_pools(database_type);
CREATE INDEX idx_connection_pools_is_active ON connection_pools(is_active);

CREATE INDEX idx_connection_pool_stats_pool_id ON connection_pool_stats(pool_id);
CREATE INDEX idx_connection_pool_stats_timestamp_brin ON connection_pool_stats USING BRIN(timestamp); -- Time-series optimized

-- Add migration tracking
INSERT INTO schema_migrations (version, description) 
VALUES (12, 'Create infrastructure and monitoring tables')
ON CONFLICT (version) DO NOTHING; 