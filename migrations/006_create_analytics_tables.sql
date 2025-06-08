-- Migration 006: Create Analytics and Monitoring Tables
-- WebduhVercel Database Migration
-- Created: 2024-02-06

-- Analytics Events Table
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    deployment_id UUID REFERENCES deployments(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- page_view, api_call, error, etc.
    path VARCHAR(1000),
    user_agent TEXT,
    ip_address INET,
    country VARCHAR(2),
    city VARCHAR(255),
    referer TEXT,
    duration_ms INTEGER,
    status_code INTEGER,
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Metrics Table
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    deployment_id UUID REFERENCES deployments(id) ON DELETE CASCADE,
    metric_type VARCHAR(100) NOT NULL, -- response_time, error_rate, throughput, etc.
    value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL, -- ms, percentage, count, etc.
    region VARCHAR(50),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Status Page Incidents Table
CREATE TABLE status_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'investigating', -- investigating, identified, monitoring, resolved
    severity VARCHAR(50) DEFAULT 'minor', -- minor, major, critical
    affected_services TEXT[] DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Health Metrics Table
CREATE TABLE system_health_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name VARCHAR(100) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    healthy BOOLEAN DEFAULT TRUE,
    region VARCHAR(50),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- User Activity Logs Table
CREATE TABLE user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50), -- project, deployment, domain, etc.
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Usage Metrics Table
CREATE TABLE api_usage_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    request_size_bytes INTEGER,
    response_size_bytes INTEGER,
    user_id UUID REFERENCES users(id),
    ip_address INET,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Analytics
CREATE INDEX idx_analytics_events_project_id ON analytics_events(project_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_deployment_id ON analytics_events(deployment_id);

-- Indexes for Performance Metrics
CREATE INDEX idx_performance_metrics_project_id ON performance_metrics(project_id);
CREATE INDEX idx_performance_metrics_timestamp ON performance_metrics(timestamp);
CREATE INDEX idx_performance_metrics_metric_type ON performance_metrics(metric_type);

-- Indexes for Status Incidents
CREATE INDEX idx_status_incidents_status ON status_incidents(status);
CREATE INDEX idx_status_incidents_created_at ON status_incidents(created_at);

-- Indexes for System Health
CREATE INDEX idx_system_health_metrics_service_name ON system_health_metrics(service_name);
CREATE INDEX idx_system_health_metrics_timestamp ON system_health_metrics(timestamp);

-- Indexes for User Activity
CREATE INDEX idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_created_at ON user_activity_logs(created_at);
CREATE INDEX idx_user_activity_logs_action ON user_activity_logs(action);

-- Indexes for API Usage
CREATE INDEX idx_api_usage_metrics_team_id ON api_usage_metrics(team_id);
CREATE INDEX idx_api_usage_metrics_timestamp ON api_usage_metrics(timestamp);
CREATE INDEX idx_api_usage_metrics_endpoint ON api_usage_metrics(endpoint);

-- Add migration tracking
INSERT INTO schema_migrations (version, description) 
VALUES (6, 'Create analytics and monitoring tables')
ON CONFLICT (version) DO NOTHING; 