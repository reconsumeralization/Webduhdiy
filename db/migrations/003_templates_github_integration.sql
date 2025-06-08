-- Migration: 003_templates_github_integration.sql
-- Description: Template management and GitHub integration schema
-- Created: 2025-06-03

-- Enhanced project templates with comprehensive metadata
DROP TABLE IF EXISTS project_templates CASCADE;
CREATE TABLE IF NOT EXISTS project_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('frontend', 'fullstack', 'backend', 'static', 'mobile', 'starter')),
    framework VARCHAR(100) NOT NULL,
    repository_url VARCHAR(500),
    template_files JSONB NOT NULL DEFAULT '{}',
    build_config JSONB DEFAULT '{}',
    tags JSONB DEFAULT '[]',
    is_public BOOLEAN DEFAULT true,
    is_official BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    thumbnail_url VARCHAR(500),
    demo_url VARCHAR(500),
    download_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Template usage tracking
CREATE TABLE IF NOT EXISTS template_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    template_id UUID REFERENCES project_templates(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template reviews and ratings
CREATE TABLE IF NOT EXISTS template_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    template_id UUID REFERENCES project_templates(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(template_id, user_id)
);

-- Template forks
CREATE TABLE IF NOT EXISTS template_forks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    original_template_id UUID REFERENCES project_templates(id) ON DELETE CASCADE,
    forked_template_id UUID REFERENCES project_templates(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template sources (GitHub, GitLab, etc.)
CREATE TABLE IF NOT EXISTS template_sources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    template_id UUID REFERENCES project_templates(id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('github', 'gitlab', 'bitbucket', 'manual')),
    source_data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced git integrations
DROP TABLE IF EXISTS git_integrations CASCADE;
CREATE TABLE IF NOT EXISTS git_integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('github', 'gitlab', 'bitbucket')),
    repository_id VARCHAR(255) NOT NULL,
    repository_name VARCHAR(255) NOT NULL,
    repository_url VARCHAR(500),
    branch VARCHAR(255) DEFAULT 'main',
    installation_id VARCHAR(255),
    access_token_encrypted TEXT,
    webhook_id VARCHAR(255),
    webhook_url VARCHAR(500),
    auto_deploy BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(50) DEFAULT 'active' CHECK (sync_status IN ('active', 'paused', 'error', 'disabled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GitHub user connections
CREATE TABLE IF NOT EXISTS github_connections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    github_user_id INTEGER NOT NULL,
    github_username VARCHAR(255) NOT NULL,
    access_token_encrypted TEXT NOT NULL,
    scope VARCHAR(500),
    token_expires_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhook deliveries
DROP TABLE IF EXISTS webhook_deliveries CASCADE;
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    webhook_id VARCHAR(255),
    integration_id UUID REFERENCES git_integrations(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    response_headers JSONB,
    delivered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_ms INTEGER,
    retry_count INTEGER DEFAULT 0
);

-- Project deployments from templates
CREATE TABLE IF NOT EXISTS project_template_deployments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    template_id UUID REFERENCES project_templates(id) ON DELETE SET NULL,
    deployment_id UUID REFERENCES deployments(id) ON DELETE CASCADE,
    customizations JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template collections/categories
CREATE TABLE IF NOT EXISTS template_collections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    icon VARCHAR(100),
    color VARCHAR(50),
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template collection items
CREATE TABLE IF NOT EXISTS template_collection_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    collection_id UUID REFERENCES template_collections(id) ON DELETE CASCADE,
    template_id UUID REFERENCES project_templates(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(collection_id, template_id)
);

-- Template favorites
CREATE TABLE IF NOT EXISTS template_favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES project_templates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, template_id)
);

-- Repository import history
CREATE TABLE IF NOT EXISTS repository_imports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    repository_url VARCHAR(500) NOT NULL,
    repository_name VARCHAR(255) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    import_type VARCHAR(50) NOT NULL CHECK (import_type IN ('template', 'project', 'fork')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    result_id UUID, -- References template_id or project_id depending on import_type
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_project_templates_category ON project_templates(category);
CREATE INDEX IF NOT EXISTS idx_project_templates_framework ON project_templates(framework);
CREATE INDEX IF NOT EXISTS idx_project_templates_created_by ON project_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_project_templates_slug ON project_templates(slug);
CREATE INDEX IF NOT EXISTS idx_project_templates_featured ON project_templates(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_project_templates_public ON project_templates(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_project_templates_tags ON project_templates USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_project_templates_download_count ON project_templates(download_count DESC);

CREATE INDEX IF NOT EXISTS idx_template_usage_template_id ON template_usage(template_id);
CREATE INDEX IF NOT EXISTS idx_template_usage_user_id ON template_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_template_usage_created_at ON template_usage(created_at);

CREATE INDEX IF NOT EXISTS idx_template_reviews_template_id ON template_reviews(template_id);
CREATE INDEX IF NOT EXISTS idx_template_reviews_user_id ON template_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_template_reviews_rating ON template_reviews(rating);

CREATE INDEX IF NOT EXISTS idx_template_forks_original ON template_forks(original_template_id);
CREATE INDEX IF NOT EXISTS idx_template_forks_forked ON template_forks(forked_template_id);

CREATE INDEX IF NOT EXISTS idx_git_integrations_project_id ON git_integrations(project_id);
CREATE INDEX IF NOT EXISTS idx_git_integrations_provider ON git_integrations(provider);
CREATE INDEX IF NOT EXISTS idx_git_integrations_repository_id ON git_integrations(repository_id);

CREATE INDEX IF NOT EXISTS idx_github_connections_user_id ON github_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_github_connections_github_user_id ON github_connections(github_user_id);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_event_type ON webhook_deliveries(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_delivered_at ON webhook_deliveries(delivered_at);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_integration_id ON webhook_deliveries(integration_id);

CREATE INDEX IF NOT EXISTS idx_template_collection_items_collection ON template_collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_template_collection_items_template ON template_collection_items(template_id);

CREATE INDEX IF NOT EXISTS idx_template_favorites_user_id ON template_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_template_favorites_template_id ON template_favorites(template_id);

CREATE INDEX IF NOT EXISTS idx_repository_imports_user_id ON repository_imports(user_id);
CREATE INDEX IF NOT EXISTS idx_repository_imports_status ON repository_imports(status);
CREATE INDEX IF NOT EXISTS idx_repository_imports_created_at ON repository_imports(created_at);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_project_templates_updated_at 
    BEFORE UPDATE ON project_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_reviews_updated_at 
    BEFORE UPDATE ON template_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_git_integrations_updated_at 
    BEFORE UPDATE ON git_integrations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_github_connections_updated_at 
    BEFORE UPDATE ON github_connections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_collections_updated_at 
    BEFORE UPDATE ON template_collections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample template collections
INSERT INTO template_collections (name, description, slug, icon, color, is_featured, sort_order) VALUES
('Frontend', 'User interface and client-side applications', 'frontend', 'browser', '#3B82F6', true, 1),
('Full Stack', 'Complete applications with frontend and backend', 'fullstack', 'stack', '#8B5CF6', true, 2),
('Backend', 'Server-side applications and APIs', 'backend', 'server', '#10B981', true, 3),
('Static Sites', 'Static websites and documentation', 'static', 'document', '#F59E0B', true, 4),
('Mobile', 'Mobile applications and PWAs', 'mobile', 'phone', '#EF4444', true, 5),
('Starters', 'Basic templates to get started quickly', 'starter', 'rocket', '#6B7280', true, 6);

-- Insert sample official templates
INSERT INTO project_templates (
    name, slug, description, category, framework, 
    template_files, build_config, tags, 
    is_public, is_official, is_featured,
    thumbnail_url, demo_url
) VALUES 
(
    'React + Vite Starter',
    'react-vite-starter',
    'A modern React application with Vite for fast development and building.',
    'frontend',
    'react',
    '{"package.json": {"content": "{\n  \"name\": \"react-vite-app\",\n  \"private\": true,\n  \"version\": \"0.0.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"vite build\",\n    \"preview\": \"vite preview\"\n  },\n  \"dependencies\": {\n    \"react\": \"^18.2.0\",\n    \"react-dom\": \"^18.2.0\"\n  },\n  \"devDependencies\": {\n    \"@types/react\": \"^18.2.15\",\n    \"@types/react-dom\": \"^18.2.7\",\n    \"@vitejs/plugin-react\": \"^4.0.3\",\n    \"vite\": \"^4.4.5\"\n  }\n}", "type": "json"}}',
    '{"buildCommand": "npm run build", "installCommand": "npm install", "outputDirectory": "dist", "devCommand": "npm run dev"}',
    '["react", "vite", "frontend", "javascript", "starter"]',
    true,
    true,
    true,
    'https://vitejs.dev/logo.svg',
    'https://vite.new/react'
),
(
    'Next.js App Router',
    'nextjs-app-router',
    'Next.js 13+ with App Router, TypeScript, and Tailwind CSS.',
    'fullstack',
    'nextjs',
    '{"package.json": {"content": "{\n  \"name\": \"nextjs-app\",\n  \"version\": \"0.1.0\",\n  \"private\": true,\n  \"scripts\": {\n    \"dev\": \"next dev\",\n    \"build\": \"next build\",\n    \"start\": \"next start\",\n    \"lint\": \"next lint\"\n  },\n  \"dependencies\": {\n    \"next\": \"14.0.0\",\n    \"react\": \"^18\",\n    \"react-dom\": \"^18\"\n  },\n  \"devDependencies\": {\n    \"typescript\": \"^5\",\n    \"@types/node\": \"^20\",\n    \"@types/react\": \"^18\",\n    \"@types/react-dom\": \"^18\",\n    \"tailwindcss\": \"^3.3.0\",\n    \"autoprefixer\": \"^10.0.1\",\n    \"postcss\": \"^8\"\n  }\n}", "type": "json"}}',
    '{"buildCommand": "npm run build", "installCommand": "npm install", "outputDirectory": ".next", "devCommand": "npm run dev"}',
    '["nextjs", "react", "typescript", "tailwindcss", "fullstack"]',
    true,
    true,
    true,
    'https://nextjs.org/static/favicon/favicon-32x32.png',
    'https://vercel.com/templates/next.js'
);

-- Migration tracking
INSERT INTO schema_migrations (version, applied_at) VALUES ('003', NOW()) 
ON CONFLICT (version) DO NOTHING; 