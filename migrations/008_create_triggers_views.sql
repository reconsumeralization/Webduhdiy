-- Migration 008: Create Triggers and Views
-- WebduhVercel Database Migration
-- Created: 2024-02-06

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at 
    BEFORE UPDATE ON teams 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_files_updated_at 
    BEFORE UPDATE ON project_files 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_templates_updated_at 
    BEFORE UPDATE ON project_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deployments_updated_at 
    BEFORE UPDATE ON deployments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deployment_environments_updated_at 
    BEFORE UPDATE ON deployment_environments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_domains_updated_at 
    BEFORE UPDATE ON domains 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dns_records_updated_at 
    BEFORE UPDATE ON dns_records 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhooks_updated_at 
    BEFORE UPDATE ON webhooks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_builder_sessions_updated_at 
    BEFORE UPDATE ON ai_builder_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bolt_diy_integrations_updated_at 
    BEFORE UPDATE ON bolt_diy_integrations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_environment_variables_updated_at 
    BEFORE UPDATE ON environment_variables 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_git_integrations_updated_at 
    BEFORE UPDATE ON git_integrations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_subscriptions_updated_at 
    BEFORE UPDATE ON billing_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_invoices_updated_at 
    BEFORE UPDATE ON billing_invoices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at 
    BEFORE UPDATE ON payment_methods 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at 
    BEFORE UPDATE ON notification_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_status_incidents_updated_at 
    BEFORE UPDATE ON status_incidents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create useful views

-- Project Overview View
CREATE VIEW project_overview AS
SELECT 
    p.id,
    p.name,
    p.slug,
    p.description,
    p.framework,
    p.status,
    p.source_type,
    p.team_id,
    t.name as team_name,
    p.created_by,
    u.username as creator_username,
    p.created_at,
    p.updated_at,
    (SELECT COUNT(*) FROM project_files pf WHERE pf.project_id = p.id) as file_count,
    (SELECT COUNT(*) FROM deployments d WHERE d.project_id = p.id) as deployment_count,
    (SELECT MAX(d.created_at) FROM deployments d WHERE d.project_id = p.id AND d.status = 'ready') as last_deployment_at,
    (SELECT COUNT(*) FROM project_files pf WHERE pf.project_id = p.id AND pf.ai_generated = true) as ai_generated_files_count
FROM projects p
JOIN teams t ON p.team_id = t.id
JOIN users u ON p.created_by = u.id;

-- AI Builder Session Overview View
CREATE VIEW ai_builder_session_overview AS
SELECT 
    s.id,
    s.title,
    s.description,
    s.status,
    s.llm_provider,
    s.llm_model,
    s.user_id,
    u.username,
    s.project_id,
    p.name as project_name,
    s.iterations_count,
    s.total_tokens_used,
    s.export_status,
    s.created_at,
    s.updated_at,
    (SELECT COUNT(*) FROM ai_builder_messages m WHERE m.session_id = s.id) as message_count,
    (SELECT COUNT(*) FROM ai_builder_file_operations fo WHERE fo.session_id = s.id) as file_operation_count
FROM ai_builder_sessions s
JOIN users u ON s.user_id = u.id
LEFT JOIN projects p ON s.project_id = p.id;

-- Team Activity View
CREATE VIEW team_activity AS
SELECT 
    t.id as team_id,
    t.name as team_name,
    COUNT(DISTINCT p.id) as project_count,
    COUNT(DISTINCT tm.user_id) as member_count,
    COUNT(DISTINCT d.id) as total_deployments,
    COUNT(DISTINCT CASE WHEN d.created_at >= NOW() - INTERVAL '30 days' THEN d.id END) as deployments_last_30_days,
    MAX(d.created_at) as last_deployment_at,
    SUM(ut.value) FILTER (WHERE ut.metric = 'bandwidth' AND ut.period_start >= NOW() - INTERVAL '30 days') as bandwidth_last_30_days,
    t.created_at,
    t.updated_at
