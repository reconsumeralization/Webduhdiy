@echo off
echo 🧹 Clearing Next.js cache...

if exist "apps\dashboard\.next" (
  rmdir /s /q "apps\dashboard\.next"
  echo ✅ Cleared .next directory
)

if exist "node_modules\.cache" (
  rmdir /s /q "node_modules\.cache"
  echo ✅ Cleared node_modules cache
)

echo 🎉 Cache cleared! Run 'npm run dev' to restart.
pause
