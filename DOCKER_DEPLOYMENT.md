# 🐳 WebduhVercel Docker Deployment Guide

Complete containerization setup for the WebduhVercel platform - The Ultimate v0.dev Competitor with Bolt.DIY Integration.

## 🚀 Quick Start

### Prerequisites

- **Docker Desktop** (for Windows/Mac) or **Docker Engine** (for Linux)
- **Docker Compose** v2.0+
- **4GB+ RAM** available for containers
- **10GB+ Disk Space** for images and volumes

### 1-Command Deployment

```bash
# Clone and start the platform
git clone https://github.com/webduh/webduhvercel.git
cd webduhvercel
./docker-start.sh
```

**Windows:**

```cmd
git clone https://github.com/webduh/webduhvercel.git
cd webduhvercel
docker-start.bat
```

## 📋 Service Architecture

| Service        | Port | Description      | Health Check                 |
| -------------- | ---- | ---------------- | ---------------------------- |
| **Dashboard**  | 3000 | Next.js Frontend | http://localhost:3000        |
| **API**        | 3001 | Node.js Backend  | http://localhost:3001/health |
| **Bolt.DIY**   | 5173 | AI Builder       | http://localhost:5173        |
| **PostgreSQL** | 5432 | Database         | Internal                     |
| **Redis**      | 6379 | Cache/Sessions   | Internal                     |

## 🛠️ Configuration

### Environment Setup

1. **Copy environment template:**

   ```bash
   cp env.docker.example .env
   ```

2. **Add your AI provider API keys:**

   ```env
   # Required for Bolt.DIY functionality
   OPENAI_API_KEY=sk-your_openai_key_here
   ANTHROPIC_API_KEY=sk-ant-your_anthropic_key_here
   GROQ_API_KEY=gsk_your_groq_key_here
   ```

3. **Production overrides (optional):**
   ```env
   POSTGRES_PASSWORD=your_secure_password
   JWT_SECRET=your_32_character_jwt_secret_here
   ```

### AI Provider Setup

WebduhVercel supports multiple AI providers through Bolt.DIY:

| Provider      | Required | Models         | Setup                              |
| ------------- | -------- | -------------- | ---------------------------------- |
| **OpenAI**    | ✅       | GPT-4, GPT-3.5 | Add `OPENAI_API_KEY`               |
| **Anthropic** | ✅       | Claude 3.5     | Add `ANTHROPIC_API_KEY`            |
| **Groq**      | ⚡       | Llama, Mixtral | Add `GROQ_API_KEY`                 |
| **Google**    | 🧪       | Gemini Pro     | Add `GOOGLE_GENERATIVE_AI_API_KEY` |
| **Ollama**    | 🔧       | Local Models   | Set `OLLAMA_API_BASE_URL`          |

## 🚀 Deployment Options

### Development Mode

```bash
# Start core services only
./docker-start.sh

# Access services:
# Dashboard: http://localhost:3000
# API: http://localhost:3001
# Bolt.DIY: http://localhost:5173
```

### Production Mode

```bash
# Start with Nginx reverse proxy
./docker-start.sh --production

# Includes:
# - SSL termination
# - Load balancing
# - Security headers
# - Gzip compression
```

### Monitoring Mode

```bash
# Start with observability stack
./docker-start.sh --monitoring

# Additional services:
# - Prometheus: http://localhost:9090
# - Grafana: http://localhost:3001 (admin/webduh_admin_2024)
```

## 🔧 Management Commands

### Service Control

```bash
# Start all services
./docker-start.sh

# Stop all services
./docker-stop.sh

# View logs
docker-compose logs -f

# Check service status
docker-compose ps

# Restart a specific service
docker-compose restart api
```

### Database Management

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U webduh -d webduh

# Create database backup
docker-compose exec postgres pg_dump -U webduh webduh > backup.sql

# Restore from backup
docker-compose exec -T postgres psql -U webduh -d webduh < backup.sql

# Reset database (WARNING: destructive)
docker-compose down -v postgres
docker-compose up -d postgres
```

### Cache Management

```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Clear cache
docker-compose exec redis redis-cli FLUSHALL

# Monitor Redis
docker-compose exec redis redis-cli MONITOR
```

## 📊 Monitoring & Debugging

### Service Health

```bash
# Check all services
docker-compose ps

# View service logs
docker-compose logs -f [service_name]

# Execute commands in containers
docker-compose exec api bash
docker-compose exec dashboard sh
```

### Performance Monitoring

```bash
# Container resource usage
docker stats

# System metrics
docker system df
docker system events

