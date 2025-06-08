# 🏗️ WebduhVercel Enterprise Database Setup Guide

## 📋 Prerequisites

### PostgreSQL Installation

#### Windows

1. **Download PostgreSQL**: https://www.postgresql.org/download/windows/
2. **Install with pgAdmin** (recommended) or use Docker
3. **Add to PATH**: Add PostgreSQL bin directory to system PATH
   ```
   C:\Program Files\PostgreSQL\15\bin
   ```

#### macOS

```bash
# Using Homebrew (recommended)
brew install postgresql
brew services start postgresql

# Or using Docker
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Node.js Dependencies

```bash
# Install required packages
npm install pg

# Or if using yarn
yarn add pg
```

## 🚀 Quick Setup

### 1. Database Creation

#### Option A: Using psql (if PostgreSQL tools are in PATH)

```bash
# Windows PowerShell
$env:PGPASSWORD="postgres"
createdb -h localhost -p 5432 -U postgres webduhvercel

# Unix/Linux/macOS
export PGPASSWORD="postgres"
createdb -h localhost -p 5432 -U postgres webduhvercel
```

#### Option B: Using pgAdmin (Windows GUI)

1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click "Databases" → Create → Database
4. Name: `webduhvercel`
5. Click "Save"

#### Option C: Using SQL directly

```sql
-- Connect to PostgreSQL as superuser
psql -h localhost -p 5432 -U postgres

-- Create database
CREATE DATABASE webduhvercel;

-- Exit
\q
```

### 2. Test Connection

```bash
# Set environment variables (Windows PowerShell)
$env:DB_HOST="localhost"
$env:DB_PORT="5432"
$env:DB_NAME="webduhvercel"
$env:DB_USER="postgres"
$env:DB_PASSWORD="postgres"

# Test connection
node migrations/test-connection.js
```

### 3. Run Migrations

```bash
# Run all 12 enterprise migrations
node migrations/migrate.js
```

### 4. Load Seed Data (Optional)

```bash
# Load basic seed data
psql -h localhost -p 5432 -U postgres -d webduhvercel -f migrations/seed-data.sql

# Load enterprise seed data
psql -h localhost -p 5432 -U postgres -d webduhvercel -f migrations/seed-data-enterprise.sql
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=webduhvercel
DB_USER=postgres
DB_PASSWORD=postgres

# Optional: Connection Pool Settings
DB_POOL_MIN=2
DB_POOL_MAX=20
DB_POOL_IDLE_TIMEOUT=30000

# Optional: SSL Configuration (for production)
DB_SSL_MODE=prefer
DB_SSL_CERT_PATH=
DB_SSL_KEY_PATH=
DB_SSL_CA_PATH=
```

### Migration Runners

#### 1. Node.js Runner (Recommended)

```bash
node migrations/migrate.js
```

**Features:**

- Cross-platform compatibility
- Color-coded output
- Comprehensive error handling
- Migration status reporting

#### 2. PowerShell Runner (Windows)

```powershell
.\migrations\run-migrations.ps1 -DBHost localhost -DBName webduhvercel -DBUser postgres
```

**Features:**

- Native Windows integration
- Parameter-based configuration
- Secure password handling

#### 3. Bash Runner (Unix/Linux/macOS)

```bash
chmod +x migrations/run-migrations.sh
./migrations/run-migrations.sh
```

**Features:**

- POSIX compliance
- Environment variable support
- Shell script optimizations

## 🗄️ Database Schema Overview

### **12 Core Migrations**

1. **Extensions** - PostgreSQL UUID and trigram support
2. **Core Tables** - Users, teams, team members (3 tables)
3. **AI Builder** - AI Builder integration (4 tables)
4. **Projects** - Project management and files (7 tables)
5. **Deployments** - Deployment pipeline (5 tables)
6. **Analytics** - Performance monitoring (6 tables)
7. **Webhooks & Billing** - Basic billing system (8 tables)
8. **Triggers & Views** - Database optimization (8 views)
9. **🆕 Payment Processing** - Enterprise payments (12 tables)
10. **🆕 Edge Functions** - Serverless infrastructure (12 tables)
11. **🆕 Enterprise Security** - SSO and compliance (15 tables)
12. **🆕 Infrastructure** - Monitoring and queues (12 tables)

### **Total Schema Stats**

- **60+ Tables** with comprehensive relationships
- **400+ Columns** with proper data types
- **150+ Indexes** for query optimization
- **8 Views** for complex queries
- **20+ Triggers** for automation
- **100+ Constraints** for data integrity

## 💳 Payment Processing Features

### Supported Payment Providers

- **Stripe** - Primary payment processor
- **PayPal** - Digital wallet integration
- **Square** - Point of sale integration
- **Adyen** - Global payment platform

### Payment Features

- **Payment Intents** - Secure payment processing
- **Fraud Detection** - Configurable risk rules
- **Refunds & Disputes** - Complete dispute management
- **Multi-Currency** - Global payment support
- **Subscription Billing** - Recurring payments
- **Usage-Based Billing** - Metered billing
- **Payout Management** - Automated payouts

### Example Payment Integration

```javascript
// Create payment intent
const paymentIntent = await db.payment_intents.create({
  team_id: 'team-123',
  provider_id: 'stripe-provider',
  amount: 2900, // $29.00
  currency: 'USD',
  description: 'Monthly subscription',
});

