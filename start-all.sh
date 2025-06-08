#!/bin/bash

# WebduhVercel - Start All Services Script
echo "🚀 Starting WebduhVercel Platform Services..."

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

# Check if required ports are available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_error "Port $1 is already in use. Please stop the existing service."
        return 1
    fi
    return 0
}

# Kill any existing processes
print_step "Stopping existing services..."
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
pkill -f "remix vite:dev" 2>/dev/null || true
sleep 2
print_success "Existing services stopped"

# Check required ports
print_step "Checking required ports..."
check_port 3000 || exit 1  # Dashboard
check_port 3001 || exit 1  # API
check_port 5173 || exit 1  # Bolt.DIY
print_success "All required ports are available"

# Start API Service (Port 3001)
print_step "Starting API Service on port 3001..."
cd apps/api
if [ ! -f ".env" ]; then
    echo "NODE_ENV=development" > .env
    echo "PORT=3001" >> .env
    echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/webduh" >> .env
    echo "JWT_SECRET=webduh_jwt_secret_key_2024" >> .env
fi
npm run dev > ../../logs/api.log 2>&1 &
API_PID=$!
cd ../..
print_success "API Service started (PID: $API_PID)"

# Wait for API to start
sleep 3

# Start Bolt.DIY Service (Port 5173)
print_step "Starting Bolt.DIY Service on port 5173..."
cd apps/bolt-diy
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local 2>/dev/null || echo "# Bolt.DIY Environment" > .env.local
fi
npm run dev > ../../logs/bolt-diy.log 2>&1 &
BOLT_PID=$!
cd ../..
print_success "Bolt.DIY Service started (PID: $BOLT_PID)"

# Wait for Bolt.DIY to start
sleep 3

# Start Dashboard Service (Port 3000)
print_step "Starting Dashboard Service on port 3000..."
cd apps/dashboard
if [ ! -f ".env.local" ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
    echo "NEXT_PUBLIC_BOLT_DIY_URL=http://localhost:5173" >> .env.local
    echo "NODE_ENV=development" >> .env.local
fi
npm run dev > ../../logs/dashboard.log 2>&1 &
DASHBOARD_PID=$!
cd ../..
print_success "Dashboard Service started (PID: $DASHBOARD_PID)"

# Create logs directory if it doesn't exist
mkdir -p logs

# Save PIDs for cleanup
echo $API_PID > logs/api.pid
echo $BOLT_PID > logs/bolt-diy.pid
echo $DASHBOARD_PID > logs/dashboard.pid

# Wait for services to fully start
print_step "Waiting for services to initialize..."
sleep 10

# Health check function
health_check() {
    local url=$1
    local service=$2
    if curl -s "$url" > /dev/null 2>&1; then
        print_success "$service is healthy"
        return 0
    else
        print_error "$service health check failed"
        return 1
    fi
}

# Perform health checks
print_step "Performing health checks..."
health_check "http://localhost:3001/health" "API Service" || true
health_check "http://localhost:5173" "Bolt.DIY Service" || true
health_check "http://localhost:3000" "Dashboard Service" || true

echo ""
echo "🎉 WebduhVercel Platform Started Successfully!"
echo ""
echo "📊 Service URLs:"
echo "   🏠 Dashboard:     http://localhost:3000"
echo "   🔧 API:           http://localhost:3001" 
echo "   ⚡ Bolt.DIY:      http://localhost:5173"
echo "   🤖 AI Builder:    http://localhost:3000/ai-builder"
echo "   📊 Status Page:   http://localhost:3000/status"
echo ""
echo "📝 Log Files:"
echo "   Dashboard: logs/dashboard.log"
echo "   API:       logs/api.log"
echo "   Bolt.DIY:  logs/bolt-diy.log"
echo ""
echo "🛑 To stop all services: ./stop-all.sh"
echo ""
echo "✨ Happy coding with WebduhVercel!"

# Keep script running
echo "Press Ctrl+C to stop all services..."
trap 'echo ""; echo "🛑 Stopping all services..."; kill $API_PID $BOLT_PID $DASHBOARD_PID 2>/dev/null; exit 0' INT
wait 