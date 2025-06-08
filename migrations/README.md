# WebduhVercel Database Migrations

This directory contains all database migrations and setup scripts for the WebduhVercel platform. The migration system creates a comprehensive database schema with support for projects, AI Builder integration, deployments, analytics, and more.

## 🗂️ Migration Files

### Core Migrations

1. **001_create_extensions.sql** - PostgreSQL extensions (UUID, trigrams)
2. **002_create_core_tables.sql** - Users, teams, and team members
3. **003_create_ai_builder_tables.sql** - AI Builder sessions and integrations
4. **004_create_project_tables.sql** - Projects, files, templates, and sync
5. **005_create_deployment_tables.sql** - Deployments, domains, and DNS
6. **006_create_analytics_tables.sql** - Analytics, metrics, and monitoring
7. **007_create_webhooks_billing_tables.sql** - Webhooks, billing, and notifications
8. **008_create_triggers_views.sql** - Database triggers and useful views

### Additional Files

- **seed-data.sql** - Development and testing seed data
- **run-migrations.sh** - Unix/Linux migration runner
- **run-migrations.ps1** - Windows PowerShell migration runner
- **migrate.js** - Cross-platform Node.js migration runner

## 🚀 Quick Start

### Prerequisites

- PostgreSQL 12+ installed and running
- Database user with CREATE DATABASE permissions
- Node.js 16+ (for Node.js runner)

### Option 1: Node.js Runner (Recommended)

```bash
# Install dependencies (from project root)
npm install

# Set environment variables
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=webduhvercel
export DB_USER=postgres
export DB_PASSWORD=your_password

# Run migrations
node migrations/migrate.js
```

### Option 2: PowerShell (Windows)

```powershell
# Run migrations
.\migrations\run-migrations.ps1

# With custom parameters
.\migrations\run-migrations.ps1 -DBHost localhost -DBPort 5432 -DBName webduhvercel -DBUser postgres
```

### Option 3: Bash (Unix/Linux/WSL)

```bash
# Make executable
chmod +x migrations/run-migrations.sh

# Set environment variables
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=webduhvercel
export DB_USER=postgres
export PGPASSWORD=your_password

# Run migrations
./migrations/run-migrations.sh
```

## 🏗️ Database Schema Overview

### Core Tables

**Users & Teams**

- `users` - User accounts and profiles
- `teams` - Organization/team management
- `team_members` - User-team relationships with roles

**Projects & Files**

- `projects` - Project metadata and configuration
- `project_files` - File content and versioning
- `project_file_versions` - File version history
- `project_templates` - Reusable project templates

**AI Builder Integration**

- `ai_builder_sessions` - AI Builder chat sessions
- `ai_builder_messages` - Chat message history
- `ai_builder_file_operations` - File operation tracking
- `project_sync_history` - Sync between AI Builder and projects

**Deployments**

- `deployments` - Deployment records and status
- `deployment_checks` - Deployment validation checks
- `deployment_environments` - Environment configurations
- `domains` - Custom domain management
- `dns_records` - DNS record management

**Analytics & Monitoring**

- `analytics_events` - User interaction tracking
- `performance_metrics` - Performance monitoring
- `system_health_metrics` - System health tracking
- `user_activity_logs` - User action logging

**Webhooks & Billing**

- `webhooks` - Webhook configurations
- `webhook_deliveries` - Webhook delivery logs
- `billing_subscriptions` - Subscription management
- `usage_tracking` - Usage metrics for billing

### Key Features

**🔗 Relationships**

- Foreign key constraints ensure data integrity
- Cascade deletions for related data cleanup
- Proper indexing for query performance

**🔄 Triggers**

- Auto-updating `updated_at` timestamps
- Data validation and consistency checks

**📊 Views**

- `project_overview` - Project statistics and metadata
- `ai_builder_session_overview` - AI Builder session details
- `team_activity` - Team usage and activity metrics
- `deployment_status_summary` - Deployment success rates
- `user_activity_summary` - User engagement metrics

**🔍 Indexes**

- Performance indexes on frequently queried columns
- Composite indexes for complex queries
- Text search indexes for content discovery

## 🧪 Development Setup

### Running with Seed Data

To set up a development environment with sample data:

```bash
# Run migrations first
node migrations/migrate.js

# Then load seed data
psql -h localhost -p 5432 -U postgres -d webduhvercel -f migrations/seed-data.sql
```

