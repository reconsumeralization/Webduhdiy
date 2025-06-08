@echo off
setlocal enabledelayedexpansion

echo ====================================================
echo 🚀 WebduhVercel - Complete Setup ^& Startup Script
echo ====================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available
    pause
    exit /b 1
)

echo ✅ npm detected: 
npm --version
echo.

echo 🧹 Phase 1: Clearing All Caches...
echo =====================================

REM Stop any running processes
echo Stopping existing Node.js processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.cmd 2>nul

REM Clear all node_modules directories
echo Removing node_modules directories...
for /d /r . %%d in (node_modules) do @if exist "%%d" rd /s /q "%%d" 2>nul

REM Clear package-lock files
echo Removing lock files...
del /s /q package-lock.json 2>nul
del /s /q pnpm-lock.yaml 2>nul
del /s /q yarn.lock 2>nul

REM Clear build directories
echo Clearing build directories...
rd /s /q apps\dashboard\.next 2>nul
rd /s /q apps\bolt-diy\build 2>nul
rd /s /q apps\bolt-diy\dist 2>nul
rd /s /q apps\api\dist 2>nul
rd /s /q packages\shared-ui\dist 2>nul
rd /s /q .turbo 2>nul

REM Clear npm cache
echo Clearing npm cache...
npm cache clean --force 2>nul

REM Clear system caches
echo Clearing system caches...
rd /s /q "%USERPROFILE%\.npm\_cacache" 2>nul
rd /s /q "%USERPROFILE%\.cache\turbo" 2>nul

echo ✅ Cache clearing complete!
echo.

echo 📦 Phase 2: Installing Dependencies...
echo ======================================

REM Install root dependencies
echo Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)
echo ✅ Root dependencies installed

REM Install shared UI dependencies
echo Installing shared UI dependencies...
cd packages\shared-ui
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install shared UI dependencies
    pause
    exit /b 1
)
cd ..\..
echo ✅ Shared UI dependencies installed

REM Build shared UI
echo Building shared UI package...
cd packages\shared-ui
call npm run build 2>nul
cd ..\..
echo ✅ Shared UI built

REM Install dashboard dependencies
echo Installing dashboard dependencies...
cd apps\dashboard
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dashboard dependencies
    pause
    exit /b 1
)
cd ..\..
echo ✅ Dashboard dependencies installed

REM Install API dependencies
echo Installing API dependencies...
cd apps\api
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install API dependencies
    pause
    exit /b 1
)
cd ..\..
echo ✅ API dependencies installed

REM Install Bolt.DIY dependencies
echo Installing Bolt.DIY dependencies...
cd apps\bolt-diy
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install Bolt.DIY dependencies
    pause
    exit /b 1
)
cd ..\..
echo ✅ Bolt.DIY dependencies installed

echo.

echo 🔧 Phase 3: Environment Setup...
echo =================================

REM Create .env files if they don't exist
echo Setting up environment files...

REM Dashboard .env
if not exist "apps\dashboard\.env.local" (
    echo # Dashboard Environment > apps\dashboard\.env.local
    echo NEXT_PUBLIC_API_URL=http://localhost:3001 >> apps\dashboard\.env.local
    echo NEXT_PUBLIC_BOLT_DIY_URL=http://localhost:5173 >> apps\dashboard\.env.local
    echo NODE_ENV=development >> apps\dashboard\.env.local
    echo ✅ Dashboard .env.local created
)

REM API .env
if not exist "apps\api\.env" (
    echo # API Environment > apps\api\.env
    echo NODE_ENV=development >> apps\api\.env
    echo PORT=3001 >> apps\api\.env
    echo DATABASE_URL=postgresql://postgres:password@localhost:5432/webduh >> apps\api\.env
    echo JWT_SECRET=your_jwt_secret_here >> apps\api\.env
    echo ✅ API .env created
)

REM Bolt.DIY .env
if not exist "apps\bolt-diy\.env.local" (
    copy "apps\bolt-diy\.env.example" "apps\bolt-diy\.env.local" >nul
    echo ✅ Bolt.DIY .env.local created from example
)

echo.

echo 🚀 Phase 4: Starting All Services...
echo =====================================

echo Starting all WebduhVercel services...
echo.

REM Function to check if a port is in use
:check_port
netstat -an | find ":%1 " | find "LISTENING" >nul
if %errorlevel% == 0 (
    echo ⚠️  Port %1 is already in use
    exit /b 1
) else (
    exit /b 0
)

REM Start API Service (Port 3001)
echo 📦 Starting API Service on port 3001...
call :check_port 3001
if %errorlevel% == 0 (
    cd apps\api
    start "WebduhVercel API" cmd /k "npm run dev"
    cd ..\..
    echo ✅ API Service started successfully
) else (
    echo ❌ Cannot start API Service - port 3001 is in use
)

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start Dashboard (Port 3000)
echo 📦 Starting Dashboard on port 3000...
call :check_port 3000
if %errorlevel% == 0 (
    cd apps\dashboard
    start "WebduhVercel Dashboard" cmd /k "npm run dev"
    cd ..\..
    echo ✅ Dashboard started successfully
) else (
    echo ❌ Cannot start Dashboard - port 3000 is in use
)

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start Bolt.DIY (Port 5173)
echo 📦 Starting Bolt.DIY on port 5173...
call :check_port 5173
if %errorlevel% == 0 (
    cd apps\bolt-diy
    start "Bolt.DIY" cmd /k "npm run dev"
    cd ..\..
    echo ✅ Bolt.DIY started successfully
) else (
    echo ❌ Cannot start Bolt.DIY - port 5173 is in use
)

echo.
echo ====================================================
echo 🎉 WebduhVercel Platform Setup Complete!
echo ====================================================
echo.
echo 📊 Service URLs:
echo    Dashboard:     http://localhost:3000
echo    API:           http://localhost:3001
echo    Bolt.DIY:      http://localhost:5173
echo    AI Builder:    http://localhost:3000/ai-builder
echo    Status Page:   http://localhost:3000/status
echo.
echo 💡 Next Steps:
echo    1. Configure API keys in apps\bolt-diy\.env.local
echo    2. Set up PostgreSQL database
echo    3. Visit http://localhost:3000 to get started
echo.
echo 🔗 Features Available:
echo    ✅ System-wide shared navigation
echo    ✅ Bolt.DIY integration
echo    ✅ AI Builder with multi-LLM support
echo    ✅ Real-time service monitoring
echo    ✅ Project deployment system
echo    ✅ Analytics and status monitoring
echo.
echo 📚 Documentation:
echo    - Platform overview: README.md
echo    - Bolt.DIY integration: BOLT_DIY_INTEGRATION_COMPLETE.md
echo    - Service status: http://localhost:3000/status
echo.
echo Press any key to open the dashboard...
pause >nul
start http://localhost:3000 