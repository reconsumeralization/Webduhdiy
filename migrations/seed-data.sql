-- Seed Data for WebduhVercel Platform
-- Development and Testing Data
-- Created: 2024-02-06

-- Insert seed users
INSERT INTO users (id, email, username, full_name, password_hash, email_verified) VALUES 
(
    '01234567-89ab-cdef-0123-456789abcdef',
    'admin@webduh.com',
    'admin',
    'WebduhVercel Admin',
    '$2b$10$rEqaN1234567890abcdef1234567890123456789012345', -- placeholder hash
    true
),
(
    'abcdef01-2345-6789-abcd-ef0123456789',
    'developer@webduh.com', 
    'developer',
    'John Developer',
    '$2b$10$rEqaN1234567890abcdef1234567890123456789012345', -- placeholder hash
    true
),
(
    'fedcba09-8765-4321-fedc-ba0987654321',
    'designer@webduh.com',
    'designer', 
    'Jane Designer',
    '$2b$10$rEqaN1234567890abcdef1234567890123456789012345', -- placeholder hash
    true
)
ON CONFLICT (email) DO NOTHING;

-- Insert seed teams
INSERT INTO teams (id, name, slug, description, plan) VALUES
(
    '11111111-2222-3333-4444-555555555555',
    'WebduhVercel Team',
    'webduh-team',
    'The main WebduhVercel development team',
    'enterprise'
),
(
    '22222222-3333-4444-5555-666666666666',
    'Demo Projects',
    'demo-projects',
    'Demo and example projects',
    'pro'
),
(
    '33333333-4444-5555-6666-777777777777',
    'Open Source',
    'open-source',
    'Open source projects and templates',
    'free'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert team members
INSERT INTO team_members (team_id, user_id, role) VALUES
('11111111-2222-3333-4444-555555555555', '01234567-89ab-cdef-0123-456789abcdef', 'owner'),
('11111111-2222-3333-4444-555555555555', 'abcdef01-2345-6789-abcd-ef0123456789', 'admin'),
('11111111-2222-3333-4444-555555555555', 'fedcba09-8765-4321-fedc-ba0987654321', 'member'),
('22222222-3333-4444-5555-666666666666', 'abcdef01-2345-6789-abcd-ef0123456789', 'owner'),
('33333333-4444-5555-6666-777777777777', 'fedcba09-8765-4321-fedc-ba0987654321', 'owner')
ON CONFLICT (team_id, user_id) DO NOTHING;

-- Insert AI Builder sessions
INSERT INTO ai_builder_sessions (id, user_id, title, description, llm_provider, llm_model, status) VALUES
(
    '88888888-9999-aaaa-bbbb-cccccccccccc',
    'abcdef01-2345-6789-abcd-ef0123456789',
    'React Todo App',
    'Building a modern todo application with React and TypeScript',
    'openai',
    'gpt-4',
    'active'
),
(
    '99999999-aaaa-bbbb-cccc-dddddddddddd',
    'fedcba09-8765-4321-fedc-ba0987654321',
    'Portfolio Website',
    'Creating a personal portfolio website with Next.js',
    'anthropic',
    'claude-3-sonnet',
    'completed'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, name, slug, description, framework, team_id, created_by, source_type, ai_builder_session_id) VALUES
(
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    'Webduh Landing Page',
    'webduh-landing',
    'The main landing page for WebduhVercel platform',
    'nextjs',
    '11111111-2222-3333-4444-555555555555',
    '01234567-89ab-cdef-0123-456789abcdef',
    'git',
    NULL
),
(
    'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
    'Todo App Demo',
    'todo-app-demo',
    'A React todo application demo with full CRUD functionality',
    'react',
    '22222222-3333-4444-5555-666666666666',
    'abcdef01-2345-6789-abcd-ef0123456789',
    'ai-builder',
    '88888888-9999-aaaa-bbbb-cccccccccccc'
),
(
    'cccccccc-dddd-eeee-ffff-000000000000',
    'Portfolio Template',
    'portfolio-template',
    'A beautiful portfolio template for developers and designers',
    'nextjs',
    '33333333-4444-5555-6666-777777777777',
    'fedcba09-8765-4321-fedc-ba0987654321',
    'ai-builder',
    '99999999-aaaa-bbbb-cccc-dddddddddddd'
)
ON CONFLICT (team_id, slug) DO NOTHING;

-- Update AI Builder sessions with project IDs
UPDATE ai_builder_sessions 
SET project_id = 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff', export_status = 'exported'
WHERE id = '88888888-9999-aaaa-bbbb-cccccccccccc';

UPDATE ai_builder_sessions 
SET project_id = 'cccccccc-dddd-eeee-ffff-000000000000', export_status = 'exported'
WHERE id = '99999999-aaaa-bbbb-cccc-dddddddddddd';

-- Insert sample project files
INSERT INTO project_files (project_id, file_path, file_name, file_type, content, content_hash, file_size, mime_type, parent_directory, created_by, ai_generated) VALUES
(
    'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
    'src/App.tsx',
    'App.tsx',
    'typescript',
    'import React from "react";\nimport TodoList from "./components/TodoList";\n\nfunction App() {\n  return (\n    <div className="App">\n      <h1>Todo App</h1>\n      <TodoList />\n    </div>\n  );\n}\n\nexport default App;',
    '1234567890abcdef1234567890abcdef12345678',
    194,
    'application/typescript',
    'src',
    'abcdef01-2345-6789-abcd-ef0123456789',
    true
),
(
    'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
    'package.json',
    'package.json',
    'json',
    '{\n  "name": "todo-app-demo",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}',
    'abcdef1234567890abcdef1234567890abcdef12',
    122,
    'application/json',
    '.',
    'abcdef01-2345-6789-abcd-ef0123456789',
    false
),
(
    'cccccccc-dddd-eeee-ffff-000000000000',
    'pages/index.tsx',
    'index.tsx',
    'typescript',
    'import React from "react";\nimport Layout from "../components/Layout";\n\nexport default function Home() {\n  return (\n    <Layout>\n      <h1>Welcome to My Portfolio</h1>\n      <p>I am a full-stack developer...</p>\n    </Layout>\n  );\n}',
    'fedcba0987654321fedcba0987654321fedcba09',
    203,
    'application/typescript',
    'pages',
    'fedcba09-8765-4321-fedc-ba0987654321',
    true
)
ON CONFLICT (project_id, file_path) DO NOTHING;

-- Insert sample deployments
INSERT INTO deployments (id, project_id, name, url, status, type, source, creator_id, build_time_ms, ready_at) VALUES
(
    'dddddddd-eeee-ffff-0000-111111111111',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    'webduh-landing-prod-1',
    'https://webduh.com',
    'ready',
    'production',
    'git',
    '01234567-89ab-cdef-0123-456789abcdef',
    45000,
    NOW() - INTERVAL '2 days'
),
(
    'eeeeeeee-ffff-0000-1111-222222222222',
    'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
    'todo-app-demo-preview-1',
    'https://todo-app-demo-preview.webduh.app',
    'ready',
    'preview',
    'ai-builder',
    'abcdef01-2345-6789-abcd-ef0123456789',
    32000,
    NOW() - INTERVAL '1 day'
),
(
    'ffffffff-0000-1111-2222-333333333333',
    'cccccccc-dddd-eeee-ffff-000000000000',
    'portfolio-template-preview-1',
    'https://portfolio-template.webduh.app',
    'ready',
    'preview',
    'ai-builder',
    'fedcba09-8765-4321-fedc-ba0987654321',
    28000,
    NOW() - INTERVAL '6 hours'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample project templates
INSERT INTO project_templates (id, name, description, framework, category, tags, is_official, is_public, created_by, template_files) VALUES
(
    '44444444-5555-6666-7777-888888888888',
    'Next.js Starter',
    'A clean Next.js starter template with TypeScript and Tailwind CSS',
    'nextjs',
    'frontend',
    ARRAY['nextjs', 'typescript', 'tailwind', 'starter'],
    true,
    true,
    '01234567-89ab-cdef-0123-456789abcdef',
    '{"package.json": {"content": "{\"name\": \"nextjs-starter\", \"version\": \"1.0.0\"}"}, "pages/index.tsx": {"content": "export default function Home() { return <h1>Hello World</h1>; }"}}'::jsonb
),
(
    '55555555-6666-7777-8888-999999999999',
    'React Component Library',
    'A template for building React component libraries with Storybook',
    'react',
    'library',
    ARRAY['react', 'storybook', 'components', 'library'],
    true,
    true,
    'fedcba09-8765-4321-fedc-ba0987654321',
    '{"package.json": {"content": "{\"name\": \"react-components\", \"version\": \"1.0.0\"}"}, "src/index.ts": {"content": "export * from \"./components\";"}}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample environment variables
INSERT INTO environment_variables (project_id, key, value, target, created_by, encrypted) VALUES
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'NEXT_PUBLIC_API_URL', 'https://api.webduh.com', 'all', '01234567-89ab-cdef-0123-456789abcdef', false),
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'DATABASE_URL', 'postgresql://***', 'production', '01234567-89ab-cdef-0123-456789abcdef', true),
('bbbbbbbb-cccc-dddd-eeee-ffffffffffff', 'REACT_APP_DEMO_MODE', 'true', 'preview', 'abcdef01-2345-6789-abcd-ef0123456789', false)
ON CONFLICT (project_id, key, target) DO NOTHING;

-- Insert sample domains
INSERT INTO domains (id, name, project_id, team_id, verification_status, ssl_status, created_by) VALUES
(
    '66666666-7777-8888-9999-aaaaaaaaaaaa',
    'webduh.com',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    '11111111-2222-3333-4444-555555555555',
    'verified',
    'provisioned',
    '01234567-89ab-cdef-0123-456789abcdef'
),
(
    '77777777-8888-9999-aaaa-bbbbbbbbbbbb',
    'demo.webduh.app',
    'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
    '22222222-3333-4444-5555-666666666666',
    'verified',
    'provisioned',
    'abcdef01-2345-6789-abcd-ef0123456789'
)
ON CONFLICT (name) DO NOTHING;

-- Insert sample project sync history
INSERT INTO project_sync_history (project_id, sync_type, source_reference, files_added, files_changed, initiated_by) VALUES
('bbbbbbbb-cccc-dddd-eeee-ffffffffffff', 'ai_builder_import', '88888888-9999-aaaa-bbbb-cccccccccccc', 5, 0, 'abcdef01-2345-6789-abcd-ef0123456789'),
('cccccccc-dddd-eeee-ffff-000000000000', 'ai_builder_import', '99999999-aaaa-bbbb-cccc-dddddddddddd', 8, 2, 'fedcba09-8765-4321-fedc-ba0987654321')
ON CONFLICT DO NOTHING;

-- Insert sample analytics events
INSERT INTO analytics_events (project_id, deployment_id, event_type, path, status_code, duration_ms) VALUES
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'dddddddd-eeee-ffff-0000-111111111111', 'page_view', '/', 200, 245),
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'dddddddd-eeee-ffff-0000-111111111111', 'page_view', '/about', 200, 189),
('bbbbbbbb-cccc-dddd-eeee-ffffffffffff', 'eeeeeeee-ffff-0000-1111-222222222222', 'page_view', '/', 200, 156)
ON CONFLICT DO NOTHING;