### Seed Data Includes

- **3 test users** (admin, developer, designer)
- **3 sample teams** with different plans
- **3 sample projects** with files and deployments
- **AI Builder sessions** linked to projects
- **Project templates** for testing
- **Analytics data** for dashboard testing
- **Complete relationships** between all entities

### Test Users

| Email                | Username  | Role      | Password Hash |
| -------------------- | --------- | --------- | ------------- |
| admin@webduh.com     | admin     | Admin     | (placeholder) |
| developer@webduh.com | developer | Developer | (placeholder) |
| designer@webduh.com  | designer  | Designer  | (placeholder) |

_Note: Password hashes are placeholders. Update with real bcrypt hashes for testing._

## 🔧 Environment Variables

| Variable      | Default      | Description                   |
| ------------- | ------------ | ----------------------------- |
| `DB_HOST`     | localhost    | PostgreSQL host               |
| `DB_PORT`     | 5432         | PostgreSQL port               |
| `DB_NAME`     | webduhvercel | Database name                 |
| `DB_USER`     | postgres     | Database user                 |
| `DB_PASSWORD` |              | Database password             |
| `PGPASSWORD`  |              | Alternative password variable |

## 📋 Migration Status

Check migration status:

```sql
SELECT version, description, applied_at
FROM schema_migrations
ORDER BY version;
```

View database summary:

```sql
SELECT schemaname, tablename, tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

## 🔄 Adding New Migrations

1. **Create new migration file** with next sequential number:

   ```
   009_add_new_feature.sql
   ```

2. **Include migration tracking**:

   ```sql
   -- Your migration code here

   INSERT INTO schema_migrations (version, description)
   VALUES (9, 'Add new feature tables')
   ON CONFLICT (version) DO NOTHING;
   ```

3. **Test migration**:

   ```bash
   # Test on development database first
   node migrations/migrate.js
   ```

4. **Document changes** in this README

## 🛠️ Troubleshooting

### Common Issues

**Connection Refused**

```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Start PostgreSQL (varies by system)
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS
```

**Permission Denied**

```bash
# Ensure user has database creation permissions
psql -h localhost -p 5432 -U postgres -c "ALTER USER your_user CREATEDB;"
```

**Migration Fails**

```bash
# Check migration status
psql -h localhost -p 5432 -U postgres -d webduhvercel -c "SELECT * FROM schema_migrations;"

# Manually fix and retry specific migration
psql -h localhost -p 5432 -U postgres -d webduhvercel -f migrations/XXX_problem_migration.sql
```

### Reset Database

⚠️ **Warning: This will delete all data**

```bash
# Drop and recreate database
dropdb -h localhost -p 5432 -U postgres webduhvercel
createdb -h localhost -p 5432 -U postgres webduhvercel

# Run migrations again
node migrations/migrate.js
```

## 📈 Performance Considerations

### Indexes

The schema includes comprehensive indexing:

- Primary key indexes (automatic)
- Foreign key indexes for joins
- Query-specific indexes for performance
- Text search indexes for content

### Query Optimization

Use the provided views for common queries:

```sql
-- Instead of complex joins, use views
SELECT * FROM project_overview WHERE team_id = 'xxx';
SELECT * FROM ai_builder_session_overview WHERE user_id = 'xxx';
```

### Monitoring

Monitor database performance:

```sql
-- Check table sizes
SELECT schemaname, tablename, pg_total_relation_size(schemaname||'.'||tablename) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size DESC;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_tup_read DESC;
```

## 🔐 Security Notes

- **Environment Variables**: Never commit database passwords
- **Seed Data**: Contains placeholder password hashes
- **Production**: Use strong passwords and enable SSL
- **Access Control**: Follow principle of least privilege
- **Backups**: Implement regular backup strategy

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Design Best Practices](https://www.postgresql.org/docs/current/ddl.html)
- [Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)
- [WebduhVercel API Documentation](../API_DOCUMENTATION.md)

## 🤝 Contributing

When adding new migrations:

1. Follow the sequential numbering system
2. Include proper documentation
3. Add indexes for performance
4. Include rollback scripts if needed
5. Test thoroughly before committing
6. Update this README with changes

---

**🎉 Your WebduhVercel database is now ready for development!**
