@echo off
setlocal enabledelayedexpansion

echo ⚡ Starting Bolt.DIY AI Builder...

REM Check if port 5173 is available
echo.
echo 🔧 Checking port 5173...
netstat -an | find ":5173 " | find "LISTENING" >nul
if %errorlevel% == 0 (
    echo ✅ Bolt.DIY is already running on port 5173
    echo 🚀 Opening in browser...
    start http://localhost:5173
    pause
    exit /b 0
)

REM Start Bolt.DIY Service
echo.
echo 🔧 Starting Bolt.DIY Service on port 5173...
cd apps\bolt-diy

REM Create environment file if it doesn't exist
if not exist ".env.local" (
    if exist ".env.example" (
        copy ".env.example" ".env.local" >nul
    ) else (
        echo # Bolt.DIY Environment Variables > .env.local
        echo VITE_API_URL=http://localhost:3001 >> .env.local
        echo VITE_APP_NAME=WebduhVercel DIY Builder >> .env.local
    )
)

REM Start the service
start "Bolt.DIY AI Builder" cmd /k "npm run dev"
cd ..\..

echo ✅ Bolt.DIY Service started

REM Wait for service to initialize
echo.
echo 🔧 Waiting for Bolt.DIY to initialize...
timeout /t 8 /nobreak >nul

REM Health check
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Bolt.DIY is healthy and ready
) else (
    echo ⚠️ Bolt.DIY might still be starting...
)

echo.
echo 🎉 Bolt.DIY AI Builder Started Successfully!
echo.
echo ⚡ DIY Builder URL: http://localhost:5173
echo.
echo 🔧 Features Available:
echo    🤖 AI-Powered Code Generation
echo    📝 Interactive Development Environment
echo    🚀 Real-time Preview
echo    💾 Project Templates
echo    🔄 Hot Reload
echo.
echo ✨ Start building with AI assistance!
echo.
echo Press any key to open the DIY Builder...
pause >nul
start http://localhost:5173 