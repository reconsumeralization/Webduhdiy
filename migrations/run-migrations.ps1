# WebduhVercel Database Migration Runner for Windows PowerShell
# This script runs all database migrations in order

param(
    [string]$DBHost = "localhost",
    [string]$DBPort = "5432", 
    [string]$DBName = "webduhvercel",
    [string]$DBUser = "postgres"
)

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "🔌 Checking PostgreSQL connection..." -ForegroundColor Cyan

# Check if psql is available
try {
    $null = Get-Command psql -ErrorAction Stop
} catch {
    Write-Host "❌ psql command not found. Please ensure PostgreSQL client tools are installed and in PATH." -ForegroundColor Red
    exit 1
}

# Test database connection
$env:PGPASSWORD = Read-Host "Enter PostgreSQL password" -AsSecureString
$env:PGPASSWORD = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($env:PGPASSWORD))

Write-Host "✅ PostgreSQL client available" -ForegroundColor Green

# Function to invoke a migration
function Invoke-Migration {
    param([string]$MigrationFile)
    
    $migrationName = [System.IO.Path]::GetFileNameWithoutExtension($MigrationFile)
    Write-Host "🚀 Running migration: $migrationName" -ForegroundColor Yellow
    
    try {
        psql -h $DBHost -p $DBPort -U $DBUser -d $DBName -f $MigrationFile -q
        Write-Host "✅ $migrationName completed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ $migrationName failed: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Create database if it doesn't exist
Write-Host "📋 Creating database if it doesn't exist..." -ForegroundColor Cyan
try {
    createdb -h $DBHost -p $DBPort -U $DBUser $DBName 2>$null
} catch {
    # Database might already exist, continue
}

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "📁 Migration directory: $scriptDir" -ForegroundColor Cyan

# Run migrations in order
Write-Host "🔄 Starting database migrations..." -ForegroundColor Cyan

# Get all .sql files and sort them
$migrationFiles = Get-ChildItem -Path $scriptDir -Filter "*.sql" | 
    Where-Object { $_.Name -notlike "*run-migrations*" } |
    Sort-Object { [int]($_.Name -replace '^(\d+).*', '$1') }

if ($migrationFiles.Count -eq 0) {
    Write-Host "❌ No migration files found in $scriptDir" -ForegroundColor Red
    exit 1
}

# Run each migration
foreach ($migrationFile in $migrationFiles) {
    Invoke-Migration -MigrationFile $migrationFile.FullName
}

Write-Host ""
Write-Host "🎉 All migrations completed successfully!" -ForegroundColor Green
Write-Host ""

# Show migration status
Write-Host "📊 Migration status:" -ForegroundColor Cyan
try {
    psql -h $DBHost -p $DBPort -U $DBUser -d $DBName -c @"
SELECT 
    version, 
    description, 
    applied_at 
FROM schema_migrations 
ORDER BY version;
"@
} catch {
    Write-Host "⚠️  Could not retrieve migration status" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔍 Database summary:" -ForegroundColor Cyan
try {
    psql -h $DBHost -p $DBPort -U $DBUser -d $DBName -c @"
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
"@
} catch {
    Write-Host "⚠️  Could not retrieve table summary" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✨ Database setup complete! Your WebduhVercel database is ready to use." -ForegroundColor Green 