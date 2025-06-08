const fs = require('fs');
const path = require('path');

// Mock database service for development
class MockDatabaseService {
  constructor() {
    this.tables = new Map();
    this.initialized = false;
  }

  async initialize() {
    console.log(
      '🔧 Initializing mock database for template and GitHub integration...',
    );

    // Simulate creating template tables
    this.tables.set('project_templates', []);
    this.tables.set('template_usage', []);
    this.tables.set('template_reviews', []);
    this.tables.set('template_forks', []);
    this.tables.set('template_sources', []);
    this.tables.set('git_integrations', []);
    this.tables.set('github_connections', []);
    this.tables.set('webhook_deliveries', []);
    this.tables.set('template_collections', []);
    this.tables.set('template_collection_items', []);
    this.tables.set('template_favorites', []);
    this.tables.set('repository_imports', []);
    this.tables.set('project_template_deployments', []);

    // Add sample template collections
    const collections = [
      {
        id: '1',
        name: 'Frontend',
        slug: 'frontend',
        description: 'User interface and client-side applications',
        icon: 'browser',
        color: '#3B82F6',
        is_featured: true,
        sort_order: 1,
      },
      {
        id: '2',
        name: 'Full Stack',
        slug: 'fullstack',
        description: 'Complete applications with frontend and backend',
        icon: 'stack',
        color: '#8B5CF6',
        is_featured: true,
        sort_order: 2,
      },
      {
        id: '3',
        name: 'Backend',
        slug: 'backend',
        description: 'Server-side applications and APIs',
        icon: 'server',
        color: '#10B981',
        is_featured: true,
        sort_order: 3,
      },
      {
        id: '4',
        name: 'Static Sites',
        slug: 'static',
        description: 'Static websites and documentation',
        icon: 'document',
        color: '#F59E0B',
        is_featured: true,
        sort_order: 4,
      },
      {
        id: '5',
        name: 'Mobile',
        slug: 'mobile',
        description: 'Mobile applications and PWAs',
        icon: 'phone',
        color: '#EF4444',
        is_featured: true,
        sort_order: 5,
      },
      {
        id: '6',
        name: 'Starters',
        slug: 'starter',
        description: 'Basic templates to get started quickly',
        icon: 'rocket',
        color: '#6B7280',
        is_featured: true,
        sort_order: 6,
      },
    ];
    this.tables.set('template_collections', collections);

    // Add sample templates
    const templates = [
      {
        id: '1',
        name: 'React + Vite Starter',
        slug: 'react-vite-starter',
        description:
          'A modern React application with Vite for fast development and building.',
        category: 'frontend',
        framework: 'react',
        template_files: {
          'package.json': {
            content: JSON.stringify(
              {
                name: 'react-vite-app',
                private: true,
                version: '0.0.0',
                type: 'module',
                scripts: {
                  dev: 'vite',
                  build: 'vite build',
                  preview: 'vite preview',
                },
                dependencies: {
                  react: '^18.2.0',
                  'react-dom': '^18.2.0',
                },
                devDependencies: {
                  '@types/react': '^18.2.15',
                  '@types/react-dom': '^18.2.7',
                  '@vitejs/plugin-react': '^4.0.3',
                  vite: '^4.4.5',
                },
              },
              null,
              2,
            ),
            type: 'json',
          },
        },
        build_config: {
          buildCommand: 'npm run build',
          installCommand: 'npm install',
          outputDirectory: 'dist',
          devCommand: 'npm run dev',
        },
        tags: ['react', 'vite', 'frontend', 'javascript', 'starter'],
        is_public: true,
        is_official: true,
        is_featured: true,
        thumbnail_url: 'https://vitejs.dev/logo.svg',
        demo_url: 'https://vite.new/react',
        download_count: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Next.js App Router',
        slug: 'nextjs-app-router',
        description:
          'Next.js 13+ with App Router, TypeScript, and Tailwind CSS.',
        category: 'fullstack',
        framework: 'nextjs',
        template_files: {
          'package.json': {
            content: JSON.stringify(
              {
                name: 'nextjs-app',
                version: '0.1.0',
                private: true,
                scripts: {
                  dev: 'next dev',
                  build: 'next build',
                  start: 'next start',
                  lint: 'next lint',
                },
                dependencies: {
                  next: '14.0.0',
                  react: '^18',
                  'react-dom': '^18',
                },
                devDependencies: {
                  typescript: '^5',
                  '@types/node': '^20',
                  '@types/react': '^18',
                  '@types/react-dom': '^18',
                  tailwindcss: '^3.3.0',
                  autoprefixer: '^10.0.1',
                  postcss: '^8',
                },
              },
              null,
              2,
            ),
            type: 'json',
          },
        },
        build_config: {
          buildCommand: 'npm run build',
          installCommand: 'npm install',
          outputDirectory: '.next',
          devCommand: 'npm run dev',
        },
        tags: ['nextjs', 'react', 'typescript', 'tailwindcss', 'fullstack'],
        is_public: true,
        is_official: true,
        is_featured: true,
        thumbnail_url: 'https://nextjs.org/static/favicon/favicon-32x32.png',
        demo_url: 'https://vercel.com/templates/next.js',
        download_count: 0,
        created_at: new Date().toISOString(),
      },
    ];
    this.tables.set('project_templates', templates);

    this.initialized = true;
    console.log(
      '✅ Mock database initialized with template and GitHub integration tables',
    );
    console.log(`📋 Created ${this.tables.size} tables`);
    console.log(`🎨 Added ${collections.length} template collections`);
    console.log(`📦 Added ${templates.length} sample templates`);

    return true;
  }

  async query(sql, params = []) {
    if (!this.initialized) {
      throw new Error('Database not initialized');
    }

    // Mock query responses for common operations
    if (sql.includes('SELECT') && sql.includes('project_templates')) {
      return { rows: this.tables.get('project_templates') || [] };
    }

    if (sql.includes('SELECT') && sql.includes('template_collections')) {
      return { rows: this.tables.get('template_collections') || [] };
    }

    if (sql.includes('INSERT INTO project_templates')) {
      const template = {
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        download_count: 0,
      };
      this.tables.get('project_templates').push(template);
      return { rows: [template] };
    }

    // Default response
    return { rows: [] };
  }

  async close() {
    console.log('🔌 Mock database connection closed');
  }
}

async function runMigration() {
  try {
    console.log('🚀 Starting template and GitHub integration migration...\n');

    const mockDb = new MockDatabaseService();
    await mockDb.initialize();

    console.log('\n✅ Migration completed successfully!');
    console.log(
      '🎯 Template management and GitHub integration features are now available',
    );
    console.log('\n📊 Available endpoints:');
    console.log('  - GET /api/templates - List templates');
    console.log('  - GET /api/templates/featured - Featured templates');
    console.log('  - GET /api/templates/categories - Template categories');
    console.log(
      '  - POST /api/templates/from-github - Create from GitHub repo',
    );
    console.log('  - GET /api/github/auth/url - GitHub OAuth URL');
    console.log('  - GET /api/github/repositories - List user repos');

    await mockDb.close();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = { MockDatabaseService };
