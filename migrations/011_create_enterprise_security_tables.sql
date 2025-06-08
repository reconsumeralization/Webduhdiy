-- Migration 011: Create Enterprise Security and Authentication Tables
-- WebduhVercel Database Migration
-- Created: 2024-02-06

-- Enterprise Authentication Providers Table
CREATE TABLE auth_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    provider_type VARCHAR(50) NOT NULL, -- saml, oidc, oauth2, ldap, active_directory
    configuration JSONB NOT NULL, -- Provider-specific config
    entity_id VARCHAR(255), -- SAML Entity ID
    sso_url TEXT, -- Single Sign-On URL
    sls_url TEXT, -- Single Logout URL
    certificate TEXT, -- X.509 certificate for SAML
    private_key_encrypted TEXT, -- Encrypted private key
    metadata_url TEXT, -- SAML metadata URL
    client_id VARCHAR(255), -- OAuth/OIDC client ID
    client_secret_encrypted TEXT, -- Encrypted client secret
    scope TEXT, -- OAuth scope
    domain_restrictions TEXT[], -- Allowed email domains
    role_mapping JSONB DEFAULT '{}', -- Map provider roles to internal roles
    attribute_mapping JSONB DEFAULT '{}', -- Map provider attributes
    is_active BOOLEAN DEFAULT TRUE,
    enforce_for_team BOOLEAN DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Single Sign-On Sessions Table
CREATE TABLE sso_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    provider_id UUID NOT NULL REFERENCES auth_providers(id),
    user_id UUID NOT NULL REFERENCES users(id),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    external_user_id VARCHAR(255), -- Provider's user ID
    name_id VARCHAR(255), -- SAML NameID
    attributes JSONB DEFAULT '{}', -- User attributes from provider
    assertion_encrypted TEXT, -- Encrypted SAML assertion
    session_index VARCHAR(255), -- SAML session index
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Keys Table
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(20) NOT NULL, -- First few chars for identification
    key_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of the full key
    scopes TEXT[] DEFAULT '{}', -- API scopes/permissions
    rate_limit_tier VARCHAR(50) DEFAULT 'standard', -- rate limiting tier
    allowed_ips INET[] DEFAULT '{}', -- IP restrictions
    allowed_origins TEXT[] DEFAULT '{}', -- CORS origins
    last_used_at TIMESTAMPTZ,
    last_used_ip INET,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Key Usage Logs Table
CREATE TABLE api_key_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    request_size_bytes INTEGER,
    response_size_bytes INTEGER,
    ip_address INET,
    user_agent TEXT,
    error_message TEXT,
    used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Access Control Lists Table
CREATE TABLE access_control_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    resource_type VARCHAR(100) NOT NULL, -- project, deployment, function, etc.
    resource_id UUID, -- ID of the resource
    principal_type VARCHAR(50) NOT NULL, -- user, team, api_key, service_account
    principal_id UUID NOT NULL,
    permissions TEXT[] NOT NULL DEFAULT '{}', -- read, write, delete, admin
    conditions JSONB DEFAULT '{}', -- Conditional access rules
    granted_by UUID NOT NULL REFERENCES users(id),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security Audit Logs Table
CREATE TABLE security_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    risk_score DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 1.00
    anomaly_detected BOOLEAN DEFAULT FALSE,
    geolocation JSONB DEFAULT '{}',
    device_fingerprint VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security Policies Table
CREATE TABLE security_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    policy_type VARCHAR(50) NOT NULL, -- access_control, data_protection, network, compliance
    rules JSONB NOT NULL,
    enforcement_level VARCHAR(50) DEFAULT 'enforce', -- enforce, warn, audit
    scope JSONB DEFAULT '{}', -- Resources/users this policy applies to
    conditions JSONB DEFAULT '{}', -- When this policy applies
    is_active BOOLEAN DEFAULT TRUE,
    version INTEGER DEFAULT 1,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security Incidents Table
CREATE TABLE security_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    incident_type VARCHAR(100) NOT NULL, -- unauthorized_access, data_breach, malware, etc.
    severity VARCHAR(50) NOT NULL, -- low, medium, high, critical
    status VARCHAR(50) DEFAULT 'open', -- open, investigating, resolved, closed
    source VARCHAR(100), -- automated_detection, user_report, external_alert
    affected_resources JSONB DEFAULT '{}',
    timeline JSONB DEFAULT '{}', -- Incident timeline
    response_actions JSONB DEFAULT '{}',
    evidence JSONB DEFAULT '{}',
    assigned_to UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance Frameworks Table
CREATE TABLE compliance_frameworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL, -- SOC2, HIPAA, GDPR, PCI-DSS, etc.
    version VARCHAR(50),
    description TEXT,
    requirements JSONB NOT NULL, -- Compliance requirements
    controls JSONB NOT NULL, -- Required controls
    evidence_requirements JSONB DEFAULT '{}',
    audit_frequency VARCHAR(50), -- annual, semi_annual, quarterly
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Compliance Status Table
CREATE TABLE team_compliance_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    framework_id UUID NOT NULL REFERENCES compliance_frameworks(id),
    status VARCHAR(50) DEFAULT 'not_assessed', -- compliant, non_compliant, in_progress, not_assessed
    assessment_date DATE,
    next_assessment_date DATE,
    compliance_score DECIMAL(5,2), -- 0.00 to 100.00
    gaps JSONB DEFAULT '{}', -- Compliance gaps
    remediation_plan JSONB DEFAULT '{}',
    evidence JSONB DEFAULT '{}',
    assessor VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, framework_id)
);

