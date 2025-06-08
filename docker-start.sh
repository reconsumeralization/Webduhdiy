#!/bin/bash

# WebduhVercel Docker Startup Script
# Starts the complete WebduhVercel platform using Docker Compose

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${BLUE}🐳 WebduhVercel Docker Platform${NC}"
    echo -e "${BLUE}=================================${NC}\n"
}

print_step() {
    echo -e "${BLUE}🔧 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

# Check if Docker and Docker Compose are installed
check_docker() {
    print_step "Checking Docker installation..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        print_info "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        print_info "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Docker is installed and running"
}

# Check environment file
check_env() {
    print_step "Checking environment configuration..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from example..."
        if [ -f "env.docker.example" ]; then
            cp env.docker.example .env
            print_info "Please edit .env file and add your API keys"
        else
            print_error "env.docker.example not found"
            exit 1
        fi
    fi
    
    print_success "Environment configuration ready"
}

# Build Docker images
build_images() {
    print_step "Building Docker images..."
    
    echo "Building API service..."
    docker-compose build api
    
    echo "Building Dashboard service..."
    docker-compose build dashboard
    
    echo "Building Bolt.DIY service..."
    docker-compose build bolt-diy
    
    print_success "All Docker images built successfully"
}

# Start services
start_services() {
    local profile=${1:-""}
    
    print_step "Starting WebduhVercel platform services..."
    
    if [ "$profile" = "monitoring" ]; then
        print_info "Starting with monitoring services..."
        docker-compose --profile monitoring up -d
    elif [ "$profile" = "production" ]; then
        print_info "Starting with production configuration..."
        docker-compose --profile production up -d
    else
        print_info "Starting core services..."
        docker-compose up -d postgres redis api dashboard bolt-diy
    fi
    
    print_success "Services started successfully"
}

# Wait for services to be healthy
wait_for_services() {
    print_step "Waiting for services to be healthy..."
    
    local services=("postgres" "redis" "api" "dashboard" "bolt-diy")
    local max_wait=120
    local elapsed=0
    
    for service in "${services[@]}"; do
        print_info "Checking $service health..."
        
        while [ $elapsed -lt $max_wait ]; do
            if docker-compose ps $service | grep -q "healthy\|Up"; then
                print_success "$service is healthy"
                break
            fi
            
            sleep 2
            elapsed=$((elapsed + 2))
            
            if [ $elapsed -ge $max_wait ]; then
                print_warning "$service health check timeout"
                break
            fi
        done
    done
}

# Show service URLs
show_urls() {
    print_step "WebduhVercel Platform is ready!"
    echo ""
    echo -e "${GREEN}🌐 Service URLs:${NC}"
    echo -e "   🏠 Dashboard:     ${BLUE}http://localhost:3000${NC}"
    echo -e "   🔧 API:           ${BLUE}http://localhost:3001${NC}"
    echo -e "   ⚡ Bolt.DIY:      ${BLUE}http://localhost:5173${NC}"
    echo -e "   🤖 AI Builder:    ${BLUE}http://localhost:3000/ai-builder${NC}"
    echo -e "   📊 Status:        ${BLUE}http://localhost:3000/status${NC}"
    echo ""
    echo -e "${GREEN}🗄️  Database Services:${NC}"
    echo -e "   🐘 PostgreSQL:    ${BLUE}localhost:5432${NC} (webduh/webduh_password_2024)"
    echo -e "   🔴 Redis:         ${BLUE}localhost:6379${NC}"
    echo ""
    echo -e "${GREEN}📝 Management:${NC}"
    echo -e "   🐳 Docker logs:   ${BLUE}docker-compose logs -f${NC}"
    echo -e "   🛑 Stop platform: ${BLUE}./docker-stop.sh${NC}"
    echo -e "   📊 Service status: ${BLUE}docker-compose ps${NC}"
    echo ""
}

# Main script
main() {
    print_header
    
    # Parse command line arguments
    local profile=""
    local build_only=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --monitoring)
                profile="monitoring"
                shift
                ;;
            --production)
                profile="production"
                shift
                ;;
            --build-only)
                build_only=true
                shift
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --monitoring    Start with monitoring services (Prometheus, Grafana)"
                echo "  --production    Start with production configuration (Nginx)"
                echo "  --build-only    Only build images, don't start services"
                echo "  --help          Show this help message"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    check_docker
    check_env
    build_images
    
    if [ "$build_only" = true ]; then
        print_success "Images built successfully. Use docker-compose up to start services."
        exit 0
    fi
    
    start_services "$profile"
    wait_for_services
    show_urls
    
    echo -e "${GREEN}🎉 WebduhVercel Platform is running!${NC}"
    echo -e "${BLUE}💡 Pro tip: Use 'docker-compose logs -f' to follow logs${NC}"
}

# Handle interrupts
trap 'echo -e "\n${YELLOW}🛑 Stopping services...${NC}"; docker-compose down; exit 0' INT TERM

main "$@" 