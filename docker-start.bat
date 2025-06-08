@echo off
setlocal enabledelayedexpansion

REM WebduhVercel Docker Startup Script for Windows
REM Starts the complete WebduhVercel platform using Docker Compose

echo.
echo 🐳 WebduhVercel Docker Platform
echo =================================
echo.

REM Check if Docker is installed and running
echo 🔧 Checking Docker installation...
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed or not in PATH
    echo ℹ️  Please install Docker Desktop from https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

echo ✅ Docker is installed and running

REM Check if Docker Compose is available
echo 🔧 Checking Docker Compose...
docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    docker-compose --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Docker Compose is not available
        pause
        exit /b 1
    )
    set COMPOSE_CMD=docker-compose
) else (
    set COMPOSE_CMD=docker compose
)

echo ✅ Docker Compose is available

REM Check environment file
echo 🔧 Checking environment configuration...
if not exist ".env" (
    echo ⚠️  .env file not found. Creating from example...
    if exist "env.docker.example" (
        copy "env.docker.example" ".env" >nul
        echo ℹ️  Please edit .env file and add your API keys
    ) else (
        echo ❌ env.docker.example not found
        pause
        exit /b 1
    )
)

echo ✅ Environment configuration ready

REM Build Docker images
echo 🔧 Building Docker images...

echo Building API service...
%COMPOSE_CMD% build api
if %errorlevel% neq 0 (
    echo ❌ Failed to build API service
    pause
    exit /b 1
)

echo Building Dashboard service...
%COMPOSE_CMD% build dashboard
if %errorlevel% neq 0 (
    echo ❌ Failed to build Dashboard service
    pause
    exit /b 1
)

echo Building Bolt.DIY service...
%COMPOSE_CMD% build bolt-diy
if %errorlevel% neq 0 (
    echo ❌ Failed to build Bolt.DIY service
    pause
    exit /b 1
)

echo ✅ All Docker images built successfully

REM Start services
echo 🔧 Starting WebduhVercel platform services...
%COMPOSE_CMD% up -d postgres redis api dashboard bolt-diy

if %errorlevel% neq 0 (
    echo ❌ Failed to start services
    pause
    exit /b 1
)

echo ✅ Services started successfully

REM Wait for services to be healthy
echo 🔧 Waiting for services to be healthy...
timeout /t 30 /nobreak >nul

REM Show service status
echo 🔧 Checking service status...
%COMPOSE_CMD% ps

echo.
echo 🎉 WebduhVercel Platform is ready!
echo.
echo 🌐 Service URLs:
echo    🏠 Dashboard:     http://localhost:3000
echo    🔧 API:           http://localhost:3001
echo    ⚡ Bolt.DIY:      http://localhost:5173
echo    🤖 AI Builder:    http://localhost:3000/ai-builder
echo    📊 Status:        http://localhost:3000/status
echo.
echo 🗄️  Database Services:
echo    🐘 PostgreSQL:    localhost:5432 (webduh/webduh_password_2024)
echo    🔴 Redis:         localhost:6379
echo.
echo 📝 Management Commands:
echo    🐳 View logs:     %COMPOSE_CMD% logs -f
echo    🛑 Stop platform: docker-stop.bat
echo    📊 Service status: %COMPOSE_CMD% ps
echo.
echo ✨ Happy coding with WebduhVercel!
echo.
echo Press any key to open the dashboard...
pause >nul
start http://localhost:3000 