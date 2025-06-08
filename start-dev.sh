#!/bin/bash

# webduh Development Environment Startup Script
# Quickly start the full webduh platform for development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    print_status "Checking Docker..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Docker is running"
}

# Check if required files exist
check_files() {
    print_status "Checking required files..."
    
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found"
        exit 1
    fi
    
    if [ ! -f "apps/dashboard/package.json" ]; then
        print_error "Dashboard package.json not found"
        exit 1
    fi
    
    if [ ! -f "apps/api/package.json" ]; then
        print_error "API package.json not found"
        exit 1
    fi
    
    print_success "Required files found"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install dashboard dependencies
    print_status "Installing dashboard dependencies..."
    cd apps/dashboard
    npm install
    cd ../..
    
    # Install API dependencies
    print_status "Installing API dependencies..."
    cd apps/api
    npm install
    cd ../..
    
    print_success "Dependencies installed"
}

# Start infrastructure services
start_infrastructure() {
    print_status "Starting infrastructure services..."
    
    # Start PostgreSQL, Redis, MinIO, etc.
    docker-compose up -d postgres redis minio nginx
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check if services are healthy
    for service in postgres redis minio; do
        if docker-compose ps $service | grep -q "healthy\|Up"; then
            print_success "$service is ready"
        else
            print_warning "$service might not be ready yet"
        fi
    done
}

# Start development servers
start_dev_servers() {
    print_status "Starting development servers..."
    
    # Create .env file for API if it doesn't exist
    if [ ! -f "apps/api/.env" ]; then
        cat > apps/api/.env << EOF
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://webduh:webduh123@localhost:5432/webduh
REDIS_URL=redis://localhost:6379
WEBDUH_DOMAIN=localhost
DOCKER_HOST=unix:///var/run/docker.sock
JWT_SECRET=your-super-secret-jwt-key-change-in-production
EOF
        print_success "Created API .env file"
    fi
    
    # Create .env file for dashboard if it doesn't exist
    if [ ! -f "apps/dashboard/.env.local" ]; then
        cat > apps/dashboard/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NODE_ENV=development
EOF
        print_success "Created dashboard .env file"
    fi
    
    # Start API server in background
    print_status "Starting API server on port 3001..."
    cd apps/api
    npm run dev &
    API_PID=$!
    cd ../..
    
    # Wait a moment for API to start
    sleep 3
    
    # Start dashboard server in background
    print_status "Starting dashboard on port 3000..."
    cd apps/dashboard
    npm run dev &
    DASHBOARD_PID=$!
    cd ../..
    
    # Store PIDs for cleanup
    echo $API_PID > .api.pid
    echo $DASHBOARD_PID > .dashboard.pid
    
    print_success "Development servers started"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Wait for PostgreSQL to be ready
    for i in {1..30}; do
        if docker-compose exec -T postgres pg_isready -U webduh &> /dev/null; then
            break
        fi
        sleep 1
    done
    
    # Run database migrations (this would be more sophisticated in a real setup)
    docker-compose exec -T postgres psql -U webduh -d webduh << EOF
-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    repository_url TEXT,
    framework VARCHAR(50),
    status VARCHAR(50) DEFAULT 'idle',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create deployments table
CREATE TABLE IF NOT EXISTS deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    status VARCHAR(50) DEFAULT 'pending',
    image_name TEXT,
    container_id TEXT,
    url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO projects (name, description, repository_url, framework, status) 
VALUES 
    ('My Next.js App', 'A sample Next.js application', 'https://github.com/vercel/next.js/tree/canary/examples/hello-world', 'nextjs', 'deployed'),
    ('React Portfolio', 'Personal portfolio website', 'https://github.com/example/react-portfolio', 'react', 'building'),
    ('Vue E-commerce', 'Online store built with Vue.js', 'https://github.com/example/vue-store', 'vue', 'deployed')
ON CONFLICT DO NOTHING;
EOF
    
    print_success "Database setup complete"
}

# Health check
health_check() {
    print_status "Performing health checks..."
    
    # Check API health
    for i in {1..30}; do
        if curl -s http://localhost:3001/health &> /dev/null; then
            print_success "API server is healthy"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "API server health check failed"
        fi
        sleep 1
    done
    
    # Check dashboard
    for i in {1..30}; do
        if curl -s http://localhost:3000 &> /dev/null; then
            print_success "Dashboard is healthy"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "Dashboard health check failed"
        fi
        sleep 1
    done
}

# Print startup information
print_startup_info() {
    echo ""
    echo "=========================================="
    echo "🚀 webduh Development Environment Ready!"
    echo "=========================================="
    echo ""
    echo "📱 Services:"
    echo "  Dashboard: http://localhost:3000"
    echo "  API: http://localhost:3001"
    echo "  API Health: http://localhost:3001/health"
    echo "  API Metrics: http://localhost:3001/metrics"
    echo ""
    echo "💾 Infrastructure:"
    echo "  PostgreSQL: localhost:5432 (webduh/webduh123)"
    echo "  Redis: localhost:6379"
    echo "  MinIO: http://localhost:9001 (minioadmin/minioadmin)"
    echo "  Nginx: http://localhost:80"
    echo ""
    echo "📁 Useful Commands:"
    echo "  ./stop-dev.sh - Stop all services"
    echo "  docker-compose logs -f - View all logs"
    echo "  docker-compose exec postgres psql -U webduh - Access database"
    echo ""
    echo "🔧 Development:"
    echo "  The API and dashboard will auto-reload on file changes"
    echo "  Check the logs in separate terminals if needed:"
    echo "    cd apps/api && npm run dev"
    echo "    cd apps/dashboard && npm run dev"
    echo ""
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
    
    # Kill development servers
    if [ -f .api.pid ]; then
        kill $(cat .api.pid) 2>/dev/null || true
        rm .api.pid
    fi
    
    if [ -f .dashboard.pid ]; then
        kill $(cat .dashboard.pid) 2>/dev/null || true
        rm .dashboard.pid
    fi
    
    print_success "Cleanup complete"
}

# Trap signals for cleanup
trap cleanup EXIT INT TERM

# Main function
main() {
    echo "🚀 Starting webduh development environment..."
    
    check_docker
    check_files
    install_dependencies
    start_infrastructure
    setup_database
    start_dev_servers
    health_check
    print_startup_info
    
    # Keep script running
    print_status "Press Ctrl+C to stop all services"
    while true; do
        sleep 1
    done
}

# Run main function
main "$@" 