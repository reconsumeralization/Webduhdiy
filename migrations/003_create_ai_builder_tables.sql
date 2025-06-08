-- Migration 003: Create AI Builder Tables
-- WebduhVercel Database Migration
-- Created: 2024-02-06

-- AI Builder Sessions Table
CREATE TABLE ai_builder_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID, -- Will be linked after projects table is created
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active', -- active, completed, archived, synced
    llm_provider VARCHAR(50) NOT NULL, -- openai, anthropic, groq, ollama, perplexity
    llm_model VARCHAR(100) NOT NULL,
    context_data JSONB DEFAULT '{}',
    generated_files JSONB DEFAULT '{}', -- Files generated in this session
    file_structure JSONB DEFAULT '{}', -- Current file structure
    iterations_count INTEGER DEFAULT 0,
    total_tokens_used INTEGER DEFAULT 0,
    last_exported_at TIMESTAMPTZ, -- When files were last exported to project
    export_status VARCHAR(50) DEFAULT 'pending', -- pending, exported, failed
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Builder Messages Table
CREATE TABLE ai_builder_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES ai_builder_sessions(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- user, assistant, system
    content TEXT NOT NULL,
    files_attached JSONB DEFAULT '{}', -- Files attached to this message
    metadata JSONB DEFAULT '{}',
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Builder File Operations Table
CREATE TABLE ai_builder_file_operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES ai_builder_sessions(id) ON DELETE CASCADE,
    message_id UUID REFERENCES ai_builder_messages(id) ON DELETE CASCADE,
    operation_type VARCHAR(50) NOT NULL, -- create, update, delete, rename, move
    file_path TEXT NOT NULL,
    old_file_path TEXT, -- For rename/move operations
    file_content TEXT,
    content_diff TEXT, -- Diff for update operations
    operation_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bolt.DIY Integrations Table (Legacy support)
CREATE TABLE bolt_diy_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID, -- Will be linked after projects table is created
    ai_builder_session_id UUID REFERENCES ai_builder_sessions(id) ON DELETE CASCADE,
    bolt_project_id VARCHAR(255) NOT NULL,
    bolt_project_url TEXT,
    sync_status VARCHAR(50) DEFAULT 'pending', -- pending, synced, failed
    sync_direction VARCHAR(50) DEFAULT 'both', -- to_dashboard, to_bolt, both
    last_sync_at TIMESTAMPTZ,
    sync_conflicts JSONB DEFAULT '{}', -- Any sync conflicts
    configuration JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for AI Builder tables
CREATE INDEX idx_ai_builder_sessions_user_id ON ai_builder_sessions(user_id);
CREATE INDEX idx_ai_builder_sessions_status ON ai_builder_sessions(status);
CREATE INDEX idx_ai_builder_messages_session_id ON ai_builder_messages(session_id);
CREATE INDEX idx_ai_builder_file_operations_session_id ON ai_builder_file_operations(session_id);
CREATE INDEX idx_bolt_diy_integrations_user_id ON bolt_diy_integrations(user_id);

-- Add migration tracking
INSERT INTO schema_migrations (version, description) 
VALUES (3, 'Create AI Builder integration tables')
ON CONFLICT (version) DO NOTHING; 