-- Insert sample performance metrics
INSERT INTO performance_metrics (project_id, deployment_id, metric_type, value, unit) VALUES
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'dddddddd-eeee-ffff-0000-111111111111', 'response_time', 245.5, 'ms'),
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'dddddddd-eeee-ffff-0000-111111111111', 'error_rate', 0.1, 'percentage'),
('bbbbbbbb-cccc-dddd-eeee-ffffffffffff', 'eeeeeeee-ffff-0000-1111-222222222222', 'response_time', 156.8, 'ms')
ON CONFLICT DO NOTHING;

-- Insert sample notification preferences
INSERT INTO notification_preferences (user_id, notification_type, channel, enabled) VALUES
('01234567-89ab-cdef-0123-456789abcdef', 'deployment_success', 'email', true),
('01234567-89ab-cdef-0123-456789abcdef', 'deployment_failure', 'email', true),
('abcdef01-2345-6789-abcd-ef0123456789', 'deployment_success', 'email', true),
('fedcba09-8765-4321-fedc-ba0987654321', 'deployment_failure', 'email', true)
ON CONFLICT (user_id, team_id, notification_type, channel) DO NOTHING;

-- Update project file structure cache
UPDATE projects SET file_structure = jsonb_build_object(
  'src/App.tsx', jsonb_build_object('type', 'typescript', 'size', 194),
  'package.json', jsonb_build_object('type', 'json', 'size', 122)
) WHERE id = 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff';

UPDATE projects SET file_structure = jsonb_build_object(
  'pages/index.tsx', jsonb_build_object('type', 'typescript', 'size', 203)
) WHERE id = 'cccccccc-dddd-eeee-ffff-000000000000';

-- Insert success message
INSERT INTO schema_migrations (version, description) VALUES 
(999, 'Seed data inserted successfully - ' || CURRENT_TIMESTAMP::text)
ON CONFLICT (version) DO UPDATE SET 
description = EXCLUDED.description,
applied_at = NOW(); 