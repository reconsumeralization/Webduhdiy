-- Enterprise Seed Data for WebduhVercel Platform
-- Extended seed data with payment processing, edge functions, security, and infrastructure
-- Created: 2024-02-06

-- Insert Payment Providers
INSERT INTO payment_providers (id, name, display_name, provider_type, supported_currencies, supported_countries, configuration, is_active, priority, processing_fees, created_by) VALUES
(
    'pay00001-0000-0000-0000-000000000001',
    'stripe',
    'Stripe',
    'payment_processor',
    ARRAY['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    ARRAY['US', 'CA', 'GB', 'AU', 'FR', 'DE', 'ES', 'IT'],
    '{"api_version": "2023-10-16", "webhook_secret": "whsec_test123", "connect_enabled": true}',
    true,
    1,
    '{"fixed_fee": 30, "percentage": 2.9, "international_fee": 1.5}',
    '01234567-89ab-cdef-0123-456789abcdef'
),
(
    'pay00002-0000-0000-0000-000000000002',
    'paypal',
    'PayPal',
    'digital_wallet',
    ARRAY['USD', 'EUR', 'GBP'],
    ARRAY['US', 'CA', 'GB', 'AU', 'FR', 'DE'],
    '{"api_version": "v1", "mode": "sandbox", "webhook_id": "WH-test123"}',
    true,
    2,
    '{"fixed_fee": 0, "percentage": 3.4, "international_fee": 2.0}',
    '01234567-89ab-cdef-0123-456789abcdef'
)
ON CONFLICT (id) DO NOTHING;

-- Insert Edge Runtimes
INSERT INTO edge_runtimes (id, name, version, runtime_type, supported_regions, default_timeout, max_timeout, memory_limit, max_memory, is_active) VALUES
(
    'edge0001-0000-0000-0000-000000000001',
    'nodejs20',
    '20.10.0',
    'nodejs',
    ARRAY['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'],
    30000,
    900000,
    128,
    3008,
    true
),
(
    'edge0002-0000-0000-0000-000000000002',
    'deno1.38',
    '1.38.0',
    'deno',
    ARRAY['us-east-1', 'us-west-2', 'eu-west-1'],
    30000,
    300000,
    128,
    1024,
    true
),
(
    'edge0003-0000-0000-0000-000000000003',
    'python3.11',
    '3.11.6',
    'python',
    ARRAY['us-east-1', 'us-west-2'],
    30000,
    900000,
    128,
    3008,
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Edge Functions
INSERT INTO edge_functions (id, project_id, name, slug, description, runtime_id, source_code, handler, created_by) VALUES
(
    'func0001-0000-0000-0000-000000000001',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    'API Rate Limiter',
    'api-rate-limiter',
    'Rate limiting middleware for API endpoints',
    'edge0001-0000-0000-0000-000000000001',
    'export default async function(request) { const ip = request.headers.get("x-forwarded-for"); /* Rate limiting logic */ return new Response("OK"); }',
    'default',
    '01234567-89ab-cdef-0123-456789abcdef'
),
(
    'func0002-0000-0000-0000-000000000002',
    'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
    'Image Optimizer',
    'image-optimizer',
    'On-the-fly image optimization and resizing',
    'edge0002-0000-0000-0000-000000000002',
    'export default async function(request) { const url = new URL(request.url); /* Image processing */ return new Response("Optimized"); }',
    'default',
    'abcdef01-2345-6789-abcd-ef0123456789'
)
ON CONFLICT (project_id, slug) DO NOTHING;

-- Insert Authentication Providers (Enterprise SSO)
INSERT INTO auth_providers (id, team_id, name, provider_type, configuration, sso_url, domain_restrictions, is_active, enforce_for_team, created_by) VALUES
(
    'auth0001-0000-0000-0000-000000000001',
    '11111111-2222-3333-4444-555555555555',
    'Company SAML',
    'saml',
    '{"entity_id": "webduh-sso", "certificate": "-----BEGIN CERTIFICATE-----", "auto_provision": true}',
    'https://sso.company.com/saml/login',
    ARRAY['company.com', 'subsidiary.com'],
    true,
    false,
    '01234567-89ab-cdef-0123-456789abcdef'
),
(
    'auth0002-0000-0000-0000-000000000002',
    '22222222-3333-4444-5555-666666666666',
    'Google Workspace',
    'oidc',
    '{"client_id": "google-client-123", "issuer": "https://accounts.google.com"}',
    'https://accounts.google.com/oauth/authorize',
    ARRAY['demo.webduh.com'],
    true,
    false,
    'abcdef01-2345-6789-abcd-ef0123456789'
)
ON CONFLICT (id) DO NOTHING;

-- Insert API Keys
INSERT INTO api_keys (id, team_id, user_id, name, key_prefix, key_hash, scopes, rate_limit_tier, is_active, created_by) VALUES
(
    'api00001-0000-0000-0000-000000000001',
    '11111111-2222-3333-4444-555555555555',
    '01234567-89ab-cdef-0123-456789abcdef',
    'Production API Key',
    'wdh_prod_',
    'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    ARRAY['projects:read', 'projects:write', 'deployments:read', 'deployments:write'],
    'premium',
    true,
    '01234567-89ab-cdef-0123-456789abcdef'
),
(
    'api00002-0000-0000-0000-000000000002',
    '22222222-3333-4444-5555-666666666666',
    'abcdef01-2345-6789-abcd-ef0123456789',
    'Development API Key',
    'wdh_dev_',
    'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567',
    ARRAY['projects:read', 'deployments:read'],
    'standard',
    true,
    'abcdef01-2345-6789-abcd-ef0123456789'
)
ON CONFLICT (id) DO NOTHING;

-- Insert Data Classifications
INSERT INTO data_classifications (id, name, description, sensitivity_level, handling_requirements, retention_period, encryption_required, access_logging_required) VALUES
(
    'class001-0000-0000-0000-000000000001',
    'Public',
    'Information that can be freely shared',
    1,
    '{"access_control": "none", "sharing": "unrestricted"}',
    365,
    false,
    false
),
(
    'class002-0000-0000-0000-000000000002',
    'Internal',
    'Information for internal use only',
    2,
    '{"access_control": "team_based", "sharing": "internal_only"}',
    1095,
    false,
    true
),
(
    'class003-0000-0000-0000-000000000003',
    'Confidential',
    'Sensitive business information',
    3,
    '{"access_control": "role_based", "sharing": "need_to_know"}',
    2555,
    true,
    true
),
(
    'class004-0000-0000-0000-000000000004',
    'Restricted',
    'Highly sensitive information requiring special handling',
    4,
    '{"access_control": "explicit_approval", "sharing": "prohibited", "audit_required": true}',
    7300,
    true,
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert Storage Systems
INSERT INTO storage_systems (id, name, storage_type, provider, region, bucket_name, configuration, is_default, is_active, created_by) VALUES
(
    'stor0001-0000-0000-0000-000000000001',
    'Primary S3 Storage',
    's3',
    'aws',
    'us-east-1',
    'webduh-production-assets',
    '{"access_key_id": "AKIA...", "region": "us-east-1", "versioning": true, "lifecycle_rules": true}',
    true,
    true,
    '01234567-89ab-cdef-0123-456789abcdef'
),
(
    'stor0002-0000-0000-0000-000000000002',
    'CDN Storage',
    'cdn',
    'cloudflare',
    'global',
    'webduh-cdn',
    '{"zone_id": "cf123456", "purge_cache": true, "compression": true}',
    false,
    true,
    '01234567-89ab-cdef-0123-456789abcdef'
)
ON CONFLICT (id) DO NOTHING;

-- Insert Job Queues
INSERT INTO job_queues (id, name, description, queue_type, configuration, max_workers, max_retries, is_active) VALUES
(
    'queue001-0000-0000-0000-000000000001',
    'default',
    'Default background job queue',
    'redis',
    '{"redis_url": "redis://localhost:6379", "db": 0}',
    5,
    3,
    true
),
(
    'queue002-0000-0000-0000-000000000002',
    'deployments',
    'Deployment processing queue',
    'redis',
    '{"redis_url": "redis://localhost:6379", "db": 1}',
    10,
    2,
    true
),
(
    'queue003-0000-0000-0000-000000000003',
    'analytics',
    'Analytics data processing',
    'redis',
    '{"redis_url": "redis://localhost:6379", "db": 2}',
    3,
    5,
    true
)
ON CONFLICT (name) DO NOTHING;

-- Insert Sample Background Jobs
INSERT INTO background_jobs (id, queue_id, job_type, payload, status, created_by) VALUES
(
    'job00001-0000-0000-0000-000000000001',
    'queue001-0000-0000-0000-000000000001',
    'project_cleanup',
    '{"project_id": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee", "action": "cleanup_old_deployments"}',
    'completed',
    '01234567-89ab-cdef-0123-456789abcdef'
),
(
    'job00002-0000-0000-0000-000000000002',
    'queue002-0000-0000-0000-000000000002',
    'deployment_build',
    '{"deployment_id": "dddddddd-eeee-ffff-0000-111111111111", "build_config": {"framework": "nextjs"}}',
    'completed',
    '01234567-89ab-cdef-0123-456789abcdef'
)
ON CONFLICT (id) DO NOTHING;

-- Insert Cache Systems
INSERT INTO cache_systems (id, name, cache_type, configuration, max_memory_mb, eviction_policy, default_ttl_seconds, is_active) VALUES
(
    'cache001-0000-0000-0000-000000000001',
    'Redis Primary',
    'redis',
    '{"redis_url": "redis://localhost:6379", "cluster_mode": false}',
    1024,
    'lru',
    3600,
    true
),
(
    'cache002-0000-0000-0000-000000000002',
    'Memory Cache',
    'memory',
    '{"max_entries": 10000}',
    512,
    'lfu',
    1800,
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert Service Health Checks
INSERT INTO service_health_checks (id, service_name, check_name, check_type, endpoint_url, check_interval_seconds, timeout_seconds, is_active, created_by) VALUES
(
    'health01-0000-0000-0000-000000000001',
    'api',
    'API Health Check',
    'http',
    'http://localhost:3001/health',
    30,
    10,
    true,
    '01234567-89ab-cdef-0123-456789abcdef'
),
(
    'health02-0000-0000-0000-000000000002',
    'dashboard',
    'Dashboard Health Check',
    'http',
    'http://localhost:3000/api/health',
    60,
    15,
    true,
    '01234567-89ab-cdef-0123-456789abcdef'
),
(
    'health03-0000-0000-0000-000000000003',
    'database',
    'Database Connection Check',
    'tcp',
    'postgresql://localhost:5432',
    120,
    5,
    true,
    '01234567-89ab-cdef-0123-456789abcdef'
)
ON CONFLICT (service_name, check_name) DO NOTHING;

-- Insert Connection Pools
INSERT INTO connection_pools (id, name, database_type, host, port, database_name, username, min_connections, max_connections, is_active, created_by) VALUES
(
    'pool0001-0000-0000-0000-000000000001',
    'Primary Database',
    'postgresql',
    'localhost',
    5432,
    'webduhvercel',
    'postgres',
    2,
    20,
    true,
    '01234567-89ab-cdef-0123-456789abcdef'
),
(
    'pool0002-0000-0000-0000-000000000002',
    'Redis Cache',
    'redis',
    'localhost',
    6379,
    '0',
    'default',
    1,
    10,
    true,
    '01234567-89ab-cdef-0123-456789abcdef'
)
ON CONFLICT (id) DO NOTHING;

-- Insert Compliance Frameworks
INSERT INTO compliance_frameworks (id, name, version, description, requirements, controls, is_active) VALUES
(
    'comp0001-0000-0000-0000-000000000001',
    'SOC2 Type II',
    '2023',
    'SOC 2 Type II compliance framework',
    '{"security": ["access_controls", "encryption"], "availability": ["monitoring", "redundancy"], "confidentiality": ["data_classification", "access_logging"]}',
    '{"CC6.1": "Logical access security measures", "CC6.2": "Authentication and authorization", "CC7.1": "System monitoring"}',
    true
),
(
    'comp0002-0000-0000-0000-000000000002',
    'GDPR',
    '2018',
    'General Data Protection Regulation',
    '{"data_protection": ["consent", "right_to_erasure"], "privacy": ["data_minimization", "purpose_limitation"]}',
    '{"Art.32": "Security of processing", "Art.25": "Data protection by design"}',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert Security Policies
INSERT INTO security_policies (id, team_id, name, description, policy_type, rules, enforcement_level, is_active, created_by) VALUES
(
    'policy01-0000-0000-0000-000000000001',
    '11111111-2222-3333-4444-555555555555',
    'Data Access Policy',
    'Controls access to sensitive data',
    'access_control',
    '{"require_mfa": true, "max_session_duration": 8, "ip_restrictions": ["10.0.0.0/8", "192.168.0.0/16"]}',
    'enforce',
    true,
    '01234567-89ab-cdef-0123-456789abcdef'
),
(
    'policy02-0000-0000-0000-000000000002',
    '11111111-2222-3333-4444-555555555555',
    'Data Encryption Policy',
    'Requires encryption for sensitive data',
    'data_protection',
    '{"encryption_at_rest": true, "encryption_in_transit": true, "key_rotation_days": 90}',
    'enforce',
    true,
    '01234567-89ab-cdef-0123-456789abcdef'
)
ON CONFLICT (id) DO NOTHING;

-- Insert Alert Rules
INSERT INTO alert_rules (id, team_id, name, description, rule_type, query, threshold_value, threshold_operator, severity, is_active, created_by) VALUES
(
    'alert001-0000-0000-0000-000000000001',
    '11111111-2222-3333-4444-555555555555',
    'High Error Rate',
    'Alert when error rate exceeds 5%',
    'metric_threshold',
    'rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100',
    5.0,
    '>',
    'high',
    true,
    '01234567-89ab-cdef-0123-456789abcdef'
),
(
    'alert002-0000-0000-0000-000000000002',
    '11111111-2222-3333-4444-555555555555',
    'Database Connection Pool Full',
    'Alert when connection pool utilization is high',
    'metric_threshold',
    'connection_pool_active_connections / connection_pool_max_connections * 100',
    90.0,
    '>',
    'medium',
    true,
    '01234567-89ab-cdef-0123-456789abcdef'
)
ON CONFLICT (id) DO NOTHING;

-- Insert CDN Cache Configurations
INSERT INTO cdn_cache_configs (id, project_id, name, path_patterns, cache_behavior, ttl_seconds, compression_enabled, is_active, created_by) VALUES
(
    'cdn00001-0000-0000-0000-000000000001',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    'Static Assets Cache',
    ARRAY['/_next/static/*', '/images/*', '/css/*', '/js/*'],
    'cache',
    86400,
    true,
    true,
    '01234567-89ab-cdef-0123-456789abcdef'
),
(
    'cdn00002-0000-0000-0000-000000000002',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    'API Response Cache',
    ARRAY['/api/v1/*'],
    'cache',
    300,
    true,
    true,
    '01234567-89ab-cdef-0123-456789abcdef'
)
ON CONFLICT (id) DO NOTHING;

-- Insert Rate Limiting Rules
INSERT INTO rate_limiting_rules (id, project_id, name, path_patterns, limit_type, limit_value, window_size, identifier_type, is_active, created_by) VALUES
(
    'rate0001-0000-0000-0000-000000000001',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    'API Rate Limit',
    ARRAY['/api/*'],
    'requests_per_minute',
    100,
    60,
    'ip',
    true,
    '01234567-89ab-cdef-0123-456789abcdef'
),
(
    'rate0002-0000-0000-0000-000000000002',
    'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
    'Demo App Rate Limit',
    ARRAY['/*'],
    'requests_per_minute',
    50,
    60,
    'ip',
    true,
    'abcdef01-2345-6789-abcd-ef0123456789'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample payment intents and transactions
INSERT INTO payment_intents (id, team_id, provider_id, amount, currency, status, description, created_at) VALUES
(
    'pi000001-0000-0000-0000-000000000001',
    '11111111-2222-3333-4444-555555555555',
    'pay00001-0000-0000-0000-000000000001',
    2900,
    'USD',
    'succeeded',
    'Monthly subscription payment',
    NOW() - INTERVAL '1 day'
),
(
    'pi000002-0000-0000-0000-000000000002',
    '22222222-3333-4444-5555-666666666666',
    'pay00001-0000-0000-0000-000000000001',
    1900,
    'USD',
    'succeeded',
    'Pro plan upgrade',
    NOW() - INTERVAL '3 days'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample payment transactions
INSERT INTO payment_transactions (id, payment_intent_id, team_id, type, status, amount, currency, fee_amount, provider_fee_amount, platform_fee_amount, processed_at) VALUES
(
    'tx000001-0000-0000-0000-000000000001',
    'pi000001-0000-0000-0000-000000000001',
    '11111111-2222-3333-4444-555555555555',
    'payment',
    'succeeded',
    2900,
    'USD',
    115,
    84,
    31,
    NOW() - INTERVAL '1 day'
),
(
    'tx000002-0000-0000-0000-000000000002',
    'pi000002-0000-0000-0000-000000000002',
    '22222222-3333-4444-5555-666666666666',
    'payment',
    'succeeded',
    1900,
    'USD',
    80,
    55,
    25,
    NOW() - INTERVAL '3 days'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample fraud detection rules
INSERT INTO fraud_detection_rules (id, name, description, rule_type, conditions, action, risk_score_adjustment, is_active, created_by) VALUES
(
    'fraud001-0000-0000-0000-000000000001',
    'High Value Transaction',
    'Flag transactions over $1000',
    'amount',
    '{"threshold": 100000, "currency": "USD"}',
    'review',
    0.3,
    true,
    '01234567-89ab-cdef-0123-456789abcdef'
),
(
    'fraud002-0000-0000-0000-000000000002',
    'Velocity Check',
    'Flag multiple transactions from same IP',
    'velocity',
    '{"max_transactions": 5, "time_window": 3600, "identifier": "ip_address"}',
    'block',
    0.5,
    true,
    '01234567-89ab-cdef-0123-456789abcdef'
)
ON CONFLICT (id) DO NOTHING;

-- Insert success message
INSERT INTO schema_migrations (version, description) VALUES 
(999, 'Enterprise seed data inserted successfully - ' || CURRENT_TIMESTAMP::text)
ON CONFLICT (version) DO UPDATE SET 
description = EXCLUDED.description,
applied_at = NOW(); 