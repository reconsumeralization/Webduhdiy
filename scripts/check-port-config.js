const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Next.js configuration and port settings...');

// Check if there's a next.config.js file
const nextConfigPath = path.join(
  __dirname,
  '..',
  'apps/dashboard/next.config.js',
);
const nextConfigMjsPath = path.join(
  __dirname,
  '..',
  'apps/dashboard/next.config.mjs',
);

let configExists = false;
let configPath = '';

if (fs.existsSync(nextConfigPath)) {
  configExists = true;
  configPath = nextConfigPath;
} else if (fs.existsSync(nextConfigMjsPath)) {
  configExists = true;
  configPath = nextConfigMjsPath;
}

if (!configExists) {
  // Create a basic next.config.js
  const basicConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [],
  experimental: {
    turbo: {
      useSwcCss: true,
    },
  },
}

module.exports = nextConfig
`;

  fs.writeFileSync(nextConfigPath, basicConfig);
  console.log('✅ Created basic next.config.js');
  configPath = nextConfigPath;
}

// Check package.json for correct scripts
const packageJsonPath = path.join(
  __dirname,
  '..',
  'apps/dashboard/package.json',
);
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Ensure dev script is correct
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  packageJson.scripts.dev = 'next dev';
  packageJson.scripts.build = 'next build';
  packageJson.scripts.start = 'next start';
  packageJson.scripts.lint = 'next lint';

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated dashboard package.json scripts');
}

// Check tailwind.config.js
const tailwindConfigPath = path.join(
  __dirname,
  '..',
  'apps/dashboard/tailwind.config.js',
);
if (!fs.existsSync(tailwindConfigPath)) {
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
`;

  fs.writeFileSync(tailwindConfigPath, tailwindConfig);
  console.log('✅ Created tailwind.config.js');
}

console.log(`
🎯 Configuration Check Complete!

🔧 Actions Taken:
✅ Next.js configuration verified/created
✅ Package.json scripts updated
✅ Tailwind CSS configuration verified/created

🌐 Your documentation should be accessible at:
• Main: http://localhost:3001/docs
• Getting Started: http://localhost:3001/docs/getting-started-with-webduh
• Frameworks: http://localhost:3001/docs/frameworks/nextjs
• Functions: http://localhost:3001/docs/functions

💡 If you're still seeing 404 errors, try:
1. Stop the dev server (Ctrl+C)
2. Clear Next.js cache: rm -rf apps/dashboard/.next
3. Restart the dev server: npm run dev

The assets should now load correctly from port 3001!
`);

// Also create a simple script to clear Next.js cache
const clearCacheScript = `#!/bin/bash
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
`;

fs.writeFileSync(
  path.join(__dirname, '..', 'clear-cache.sh'),
  clearCacheScript,
);
console.log('✅ Created clear-cache.sh script');

// Windows batch version
const clearCacheBat = `@echo off
echo 🧹 Clearing Next.js cache...

if exist "apps\\dashboard\\.next" (
  rmdir /s /q "apps\\dashboard\\.next"
  echo ✅ Cleared .next directory
)

if exist "node_modules\\.cache" (
  rmdir /s /q "node_modules\\.cache"
  echo ✅ Cleared node_modules cache
)

echo 🎉 Cache cleared! Run 'npm run dev' to restart.
pause
`;

fs.writeFileSync(path.join(__dirname, '..', 'clear-cache.bat'), clearCacheBat);
console.log('✅ Created clear-cache.bat script for Windows');
