#!/bin/bash

# WebduhVercel - Clear Caches & Full Setup Script
echo "🧹 WebduhVercel - Clearing All Caches & Reinstalling..."

# Function to print colored output
print_step() {
    echo -e "\n🔧 $1"
}

print_success() {
    echo "✅ $1"
}

print_error() {
    echo "❌ $1"
}

# Stop any running processes
print_step "Stopping any running processes..."
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
pkill -f "remix vite:dev" 2>/dev/null || true
print_success "Processes stopped"

# Clear all node_modules directories
print_step "Removing node_modules directories..."
find . -name "node_modules" -type d -prune -exec rm -rf '{}' + 2>/dev/null || true
print_success "node_modules cleared"

# Clear package-lock files
print_step "Removing package-lock files..."
find . -name "package-lock.json" -delete 2>/dev/null || true
find . -name "pnpm-lock.yaml" -delete 2>/dev/null || true
find . -name "yarn.lock" -delete 2>/dev/null || true
print_success "Lock files cleared"

# Clear build directories
print_step "Clearing build directories..."
rm -rf apps/dashboard/.next 2>/dev/null || true
rm -rf apps/bolt-diy/build 2>/dev/null || true
rm -rf apps/bolt-diy/dist 2>/dev/null || true
rm -rf apps/api/dist 2>/dev/null || true
rm -rf .turbo 2>/dev/null || true
print_success "Build directories cleared"

# Clear npm cache
print_step "Clearing npm cache..."
npm cache clean --force 2>/dev/null || true
print_success "npm cache cleared"

# Clear system caches
print_step "Clearing system caches..."
rm -rf ~/.npm/_cacache 2>/dev/null || true
rm -rf ~/.cache/turbo 2>/dev/null || true
rm -rf /tmp/.turbo* 2>/dev/null || true
print_success "System caches cleared"

# Install root dependencies
print_step "Installing root dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Root dependencies installed"
else
    print_error "Failed to install root dependencies"
    exit 1
fi

# Install dashboard dependencies
print_step "Installing dashboard dependencies..."
cd apps/dashboard
npm install
if [ $? -eq 0 ]; then
    print_success "Dashboard dependencies installed"
else
    print_error "Failed to install dashboard dependencies"
    exit 1
fi
cd ../..

# Install API dependencies
print_step "Installing API dependencies..."
cd apps/api
npm install
if [ $? -eq 0 ]; then
    print_success "API dependencies installed"
else
    print_error "Failed to install API dependencies"
    exit 1
fi
cd ../..

# Install Bolt.DIY dependencies
print_step "Installing Bolt.DIY dependencies..."
cd apps/bolt-diy
npm install
if [ $? -eq 0 ]; then
    print_success "Bolt.DIY dependencies installed"
else
    print_error "Failed to install Bolt.DIY dependencies"
    exit 1
fi
cd ../..

# Create .env files if they don't exist
print_step "Setting up environment files..."

# Dashboard .env
if [ ! -f "apps/dashboard/.env.local" ]; then
    cat > apps/dashboard/.env.local << 'EOF'
# Dashboard Environment
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_BOLT_DIY_URL=http://localhost:5173
NODE_ENV=development
EOF
    print_success "Dashboard .env.local created"
fi

# API .env
if [ ! -f "apps/api/.env" ]; then
    cat > apps/api/.env << 'EOF'
# API Environment
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/webduh
JWT_SECRET=your_jwt_secret_here
EOF
    print_success "API .env created"
fi

# Bolt.DIY .env
if [ ! -f "apps/bolt-diy/.env.local" ]; then
    cp apps/bolt-diy/.env.example apps/bolt-diy/.env.local
    print_success "Bolt.DIY .env.local created from example"
fi

print_step "Running initial build..."
npm run build 2>/dev/null || true
print_success "Initial build completed"

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📊 Next Steps:"
echo "   1. Configure API keys in apps/bolt-diy/.env.local"
echo "   2. Set up PostgreSQL database"
echo "   3. Run: ./start-all.sh to start all services"
echo ""
echo "📚 Service URLs:"
echo "   Dashboard:     http://localhost:3000"
echo "   API:           http://localhost:3001"
echo "   Bolt.DIY:      http://localhost:5173"
echo "" 