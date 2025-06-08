#!/bin/bash

# WebduhVercel Database Management Script
# Usage: ./db/manage.sh [command]

set -e

DB_NAME="webduh"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${BLUE}🗄️  WebduhVercel Database Manager${NC}"
    echo -e "${BLUE}=================================${NC}\n"
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
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_postgresql() {
    if ! command -v psql &> /dev/null; then
        print_error "PostgreSQL is not installed or not in PATH"
        exit 1
    fi
    
    if ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER &> /dev/null; then
        print_error "PostgreSQL is not running or not accessible"
        print_info "Start PostgreSQL with:"
        print_info "  macOS: brew services start postgresql"
        print_info "  Ubuntu: sudo systemctl start postgresql"
        print_info "  Windows: Start PostgreSQL service"
        exit 1
    fi
    
    print_success "PostgreSQL is running"
}

create_database() {
    print_info "Creating database: $DB_NAME"
    
    if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
        print_warning "Database $DB_NAME already exists"
    else
        createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
        print_success "Database $DB_NAME created"
    fi
}

setup_database() {
    print_info "Setting up database schema..."
    
    if [ ! -f "db/setup.sql" ]; then
        print_error "Setup script not found: db/setup.sql"
        exit 1
    fi
    
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f db/setup.sql
    print_success "Database schema setup completed"
}

reset_database() {
    print_warning "This will DROP and recreate the database. All data will be lost!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Dropping database: $DB_NAME"
        dropdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME --if-exists
        print_success "Database dropped"
        
        create_database
        setup_database
    else
        print_info "Operation cancelled"
    fi
}

backup_database() {
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="db/backups/webduh_backup_$TIMESTAMP.sql"
    
    mkdir -p db/backups
    
    print_info "Creating backup: $BACKUP_FILE"
    pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME > $BACKUP_FILE
    print_success "Backup created: $BACKUP_FILE"
}

restore_database() {
    if [ -z "$2" ]; then
        print_error "Usage: ./db/manage.sh restore <backup_file>"
        exit 1
    fi
    
    BACKUP_FILE="$2"
    
    if [ ! -f "$BACKUP_FILE" ]; then
        print_error "Backup file not found: $BACKUP_FILE"
        exit 1
    fi
    
    print_warning "This will restore the database from backup. Current data will be lost!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Restoring database from: $BACKUP_FILE"
        dropdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME --if-exists
        createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
        psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $BACKUP_FILE
        print_success "Database restored successfully"
    else
        print_info "Operation cancelled"
    fi
}

run_migrations() {
    print_info "Running database migrations..."
    
    for migration in db/migrations/*.sql; do
        if [ -f "$migration" ]; then
            print_info "Running migration: $(basename $migration)"
            psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$migration"
        fi
    done
    
    print_success "All migrations completed"
}

show_status() {
    print_info "Database Status:"
    echo "  Host: $DB_HOST:$DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo ""
    
    # Check if database exists
    if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
        print_success "Database exists"
        
        # Show table count
        TABLE_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)
        echo "  Tables: $TABLE_COUNT"
        
        # Show schema version
        if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT 1 FROM information_schema.tables WHERE table_name = 'schema_version';" | grep -q 1; then
            SCHEMA_VERSION=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT version FROM schema_version ORDER BY applied_at DESC LIMIT 1;" | xargs)
            echo "  Schema Version: $SCHEMA_VERSION"
        fi
    else
        print_error "Database does not exist"
    fi
}

connect_database() {
    print_info "Connecting to database..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME
}

show_help() {
    echo "WebduhVercel Database Management"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  create      - Create the database"
    echo "  setup       - Setup database schema"
    echo "  reset       - Drop and recreate database (destructive)"
    echo "  backup      - Create database backup"
    echo "  restore     - Restore from backup file"
    echo "  migrate     - Run database migrations"
    echo "  status      - Show database status"
    echo "  connect     - Connect to database (psql)"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup"
    echo "  $0 backup"
    echo "  $0 restore db/backups/webduh_backup_20240206_120000.sql"
}

# Main script logic
print_header

case "${1:-help}" in
    "create")
        check_postgresql
        create_database
        ;;
    "setup")
        check_postgresql
        create_database
        setup_database
        ;;
    "reset")
        check_postgresql
        reset_database
        ;;
    "backup")
        check_postgresql
        backup_database
        ;;
    "restore")
        check_postgresql
        restore_database "$@"
        ;;
    "migrate")
        check_postgresql
        run_migrations
        ;;
    "status")
        check_postgresql
        show_status
        ;;
    "connect")
        check_postgresql
        connect_database
        ;;
    "help"|*)
        show_help
        ;;
esac 