# Network inspection
docker network ls
docker network inspect webduhvercel_webduh-network
```

### Troubleshooting

#### Common Issues

**1. Port Conflicts**

```bash
# Check what's using a port
netstat -tulpn | grep :3000

# Kill process using port
sudo kill -9 $(lsof -t -i:3000)
```

**2. Memory Issues**

```bash
# Check Docker memory usage
docker system df

# Prune unused resources
docker system prune -a
```

**3. Build Failures**

```bash
# Clean build cache
docker builder prune -a

# Rebuild specific service
docker-compose build --no-cache api
```

**4. Database Connection Issues**

```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres pg_isready -U webduh
```

## 🔐 Security Considerations

### Production Checklist

- [ ] Change default passwords in `.env`
- [ ] Set strong `JWT_SECRET` (32+ characters)
- [ ] Configure SSL certificates
- [ ] Enable firewall rules
- [ ] Set up backup strategy
- [ ] Configure log rotation
- [ ] Enable container security scanning

### Environment Security

```bash
# Secure environment file
chmod 600 .env

# Use Docker secrets (production)
echo "my_secret" | docker secret create jwt_secret -
```

### Network Security

```bash
# Use custom networks
docker network create --driver bridge webduh-secure

# Isolate services
docker-compose --project-name webduh-prod up -d
```

## 📦 Volume Management

### Data Persistence

| Volume          | Purpose          | Backup Required |
| --------------- | ---------------- | --------------- |
| `postgres-data` | Database         | ✅ Critical     |
| `redis-data`    | Cache/Sessions   | ⚠️ Optional     |
| `bolt-projects` | User Projects    | ✅ Critical     |
| `api-logs`      | Application Logs | 📋 Monitoring   |

### Backup Strategy

```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
docker-compose exec postgres pg_dump -U webduh webduh > "backup/db_${DATE}.sql"

# Volume backup
docker run --rm -v webduhvercel_postgres-data:/data -v $(pwd)/backup:/backup alpine tar czf /backup/postgres_${DATE}.tar.gz -C /data .
```

## 🚀 Scaling & Performance

### Horizontal Scaling

```yaml
# docker-compose.override.yml
services:
  api:
    deploy:
      replicas: 3

  dashboard:
    deploy:
      replicas: 2
```

### Load Balancing

```bash
# Enable Nginx load balancer
./docker-start.sh --production

# Custom load balancer configuration
cp nginx.example.conf nginx.conf
# Edit nginx.conf for your needs
```

### Resource Limits

```yaml
# Resource constraints
services:
  api:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/docker.yml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Deploy
        run: |
          ./docker-start.sh --production
```

### Docker Registry

```bash
# Build and push images
docker-compose build
docker-compose push

# Deploy from registry
docker-compose -f docker-compose.prod.yml up -d
```

## 🆘 Support & Resources

### Documentation Links

- [Docker Installation](https://docs.docker.com/get-docker/)
- [Docker Compose Guide](https://docs.docker.com/compose/)
- [WebduhVercel Documentation](./README.md)
- [Bolt.DIY Setup Guide](./apps/bolt-diy/README.md)

### Common Commands Reference

```bash
# Development
./docker-start.sh                    # Start development environment
docker-compose logs -f               # Follow all logs
docker-compose restart api           # Restart API service

# Production
./docker-start.sh --production       # Start with Nginx
./docker-stop.sh --clean-all        # Stop and remove everything

# Maintenance
docker system prune -a              # Clean unused resources
docker-compose pull                 # Update base images
docker-compose build --no-cache     # Rebuild from scratch
```

### Environment Variables Reference

| Variable            | Default        | Description                  |
| ------------------- | -------------- | ---------------------------- |
| `NODE_ENV`          | `production`   | Application environment      |
| `DATABASE_URL`      | Auto-generated | PostgreSQL connection string |
| `REDIS_URL`         | Auto-generated | Redis connection string      |
| `JWT_SECRET`        | Generated      | JWT signing secret           |
| `OPENAI_API_KEY`    | Required       | OpenAI API key               |
| `ANTHROPIC_API_KEY` | Required       | Anthropic API key            |

---

## 🎉 You're All Set!

Your WebduhVercel platform is now running in Docker containers. Access the dashboard at **http://localhost:3000** and start building amazing projects with AI assistance!

### Next Steps:

1. 🔑 Configure your AI provider API keys
2. 🏗️ Create your first project
3. 🤖 Try the AI Builder (Bolt.DIY)
4. 📊 Monitor your services
5. 🚀 Deploy to production

**Happy coding with WebduhVercel! 🚀**
