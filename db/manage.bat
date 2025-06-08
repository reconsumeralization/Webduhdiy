@echo off
setlocal enabledelayedexpansion

REM WebduhVercel Database Management Script for Windows
REM Usage: db\manage.bat [command]

set DB_NAME=webduh
set DB_USER=postgres
set DB_HOST=localhost
set DB_PORT=5432

echo.
echo 🗄️  WebduhVercel Database Manager
echo =================================
echo.

if "%1"=="" goto show_help
if "%1"=="help" goto show_help
if "%1"=="status" goto show_status
if "%1"=="setup" goto setup_database
if "%1"=="create" goto create_database
if "%1"=="reset" goto reset_database
if "%1"=="backup" goto backup_database
if "%1"=="connect" goto connect_database

goto show_help

:check_postgresql
echo ℹ️  Checking PostgreSQL...
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is not installed or not in PATH
    exit /b 1
)

pg_isready -h %DB_HOST% -p %DB_PORT% -U %DB_USER% >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is not running or not accessible
    echo ℹ️  Start PostgreSQL service in Windows Services
    exit /b 1
)

echo ✅ PostgreSQL is running
goto :eof

:create_database
call :check_postgresql
if %errorlevel% neq 0 exit /b %errorlevel%

echo ℹ️  Creating database: %DB_NAME%
createdb -h %DB_HOST% -p %DB_PORT% -U %DB_USER% %DB_NAME% 2>nul
if %errorlevel% == 0 (
    echo ✅ Database %DB_NAME% created
) else (
    echo ⚠️  Database %DB_NAME% already exists or creation failed
)
goto :eof

:setup_database
call :check_postgresql
if %errorlevel% neq 0 exit /b %errorlevel%

call :create_database

echo ℹ️  Setting up database schema...
if not exist "db\setup.sql" (
    echo ❌ Setup script not found: db\setup.sql
    exit /b 1
)

psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f db\setup.sql
if %errorlevel% == 0 (
    echo ✅ Database schema setup completed
) else (
    echo ❌ Database setup failed
    exit /b 1
)
goto :eof

:reset_database
call :check_postgresql
if %errorlevel% neq 0 exit /b %errorlevel%

echo ⚠️  This will DROP and recreate the database. All data will be lost!
set /p confirm="Are you sure? (y/N): "
if /i not "%confirm%"=="y" (
    echo ℹ️  Operation cancelled
    goto :eof
)

echo ℹ️  Dropping database: %DB_NAME%
dropdb -h %DB_HOST% -p %DB_PORT% -U %DB_USER% %DB_NAME% --if-exists
echo ✅ Database dropped

call :create_database
call :setup_database
goto :eof

:backup_database
call :check_postgresql
if %errorlevel% neq 0 exit /b %errorlevel%

for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%%MM%%DD%_%HH%%Min%%Sec%"

set BACKUP_FILE=db\backups\webduh_backup_%timestamp%.sql

if not exist "db\backups" mkdir "db\backups"

echo ℹ️  Creating backup: %BACKUP_FILE%
pg_dump -h %DB_HOST% -p %DB_PORT% -U %DB_USER% %DB_NAME% > %BACKUP_FILE%
if %errorlevel% == 0 (
    echo ✅ Backup created: %BACKUP_FILE%
) else (
    echo ❌ Backup failed
)
goto :eof

:show_status
call :check_postgresql
if %errorlevel% neq 0 exit /b %errorlevel%

echo ℹ️  Database Status:
echo   Host: %DB_HOST%:%DB_PORT%
echo   Database: %DB_NAME%
echo   User: %DB_USER%
echo.

REM Check if database exists
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -lqt | findstr /C:"%DB_NAME%" >nul
if %errorlevel% == 0 (
    echo ✅ Database exists
    
    REM Show table count
    for /f %%i in ('psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"') do set TABLE_COUNT=%%i
    echo   Tables: !TABLE_COUNT!
    
    REM Show schema version
    psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -t -c "SELECT 1 FROM information_schema.tables WHERE table_name = 'schema_version';" | findstr "1" >nul
    if %errorlevel% == 0 (
        for /f %%i in ('psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -t -c "SELECT version FROM schema_version ORDER BY applied_at DESC LIMIT 1;"') do set SCHEMA_VERSION=%%i
        echo   Schema Version: !SCHEMA_VERSION!
    )
) else (
    echo ❌ Database does not exist
)
goto :eof

:connect_database
call :check_postgresql
if %errorlevel% neq 0 exit /b %errorlevel%

echo ℹ️  Connecting to database...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME%
goto :eof

:show_help
echo WebduhVercel Database Management
echo.
echo Usage: %0 [command]
echo.
echo Commands:
echo   create      - Create the database
echo   setup       - Setup database schema
echo   reset       - Drop and recreate database (destructive)
echo   backup      - Create database backup
echo   status      - Show database status
echo   connect     - Connect to database (psql)
echo   help        - Show this help message
echo.
echo Examples:
echo   %0 setup
echo   %0 backup
echo   %0 status
goto :eof 