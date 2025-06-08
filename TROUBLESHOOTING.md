# 🔧 WebduhVercel Troubleshooting Guide

## 🚨 Common Issues & Solutions

### **Installation & Setup Issues**

#### ❌ **Port Already in Use**

```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

```bash
# Find process using the port
netstat -ano | findstr :3000
# Kill the process (replace PID with actual process ID)
taskkill /F /PID <PID>

# Or use the setup script which handles this automatically
.\webduh-complete-setup.bat
```

#### ❌ **Node Modules Installation Fails**

```bash
npm ERR! code ENOENT
```

**Solution:**

```bash
# Clear all caches and reinstall
.\clear-and-setup.bat

# Or manually:
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### ❌ **Shared UI Package Not Found**

```bash
Cannot find module '@webduh/shared-ui'
```

**Solution:**

```bash
# Build the shared UI package first
cd packages/shared-ui
npm install
npm run build
cd ../..

# Install dependencies in dashboard
cd apps/dashboard
npm install
```

### **Development Issues**

#### ❌ **TypeScript Compilation Errors**

```bash
Type error: Cannot find module '@webduh/shared-ui' or its corresponding type declarations
```

**Solution:**

```bash
# Ensure shared UI is built and installed
cd packages/shared-ui && npm run build && cd ../..
cd apps/dashboard && npm install && cd ../..

# Check TypeScript configuration
npm run typecheck
```

#### ❌ **Bolt.DIY Integration Not Working**

```bash
Failed to connect to Bolt.DIY service
```

**Solution:**

1. **Check if Bolt.DIY is running:**

   ```bash
   curl http://localhost:5173
   ```

2. **Start Bolt.DIY manually:**

   ```bash
   cd apps/bolt-diy
   npm run dev
   ```

3. **Configure environment variables:**

   ```bash
   # Copy example environment file
   cp apps/bolt-diy/.env.example apps/bolt-diy/.env.local

   # Add your API keys
   OPENAI_API_KEY=your_key_here
   ANTHROPIC_API_KEY=your_key_here
   ```

#### ❌ **Dashboard Navigation Not Working**

```bash
Navigation component renders but links don't work
```

**Solution:**

1. **Check Next.js router:**

   ```tsx
   // Ensure proper import in layout
   import { SharedNavigation } from './lib/shared-navigation';
   ```

2. **Verify navigation config:**
   ```bash
   # Check if config is properly exported
   cd packages/shared-ui
   npm run typecheck
   ```

### **Service Connection Issues**

#### ❌ **API Service Not Responding**

```bash
Failed to fetch from http://localhost:3001
```

**Solution:**

1. **Check API service status:**

   ```bash
   cd apps/api
   npm run dev
   ```

2. **Verify environment variables:**

   ```bash
   # Check .env file exists
   ls apps/api/.env

   # Should contain:
   NODE_ENV=development
   PORT=3001
   DATABASE_URL=postgresql://...
   ```

#### ❌ **Database Connection Fails**

```bash
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**

1. **Install PostgreSQL:**

   ```bash
   # Windows (using chocolatey)
   choco install postgresql

   # macOS
   brew install postgresql

   # Ubuntu/Debian
   sudo apt install postgresql
   ```

2. **Start PostgreSQL service:**

   ```bash
   # Windows
   net start postgresql-x64-14

   # macOS
   brew services start postgresql

   # Linux
   sudo systemctl start postgresql
   ```

3. **Create database:**
   ```sql
   createdb webduh
   ```

### **Build & Deployment Issues**

#### ❌ **Next.js Build Fails**

```bash
Error: Build optimization failed
```

**Solution:**

```bash
# Clear Next.js cache
rm -rf apps/dashboard/.next

# Rebuild with fresh cache
cd apps/dashboard
npm run build
```

#### ❌ **Tailwind CSS Not Loading**

```bash
Styles not appearing correctly
```

**Solution:**

1. **Check Tailwind config:**

   ```js
   // tailwind.config.js should include shared UI
   content: [
     './src/**/*.{js,ts,jsx,tsx}',
     '../../packages/shared-ui/src/**/*.{js,ts,jsx,tsx}',
   ];
   ```

2. **Rebuild styles:**
   ```bash
   npm run build
   ```

### **Performance Issues**

#### ⚠️ **Slow Development Server**

```bash
Development server takes long to start
```

**Solution:**

1. **Optimize dependencies:**

   ```bash
   # Remove unused dependencies
   npm prune

   # Clear cache
   npm cache clean --force
   ```

2. **Use Turbo mode:**
   ```bash
   # Use Turbo for faster builds
   npm run dev --turbo
   ```

#### ⚠️ **High Memory Usage**

```bash
JavaScript heap out of memory
```

**Solution:**

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Windows PowerShell
$env:NODE_OPTIONS="--max-old-space-size=4096"
```

## 🔍 Debugging Tools

### **Service Health Check**

```bash
# Check all services at once
curl http://localhost:3000/api/health
curl http://localhost:3001/health
curl http://localhost:5173
```

### **Log Analysis**

```bash
# Dashboard logs
cd apps/dashboard && npm run dev 2>&1 | tee dashboard.log

# API logs
cd apps/api && npm run dev 2>&1 | tee api.log

# Bolt.DIY logs
cd apps/bolt-diy && npm run dev 2>&1 | tee bolt.log
```

### **Network Debugging**

```bash
# Check port usage
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001
netstat -tulpn | grep :5173

# Test connectivity
telnet localhost 3000
telnet localhost 3001
telnet localhost 5173
```

## 🛠️ Development Environment Setup

### **Recommended VS Code Extensions**

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "github.copilot",
    "ms-vscode.vscode-json"
  ]
}
```

### **Git Hooks Setup**

```bash
# Install pre-commit hooks
npm install -g husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint"
npx husky add .husky/pre-push "npm run typecheck"
```

## 📞 Getting Help

### **Self-Diagnosis Checklist**

- [ ] All services are running (Dashboard, API, Bolt.DIY)
- [ ] Environment variables are configured
- [ ] PostgreSQL is running and accessible
- [ ] Node.js version is 18+ (`node --version`)
- [ ] npm cache is clean (`npm cache clean --force`)
- [ ] All packages are installed (`npm install` in root and each app)
- [ ] Shared UI package is built (`cd packages/shared-ui && npm run build`)

### **Quick Fix Commands**

```bash
# Nuclear option: Clear everything and start fresh
.\webduh-complete-setup.bat

# Gentler restart
npm run clean
npm install
npm run build
npm run dev
```

### **Log Collection**

When reporting issues, please include:

1. **System info:** `node --version`, `npm --version`, OS version
2. **Error logs:** Complete error messages with stack traces
3. **Environment:** Development/production, browser version
4. **Steps to reproduce:** Exact commands that led to the issue

### **Support Channels**

- **GitHub Issues**: [Create an issue](https://github.com/your-org/webduhvercel/issues)
- **Documentation**: [Platform Setup Guide](WEBDUH_COMPLETE_PLATFORM_SETUP.md)
- **Community**: [GitHub Discussions](https://github.com/your-org/webduhvercel/discussions)

---

**💡 Pro Tip:** Always run `.\webduh-complete-setup.bat` first - it solves 90% of common issues!
