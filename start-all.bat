@echo off
setlocal enabledelayedexpansion

echo 🚀 Starting WebduhVercel Platform Services...

REM Stop any existing processes
echo.
echo 🔧 Stopping existing services...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.cmd 2>nul
echo ✅ Existing services stopped

REM Create logs directory
if not exist logs mkdir logs

REM Check if ports are available
echo.
echo 🔧 Checking required ports...
netstat -an | find ":3000 " | find "LISTENING" >nul
if %errorlevel% == 0 (
    echo ❌ Port 3000 is already in use
    pause
    exit /b 1
)

netstat -an | find ":3001 " | find "LISTENING" >nul
if %errorlevel% == 0 (
    echo ❌ Port 3001 is already in use
    pause
    exit /b 1
)

netstat -an | find ":5173 " | find "LISTENING" >nul
if %errorlevel% == 0 (
    echo ❌ Port 5173 is already in use
    pause
    exit /b 1
)
echo ✅ All required ports are available

REM Start API Service (Port 3001)
echo.
echo 🔧 Starting API Service on port 3001...
cd apps\api
if not exist ".env" (
    echo NODE_ENV=development > .env
    echo PORT=3001 >> .env
    echo DATABASE_URL=postgresql://postgres:password@localhost:5432/webduh >> .env
    echo JWT_SECRET=webduh_jwt_secret_key_2024 >> .env
)
start "WebduhVercel API" cmd /k "npm run dev"
cd ..\..
echo ✅ API Service started

REM Wait for API to start
timeout /t 3 /nobreak >nul

REM Start Bolt.DIY Service (Port 5173)
echo.
echo 🔧 Starting Bolt.DIY Service on port 5173...
cd apps\bolt-diy
if not exist ".env.local" (
    if exist ".env.example" (
        copy ".env.example" ".env.local" >nul
    ) else (
        echo # Bolt.DIY Environment > .env.local
    )
)
start "Bolt.DIY" cmd /k "npm run dev"
cd ..\..
echo ✅ Bolt.DIY Service started

REM Wait for Bolt.DIY to start
timeout /t 3 /nobreak >nul

REM Start Dashboard Service (Port 3000)
echo.
echo 🔧 Starting Dashboard Service on port 3000...
cd apps\dashboard
if not exist ".env.local" (
    echo NEXT_PUBLIC_API_URL=http://localhost:3001 > .env.local
    echo NEXT_PUBLIC_BOLT_DIY_URL=http://localhost:5173 >> .env.local
    echo NODE_ENV=development >> .env.local
)
start "WebduhVercel Dashboard" cmd /k "npm run dev"
cd ..\..
echo ✅ Dashboard Service started

REM Wait for services to initialize
echo.
echo 🔧 Waiting for services to initialize...
timeout /t 10 /nobreak >nul

REM Perform health checks
echo.
echo 🔧 Performing health checks...
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ API Service is healthy
) else (
    echo ⚠️ API Service health check failed
)

curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Bolt.DIY Service is healthy
) else (
    echo ⚠️ Bolt.DIY Service health check failed
)

curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Dashboard Service is healthy
) else (
    echo ⚠️ Dashboard Service health check failed
)

echo.
echo 🎉 WebduhVercel Platform Started Successfully!
echo.
echo 📊 Service URLs:
echo    🏠 Dashboard:     http://localhost:3000
echo    🔧 API:           http://localhost:3001
echo    ⚡ Bolt.DIY:      http://localhost:5173
echo    🤖 AI Builder:    http://localhost:3000/ai-builder
echo    📊 Status Page:   http://localhost:3000/status
echo.
echo 📝 Services are running in separate terminal windows
echo 🛑 Close the terminal windows to stop individual services
echo.
echo ✨ Happy coding with WebduhVercel!
echo.
echo Press any key to open the dashboard and DIY Builder...
pause >nul
start http://localhost:3000
timeout /t 2 /nobreak >nul
start http://localhost:5173 