FROM teams t
LEFT JOIN team_members tm ON t.id = tm.team_id
LEFT JOIN projects p ON t.id = p.team_id
LEFT JOIN deployments d ON p.id = d.project_id
LEFT JOIN usage_tracking ut ON t.id = ut.team_id
GROUP BY t.id, t.name, t.created_at, t.updated_at;

-- Deployment Status Summary View
CREATE VIEW deployment_status_summary AS
SELECT 
    p.id as project_id,
    p.name as project_name,
    p.team_id,
    COUNT(d.id) as total_deployments,
    COUNT(CASE WHEN d.status = 'ready' THEN 1 END) as successful_deployments,
    COUNT(CASE WHEN d.status = 'error' THEN 1 END) as failed_deployments,
    COUNT(CASE WHEN d.status = 'pending' OR d.status = 'building' THEN 1 END) as pending_deployments,
    AVG(d.build_time_ms) FILTER (WHERE d.build_time_ms IS NOT NULL) as avg_build_time_ms,
    MAX(d.created_at) as last_deployment_at,
    MAX(CASE WHEN d.status = 'ready' THEN d.created_at END) as last_successful_deployment_at
FROM projects p
LEFT JOIN deployments d ON p.id = d.project_id
GROUP BY p.id, p.name, p.team_id;

-- User Activity Summary View
CREATE VIEW user_activity_summary AS
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    COUNT(DISTINCT p.id) as projects_created,
    COUNT(DISTINCT d.id) as deployments_created,
    COUNT(DISTINCT abs.id) as ai_builder_sessions,
    COUNT(DISTINCT tm.team_id) as teams_member_of,
    MAX(u.last_login_at) as last_login_at,
    COUNT(DISTINCT ual.id) FILTER (WHERE ual.created_at >= NOW() - INTERVAL '7 days') as activities_last_7_days,
    u.created_at,
    u.updated_at
FROM users u
LEFT JOIN projects p ON u.id = p.created_by
LEFT JOIN deployments d ON u.id = d.creator_id
LEFT JOIN ai_builder_sessions abs ON u.id = abs.user_id
LEFT JOIN team_members tm ON u.id = tm.user_id
LEFT JOIN user_activity_logs ual ON u.id = ual.user_id
GROUP BY u.id, u.username, u.email, u.last_login_at, u.created_at, u.updated_at;

-- File Type Distribution View
CREATE VIEW file_type_distribution AS
SELECT 
    p.id as project_id,
    p.name as project_name,
    pf.file_type,
    COUNT(*) as file_count,
    SUM(pf.file_size) as total_size_bytes,
    AVG(pf.file_size) as avg_file_size_bytes,
    COUNT(CASE WHEN pf.ai_generated = true THEN 1 END) as ai_generated_count
FROM projects p
JOIN project_files pf ON p.id = pf.project_id
GROUP BY p.id, p.name, pf.file_type;

-- System Health Dashboard View
CREATE VIEW system_health_dashboard AS
SELECT 
    shm.service_name,
    COUNT(*) as metric_count,
    COUNT(CASE WHEN shm.healthy = true THEN 1 END) as healthy_metrics,
    COUNT(CASE WHEN shm.healthy = false THEN 1 END) as unhealthy_metrics,
    AVG(shm.value) FILTER (WHERE shm.timestamp >= NOW() - INTERVAL '1 hour') as avg_value_last_hour,
    MAX(shm.timestamp) as last_metric_timestamp
FROM system_health_metrics shm
WHERE shm.timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY shm.service_name;

-- Add foreign key constraint that was referenced in project table
ALTER TABLE ai_builder_sessions 
ADD CONSTRAINT fk_ai_builder_sessions_project 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

ALTER TABLE bolt_diy_integrations 
ADD CONSTRAINT fk_bolt_diy_integrations_project 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- Add migration tracking
INSERT INTO schema_migrations (version, description) 
VALUES (8, 'Create triggers and database views')
ON CONFLICT (version) DO NOTHING; 