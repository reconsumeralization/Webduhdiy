#!/bin/bash

# WebduhVercel Docker Stop Script
# Gracefully stops all services and cleans up resources

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${BLUE}🛑 Stopping WebduhVercel Platform${NC}"
    echo -e "${BLUE}===================================${NC}\n"
}

print_step() {
    echo -e "${BLUE}🔧 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Stop services gracefully
stop_services() {
    print_step "Stopping WebduhVercel services..."
    
    # Stop all services
    docker-compose down
    
    print_success "All services stopped"
}

# Clean up resources (optional)
cleanup_resources() {
    local cleanup_type=${1:-""}
    
    if [ "$cleanup_type" = "volumes" ]; then
        print_step "Removing volumes (this will delete all data)..."
        docker-compose down -v
        print_warning "All data volumes removed"
    elif [ "$cleanup_type" = "images" ]; then
        print_step "Removing built images..."
        docker-compose down --rmi all
        print_success "All images removed"
    elif [ "$cleanup_type" = "all" ]; then
        print_step "Removing everything (containers, networks, volumes, images)..."
        docker-compose down -v --rmi all --remove-orphans
        print_warning "Everything removed"
    fi
}

# Show remaining containers
show_status() {
    print_step "Checking remaining containers..."
    
    local containers=$(docker ps -a --filter "name=webduh" --format "table {{.Names}}\t{{.Status}}")
    
    if [ -n "$containers" ] && [ "$containers" != "NAMES	STATUS" ]; then
        echo "$containers"
    else
        print_success "No WebduhVercel containers running"
    fi
}

# Main script
main() {
    print_header
    
    # Parse command line arguments
    local cleanup=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --clean-volumes)
                cleanup="volumes"
                shift
                ;;
            --clean-images)
                cleanup="images"
                shift
                ;;
            --clean-all)
                cleanup="all"
                shift
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --clean-volumes    Remove data volumes (deletes all data)"
                echo "  --clean-images     Remove built Docker images"
                echo "  --clean-all        Remove everything (containers, volumes, images)"
                echo "  --help             Show this help message"
                echo ""
                echo "Examples:"
                echo "  $0                 # Stop services only"
                echo "  $0 --clean-all     # Stop and remove everything"
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
    
    # Confirm destructive operations
    if [ -n "$cleanup" ]; then
        echo -e "${YELLOW}⚠️  This will remove Docker resources. Are you sure?${NC}"
        read -p "Type 'yes' to continue: " -r
        if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            echo "Cancelled."
            exit 0
        fi
    fi
    
    stop_services
    
    if [ -n "$cleanup" ]; then
        cleanup_resources "$cleanup"
    fi
    
    show_status
    
    echo -e "\n${GREEN}🎉 WebduhVercel platform stopped successfully!${NC}"
    echo -e "${BLUE}💡 Use ./docker-start.sh to start again${NC}"
}

main "$@" 