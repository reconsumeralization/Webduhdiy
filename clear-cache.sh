#!/bin/bash
echo "🧹 Clearing Next.js cache..."

if [ -d "apps/dashboard/.next" ]; then
  rm -rf apps/dashboard/.next
  echo "✅ Cleared .next directory"
fi

if [ -d "node_modules/.cache" ]; then
  rm -rf node_modules/.cache  
  echo "✅ Cleared node_modules cache"
fi

echo "🎉 Cache cleared! Run 'npm run dev' to restart."
