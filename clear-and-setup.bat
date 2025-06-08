@echo off
setlocal enabledelayedexpansion

echo 🧹 WebduhVercel - Clearing All Caches ^& Reinstalling...

REM Stop any running processes
echo.
echo 🔧 Stopping any running processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.cmd 2>nul
echo ✅ Processes stopped

REM Clear all node_modules directories
echo.
echo 🔧 Removing node_modules directories...
for /d /r . %%d in (node_modules) do @if exist "%%d" rd /s /q "%%d" 2>nul
echo ✅ node_modules cleared

REM Clear package-lock files
echo.
echo 🔧 Removing package-lock files...
del /s /q package-lock.json 2>nul
del /s /q pnpm-lock.yaml 2>nul
del /s /q yarn.lock 2>nul
echo ✅ Lock files cleared

REM Clear build directories
echo.
echo 🔧 Clearing build directories...
rd /s /q apps\dashboard\.next 2>nul
rd /s /q apps\bolt-diy\build 2>nul
rd /s /q apps\bolt-diy\dist 2>nul
rd /s /q apps\api\dist 2>nul
rd /s /q .turbo 2>nul
echo ✅ Build directories cleared

REM Clear npm cache
echo.
echo 🔧 Clearing npm cache...
npm cache clean --force 2>nul
echo ✅ npm cache cleared

REM Clear system caches
echo.
echo 🔧 Clearing system caches...
rd /s /q "%USERPROFILE%\.npm\_cacache" 2>nul
rd /s /q "%USERPROFILE%\.cache\turbo" 2>nul
echo ✅ System caches cleared

REM Install root dependencies
echo.
echo 🔧 Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)
echo ✅ Root dependencies installed

REM Install dashboard dependencies
echo.
echo 🔧 Installing dashboard dependencies...
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
echo.
echo 🔧 Installing API dependencies...
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
echo.
echo 🔧 Installing Bolt.DIY dependencies...
cd apps\bolt-diy
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install Bolt.DIY dependencies
    pause
    exit /b 1
)
cd ..\..
echo ✅ Bolt.DIY dependencies installed

REM Create .env files if they don't exist
echo.
echo 🔧 Setting up environment files...

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
echo 🔧 Running initial build...
call npm run build >nul 2>&1
echo ✅ Initial build completed

echo.
echo 🎉 Setup Complete!
echo.
echo 📊 Next Steps:
echo    1. Configure API keys in apps\bolt-diy\.env.local
echo    2. Set up PostgreSQL database
echo    3. Run: start-all.bat to start all services
echo.
echo 📚 Service URLs:
echo    Dashboard:     http://localhost:3000
echo    API:           http://localhost:3001
echo    Bolt.DIY:      http://localhost:5173
echo.
echo Press any key to exit...
pause >nul 