-- Data Classification Table
CREATE TABLE data_classifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL, -- public, internal, confidential, restricted
    description TEXT,
    sensitivity_level INTEGER NOT NULL, -- 1-5 scale
    handling_requirements JSONB NOT NULL,
    retention_period INTEGER, -- days
    encryption_required BOOLEAN DEFAULT FALSE,
    access_logging_required BOOLEAN DEFAULT FALSE,
    anonymization_required BOOLEAN DEFAULT FALSE,
    geographic_restrictions TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Assets Table
CREATE TABLE data_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    asset_type VARCHAR(100) NOT NULL, -- database, file, api_endpoint, etc.
    classification_id UUID NOT NULL REFERENCES data_classifications(id),
    location JSONB NOT NULL, -- Where the data is stored
    data_schema JSONB DEFAULT '{}', -- Data structure/schema
    data_sources TEXT[] DEFAULT '{}',
    data_flows JSONB DEFAULT '{}', -- Where data flows to/from
    personal_data_present BOOLEAN DEFAULT FALSE,
    sensitive_data_present BOOLEAN DEFAULT FALSE,
    encryption_status VARCHAR(50) DEFAULT 'unknown', -- encrypted, unencrypted, partial, unknown
    backup_frequency VARCHAR(50),
    retention_policy VARCHAR(255),
    access_controls JSONB DEFAULT '{}',
    data_owner UUID REFERENCES users(id),
    data_steward UUID REFERENCES users(id),
    last_assessed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Encryption Keys Management Table
CREATE TABLE encryption_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    key_id VARCHAR(255) UNIQUE NOT NULL,
    key_type VARCHAR(50) NOT NULL, -- aes_256, rsa_2048, rsa_4096, ecdsa_p256
    purpose VARCHAR(100) NOT NULL, -- data_encryption, jwt_signing, api_signing
    algorithm VARCHAR(100) NOT NULL,
    key_size INTEGER,
    key_material_encrypted TEXT NOT NULL, -- Encrypted key material
    public_key TEXT, -- For asymmetric keys
    key_derivation_info JSONB DEFAULT '{}',
    rotation_schedule VARCHAR(50), -- daily, weekly, monthly, yearly, manual
    last_rotated_at TIMESTAMPTZ,
    next_rotation_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'active', -- active, rotated, revoked, compromised
    usage_count BIGINT DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Security and Enterprise
CREATE INDEX idx_auth_providers_team_id ON auth_providers(team_id);
CREATE INDEX idx_auth_providers_provider_type ON auth_providers(provider_type);
CREATE INDEX idx_auth_providers_is_active ON auth_providers(is_active);

CREATE INDEX idx_sso_sessions_session_id ON sso_sessions(session_id);
CREATE INDEX idx_sso_sessions_user_id ON sso_sessions(user_id);
CREATE INDEX idx_sso_sessions_expires_at ON sso_sessions(expires_at);

CREATE INDEX idx_api_keys_team_id ON api_keys(team_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active);

CREATE INDEX idx_api_key_usage_logs_api_key_id ON api_key_usage_logs(api_key_id);
CREATE INDEX idx_api_key_usage_logs_used_at_brin ON api_key_usage_logs USING BRIN(used_at); -- Time-series optimized

CREATE INDEX idx_access_control_lists_team_id ON access_control_lists(team_id);
CREATE INDEX idx_access_control_lists_resource ON access_control_lists(resource_type, resource_id);
CREATE INDEX idx_access_control_lists_principal ON access_control_lists(principal_type, principal_id);

CREATE INDEX idx_security_audit_logs_team_id ON security_audit_logs(team_id);
CREATE INDEX idx_security_audit_logs_user_id ON security_audit_logs(user_id);
CREATE INDEX idx_security_audit_logs_created_at_brin ON security_audit_logs USING BRIN(created_at); -- Time-series optimized
CREATE INDEX idx_security_audit_logs_action ON security_audit_logs(action);

CREATE INDEX idx_security_policies_team_id ON security_policies(team_id);
CREATE INDEX idx_security_policies_policy_type ON security_policies(policy_type);
CREATE INDEX idx_security_policies_is_active ON security_policies(is_active);

CREATE INDEX idx_security_incidents_team_id ON security_incidents(team_id);
CREATE INDEX idx_security_incidents_status ON security_incidents(status);
CREATE INDEX idx_security_incidents_severity ON security_incidents(severity);

CREATE INDEX idx_compliance_frameworks_name ON compliance_frameworks(name);
CREATE INDEX idx_compliance_frameworks_is_active ON compliance_frameworks(is_active);

CREATE INDEX idx_team_compliance_status_team_id ON team_compliance_status(team_id);
CREATE INDEX idx_team_compliance_status_framework_id ON team_compliance_status(framework_id);

CREATE INDEX idx_data_classifications_sensitivity_level ON data_classifications(sensitivity_level);

CREATE INDEX idx_data_assets_team_id ON data_assets(team_id);
CREATE INDEX idx_data_assets_classification_id ON data_assets(classification_id);
CREATE INDEX idx_data_assets_data_owner ON data_assets(data_owner);

CREATE INDEX idx_encryption_keys_team_id ON encryption_keys(team_id);
CREATE INDEX idx_encryption_keys_key_id ON encryption_keys(key_id);
CREATE INDEX idx_encryption_keys_status ON encryption_keys(status);
CREATE INDEX idx_encryption_keys_next_rotation_at ON encryption_keys(next_rotation_at);

-- Add migration tracking
INSERT INTO schema_migrations (version, description) 
VALUES (11, 'Create enterprise security and authentication tables')
ON CONFLICT (version) DO NOTHING; 