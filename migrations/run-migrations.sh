#!/bin/bash

# WebduhVercel Database Migration Runner
# This script runs all database migrations in order

set -e

# Database configuration
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-webduhvercel}
DB_USER=${DB_USER:-postgres}

# Check if PostgreSQL is available
echo "🔌 Checking PostgreSQL connection..."
if ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME; then
    echo "❌ PostgreSQL is not available. Please ensure the database is running."
    exit 1
fi

echo "✅ PostgreSQL is available"

# Function to run a migration
run_migration() {
    local migration_file=$1
    local migration_name=$(basename "$migration_file" .sql)
    
    echo "🚀 Running migration: $migration_name"
    
    if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$migration_file" -q; then
        echo "✅ $migration_name completed successfully"
    else
        echo "❌ $migration_name failed"
        exit 1
    fi
}

# Create database if it doesn't exist
echo "📋 Creating database if it doesn't exist..."
createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME 2>/dev/null || true

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "📁 Migration directory: $SCRIPT_DIR"

# Run migrations in order
echo "🔄 Starting database migrations..."

# Check if any migrations exist
migration_files=("$SCRIPT_DIR"/*.sql)
if [ ! -e "${migration_files[0]}" ]; then
    echo "❌ No migration files found in $SCRIPT_DIR"
    exit 1
fi

# Sort migration files numerically
IFS=$'\n' sorted_migrations=($(sort -V <<<"${migration_files[*]}"))
unset IFS

# Run each migration
for migration_file in "${sorted_migrations[@]}"; do
    # Skip if it's not a .sql file or if it's this script
    if [[ ! "$migration_file" == *.sql ]] || [[ "$migration_file" == *"run-migrations"* ]]; then
        continue
    fi
    
    run_migration "$migration_file"
done

echo ""
echo "🎉 All migrations completed successfully!"
echo ""

# Show migration status
echo "📊 Migration status:"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
SELECT 
    version, 
    description, 
    applied_at 
FROM schema_migrations 
ORDER BY version;
" 2>/dev/null || echo "⚠️  Could not retrieve migration status"

echo ""
echo "🔍 Database summary:"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
" 2>/dev/null || echo "⚠️  Could not retrieve table summary"

echo ""
echo "✨ Database setup complete! Your WebduhVercel database is ready to use." 