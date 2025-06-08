#!/bin/bash

# webduh Development Environment Stop Script

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

echo "🛑 Stopping webduh development environment..."

# Stop development servers
if [ -f .api.pid ]; then
    print_status "Stopping API server..."
    kill $(cat .api.pid) 2>/dev/null || print_warning "API server was not running"
    rm .api.pid
    print_success "API server stopped"
else
    print_warning "API server PID file not found"
fi

if [ -f .dashboard.pid ]; then
    print_status "Stopping dashboard server..."
    kill $(cat .dashboard.pid) 2>/dev/null || print_warning "Dashboard server was not running"
    rm .dashboard.pid
    print_success "Dashboard server stopped"
else
    print_warning "Dashboard server PID file not found"
fi

# Stop infrastructure services
print_status "Stopping infrastructure services..."
docker-compose down

print_success "All services stopped successfully"
echo "✅ webduh development environment has been stopped" 