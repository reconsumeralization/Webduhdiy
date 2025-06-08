#!/bin/bash

echo "🛑 Stopping WebduhVercel Platform Services..."

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

# Stop services by PID if available
if [ -f "logs/api.pid" ]; then
    API_PID=$(cat logs/api.pid)
    if kill -0 $API_PID 2>/dev/null; then
        kill $API_PID
        print_success "API Service stopped (PID: $API_PID)"
    else
        print_error "API Service was not running"
    fi
    rm -f logs/api.pid
fi

if [ -f "logs/bolt-diy.pid" ]; then
    BOLT_PID=$(cat logs/bolt-diy.pid)
    if kill -0 $BOLT_PID 2>/dev/null; then
        kill $BOLT_PID
        print_success "Bolt.DIY Service stopped (PID: $BOLT_PID)"
    else
        print_error "Bolt.DIY Service was not running"
    fi
    rm -f logs/bolt-diy.pid
fi

if [ -f "logs/dashboard.pid" ]; then
    DASHBOARD_PID=$(cat logs/dashboard.pid)
    if kill -0 $DASHBOARD_PID 2>/dev/null; then
        kill $DASHBOARD_PID
        print_success "Dashboard Service stopped (PID: $DASHBOARD_PID)"
    else
        print_error "Dashboard Service was not running"
    fi
    rm -f logs/dashboard.pid
fi

# Fallback: Kill all npm/node processes related to our services
print_step "Cleaning up remaining processes..."
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
pkill -f "remix vite:dev" 2>/dev/null || true

# Kill processes by port
print_step "Freeing up ports..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

print_success "All services stopped"

echo ""
echo "🎉 WebduhVercel Platform Stopped Successfully!"
echo ""
echo "📁 Log files preserved in logs/ directory"
echo "🚀 Run ./start-all.sh to restart all services" 