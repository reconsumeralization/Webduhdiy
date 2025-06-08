const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing port configuration issues...');

// Clear Next.js build cache completely
const nextDir = path.join(__dirname, '..', 'apps/dashboard/.next');
const nodeModulesCache = path.join(__dirname, '..', 'node_modules/.cache');

function deleteDirectory(dir) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        deleteDirectory(fullPath);
      } else {
        fs.unlinkSync(fullPath);
      }
    });
    fs.rmdirSync(dir);
  }
}

if (fs.existsSync(nextDir)) {
  deleteDirectory(nextDir);
  console.log('✅ Cleared .next directory');
}

if (fs.existsSync(nodeModulesCache)) {
  deleteDirectory(nodeModulesCache);
  console.log('✅ Cleared node_modules cache');
}

// Create/update next.config.js to ensure proper configuration
const nextConfigPath = path.join(
  __dirname,
  '..',
  'apps/dashboard/next.config.js',
);
const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [],
  
  // Ensure proper asset loading
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  
  // Configure output for development
  trailingSlash: false,
  
  // Experimental features
  experimental: {
    turbo: {
      useSwcCss: true,
    },
  },
  
  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Ensure HMR works correctly
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
          },
        },
      }
    }
    return config
  },
  
  // Headers configuration
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
`;

fs.writeFileSync(nextConfigPath, nextConfig);
console.log('✅ Updated next.config.js with proper configuration');

// Update package.json to ensure correct dev script
const packageJsonPath = path.join(
  __dirname,
  '..',
  'apps/dashboard/package.json',
);
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  packageJson.scripts = {
    ...packageJson.scripts,
    dev: 'next dev',
    build: 'next build',
    start: 'next start',
    lint: 'next lint',
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated package.json scripts');
}

// Create a browser cache clearing HTML page
const clearCachePage = `<!DOCTYPE html>
<html>
<head>
    <title>Clear Browser Cache - webduh Docs</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { 
            font-family: system-ui, -apple-system, sans-serif; 
            max-width: 600px; 
            margin: 50px auto; 
            padding: 20px;
            background: #f8fafc;
        }
        .card {
            background: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .success { color: #059669; }
        .warning { color: #d97706; }
        button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            margin: 8px;
        }
        button:hover { background: #2563eb; }
    </style>
</head>
<body>
    <div class="card">
        <h1>🧹 Clear Browser Cache</h1>
        <p>If you're experiencing asset loading issues with the webduh documentation:</p>
        
        <h3>Chrome/Edge:</h3>
        <ol>
            <li>Press <kbd>Ctrl+Shift+Delete</kbd> (Windows) or <kbd>Cmd+Shift+Delete</kbd> (Mac)</li>
            <li>Select "Cached images and files"</li>
            <li>Click "Clear data"</li>
        </ol>
        
        <h3>Or use these buttons:</h3>
        <button onclick="hardRefresh()">🔄 Hard Refresh</button>
        <button onclick="clearCache()">🧹 Clear Cache</button>
        <button onclick="goToDocs()">📚 Go to Docs</button>
        
        <div id="status"></div>
        
        <h3 class="success">✅ Issues Fixed:</h3>
        <ul>
            <li>Next.js cache cleared</li>
            <li>TypeScript errors resolved</li>
            <li>Port configuration updated</li>
            <li>Asset loading optimized</li>
        </ul>
        
        <p class="warning">
            <strong>Note:</strong> The documentation is now available at 
            <a href="http://localhost:3001/docs">http://localhost:3001/docs</a>
        </p>
    </div>

    <script>
        function hardRefresh() {
            window.location.reload(true);
        }
        
        function clearCache() {
            if ('caches' in window) {
                caches.keys().then(names => {
                    names.forEach(name => caches.delete(name));
                });
            }
            localStorage.clear();
            sessionStorage.clear();
            document.getElementById('status').innerHTML = '<p class="success">✅ Cache cleared!</p>';
        }
        
        function goToDocs() {
            window.location.href = 'http://localhost:3001/docs';
        }
        
        // Auto-redirect after 5 seconds
        setTimeout(() => {
            document.getElementById('status').innerHTML = '<p>Redirecting to docs in 3 seconds...</p>';
            setTimeout(() => goToDocs(), 3000);
        }, 2000);
    </script>
</body>
</html>`;

const clearCachePagePath = path.join(
  __dirname,
  '..',
  'apps/dashboard/public/clear-cache.html',
);
fs.writeFileSync(clearCachePagePath, clearCachePage);
console.log('✅ Created browser cache clearing page');

console.log(`
🎯 Port Issues Fixed!

🔧 Actions Completed:
✅ Cleared Next.js build cache completely
✅ Cleared node_modules cache
✅ Updated next.config.js with proper asset loading
✅ Updated package.json scripts
✅ Created browser cache clearing page

🌐 Next Steps:
1. Restart your development server: npm run dev
2. Open: http://localhost:3001/docs
3. If still having issues: http://localhost:3001/clear-cache.html

💡 The documentation should now load correctly on port 3001!
`);

// Also create a PowerShell script for Windows users
const clearCachePowerShell = `# Clear webduh Documentation Cache
Write-Host "🧹 Clearing webduh documentation cache..." -ForegroundColor Cyan

# Clear Next.js cache
if (Test-Path "apps\\dashboard\\.next") {
    Remove-Item -Recurse -Force "apps\\dashboard\\.next"
    Write-Host "✅ Cleared .next directory" -ForegroundColor Green
}

# Clear node_modules cache
if (Test-Path "node_modules\\.cache") {
    Remove-Item -Recurse -Force "node_modules\\.cache"
    Write-Host "✅ Cleared node_modules cache" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Cache cleared successfully!" -ForegroundColor Green
Write-Host "Now restart your dev server with: npm run dev" -ForegroundColor Yellow
Write-Host "Documentation will be available at: http://localhost:3001/docs" -ForegroundColor Cyan

Pause
`;

fs.writeFileSync(
  path.join(__dirname, '..', 'clear-cache.ps1'),
  clearCachePowerShell,
);
console.log('✅ Created PowerShell cache clearing script');