// Process payment with Stripe
const stripeIntent = await stripe.paymentIntents.create({
  amount: 2900,
  currency: 'usd',
  metadata: { webduh_intent_id: paymentIntent.id },
});
```

## ⚡ Edge Functions & CDN

### Supported Runtimes

- **Node.js 20** - JavaScript/TypeScript
- **Deno 1.38** - Modern JavaScript runtime
- **Python 3.11** - Python edge functions
- **Go** - High-performance functions
- **Rust** - System-level performance

### Edge Features

- **Global Distribution** - Multi-region deployment
- **Auto-Scaling** - Dynamic resource allocation
- **Function Versioning** - Version control and rollback
- **A/B Testing** - Traffic splitting
- **Performance Monitoring** - Cold start tracking
- **CDN Integration** - Global content delivery

### Example Edge Function

```javascript
// Create edge function
const edgeFunction = await db.edge_functions.create({
  project_id: 'project-123',
  name: 'API Rate Limiter',
  runtime_id: 'nodejs20',
  source_code: `
    export default async function handler(request) {
      const ip = request.headers.get('x-forwarded-for');
      
      // Rate limiting logic
      if (await isRateLimited(ip)) {
        return new Response('Rate limited', { status: 429 });
      }
      
      return new Response('OK');
    }
  `,
  regions: ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
});
```

## 🔒 Enterprise Security & Compliance

### Authentication Methods

- **SAML 2.0** - Enterprise SSO
- **OpenID Connect** - Modern OAuth2
- **OAuth 2.0** - Third-party integration
- **LDAP/Active Directory** - Enterprise directories

### Security Features

- **Multi-Factor Authentication** - TOTP, SMS, hardware keys
- **API Key Management** - Scoped permissions
- **Role-Based Access Control** - Granular permissions
- **Security Audit Logs** - Comprehensive tracking
- **Data Classification** - 4-level sensitivity framework
- **Encryption Management** - Automated key rotation

### Compliance Frameworks

- **SOC 2 Type II** - Security controls
- **GDPR** - Data protection regulation
- **HIPAA** - Healthcare compliance
- **PCI DSS** - Payment card security

### Example SSO Setup

```javascript
// Configure SAML SSO
const authProvider = await db.auth_providers.create({
  team_id: 'team-123',
  name: 'Company SAML',
  provider_type: 'saml',
  sso_url: 'https://sso.company.com/saml/login',
  configuration: {
    entity_id: 'webduh-sso',
    certificate: '-----BEGIN CERTIFICATE-----...',
    auto_provision: true,
  },
  domain_restrictions: ['company.com', 'subsidiary.com'],
});
```

## 🏗️ Infrastructure & Monitoring

### Background Processing

- **Job Queues** - Redis, SQS, RabbitMQ
- **Task Scheduling** - Cron-like scheduling
- **Worker Management** - Auto-scaling
- **Retry Logic** - Exponential backoff
- **Dead Letter Queues** - Failed job handling

### Storage Systems

- **AWS S3** - Primary object storage
- **Google Cloud Storage** - Multi-cloud support
- **Azure Blob Storage** - Enterprise integration
- **Cloudflare R2** - Edge storage

### Monitoring & Alerting

- **Health Checks** - HTTP, TCP, DNS checks
- **Metrics Collection** - Prometheus-compatible
- **Alert Rules** - Configurable thresholds
- **Log Aggregation** - Structured logging
- **Performance Monitoring** - Real-time metrics

### Example Background Job

```javascript
// Create background job
const job = await db.background_jobs.create({
  queue_id: 'deployments-queue',
  job_type: 'deployment_build',
  payload: {
    deployment_id: 'deploy-123',
    build_config: {
      framework: 'nextjs',
      node_version: '20',
    },
  },
  priority: 8,
  scheduled_at: new Date(),
});
```

## 🚨 Troubleshooting

### Common Issues

#### PostgreSQL Connection Issues

```bash
# Check if PostgreSQL is running
# Windows
Get-Service postgresql*

# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql
```

#### Permission Issues

```sql
-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE webduhvercel TO postgres;
GRANT ALL ON SCHEMA public TO postgres;
```

#### Migration Failures

```bash
# Check migration status
psql -h localhost -p 5432 -U postgres -d webduhvercel -c "SELECT * FROM schema_migrations ORDER BY version;"

# Reset specific migration
psql -h localhost -p 5432 -U postgres -d webduhvercel -c "DELETE FROM schema_migrations WHERE version = 9;"
```

#### Performance Issues

```sql
-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_tup_read DESC;
```

### Getting Help

#### Database Schema Documentation

```sql
-- List all tables
\dt

-- Describe table structure
\d table_name

-- Show relationships
SELECT
  tc.table_schema,
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_schema AS foreign_table_schema,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema='public';
```

#### Log Analysis

```bash
# View PostgreSQL logs (adjust path as needed)
# Windows
type "C:\Program Files\PostgreSQL\15\data\log\postgresql-*.log"

# Unix/Linux
tail -f /var/log/postgresql/postgresql-*.log
```

#### Performance Monitoring

```sql
-- Check slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check connection stats
SELECT * FROM pg_stat_activity;
```

## 🎯 Production Deployment

### Security Checklist

- [ ] Change default passwords
- [ ] Enable SSL/TLS encryption
- [ ] Configure firewall rules
- [ ] Set up backup procedures
- [ ] Enable audit logging
- [ ] Configure monitoring alerts
- [ ] Review access permissions
- [ ] Implement key rotation

### Performance Optimization

- [ ] Configure connection pooling
- [ ] Set up read replicas
- [ ] Implement caching layers
- [ ] Monitor query performance
- [ ] Set up automated backups
- [ ] Configure resource limits
- [ ] Implement load balancing
- [ ] Set up health checks

### Monitoring Setup

- [ ] Configure health checks
- [ ] Set up alert rules
- [ ] Implement log aggregation
- [ ] Monitor key metrics
- [ ] Set up dashboards
- [ ] Configure notifications
- [ ] Test disaster recovery
- [ ] Document procedures

---

## 🎉 Congratulations!

Your WebduhVercel enterprise database system is now ready for production with:

✅ **Advanced Payment Processing** - Multi-provider support with fraud detection  
✅ **Edge Functions & CDN** - Global serverless infrastructure  
✅ **Enterprise Security** - SSO, compliance, and data governance  
✅ **Infrastructure Monitoring** - Real-time alerting and analytics  
✅ **Scalable Architecture** - Ready for millions of users

**🚀 You're now ready to compete with Vercel, Netlify, and other enterprise platforms!**
