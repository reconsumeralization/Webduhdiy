# 🚀 WebduhVercel - The Ultimate v0.dev Competitor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

> **The most comprehensive AI-powered web development platform** - Combining the power of Bolt.DIY with enterprise-grade features, multi-LLM support, and real-time collaboration tools.

## 🎯 What is WebduhVercel?

WebduhVercel is a **complete v0.dev competitor** that combines:

- 🤖 **Multi-LLM AI Code Generation** (OpenAI, Anthropic, Groq, Ollama, Perplexity)
- 🔧 **Bolt.DIY Integration** - Full WebContainer development environment
- 🌐 **Search-Enhanced Context** - Web, GitHub, StackOverflow integration
- 📊 **Real-time Service Monitoring** - Comprehensive health dashboards
- 🎨 **System-wide Navigation** - Consistent UI across all applications
- 🚀 **Enterprise-ready Architecture** - Monorepo with TypeScript throughout

## ⚡ Quick Start

### **One-Click Setup (Recommended)**

**Windows:**

```bash
.\webduh-complete-setup.bat
```

**Unix/Linux/macOS:**

```bash
chmod +x clear-and-setup.sh && ./clear-and-setup.sh
```

### **Launch Options**

**🚀 Launch All Services:**

```bash
# Windows
.\start-all.bat

# Unix/Linux/macOS
./start-all.sh
```

**⚡ Launch DIY Builder Only:**

```bash
# Windows
.\launch-diy-builder.bat

# Manual launch
cd apps/bolt-diy && npm run dev
```

### **Manual Setup**

```bash
# 1. Install dependencies
npm install

# 2. Build shared components
cd packages/shared-ui && npm install && npm run build && cd ../..

# 3. Setup applications
cd apps/dashboard && npm install && cd ../..
cd apps/api && npm install && cd ../..
cd apps/bolt-diy && npm install && cd ../..

# 4. Start all services
npm run dev
```

## 🌐 Service Architecture

| Service            | Port            | Description                 | Status               |
| ------------------ | --------------- | --------------------------- | -------------------- |
| **Dashboard**      | 3000            | Main WebduhVercel interface | ✅ Ready             |
| **AI Builder**     | 3000/ai-builder | Multi-LLM code generation   | ✅ Ready             |
| **Bolt.DIY**       | 5173            | WebContainer development    | ✅ Ready             |
| **API**            | 3001            | Backend services            | ⚠️ Database required |
| **Status Monitor** | 3000/status     | Real-time health checks     | ✅ Ready             |

## 🔗 Access URLs

- **🏠 Dashboard**: http://localhost:3000
- **🤖 AI Builder**: http://localhost:3000/ai-builder
- **⚡ Bolt.DIY**: http://localhost:5173
- **📊 Status Page**: http://localhost:3000/status
- **📈 Analytics**: http://localhost:3000/analytics
- **🔧 API Docs**: http://localhost:3001/docs

## ✨ Key Features

### 🤖 **AI-Powered Development**

- **Multi-LLM Support**: OpenAI GPT-4, Anthropic Claude, Groq, Ollama, Perplexity
- **Search-Enhanced Context**: Real-time web, GitHub, and StackOverflow integration
- **Code Generation**: Full-stack applications with modern frameworks
- **Real-time Collaboration**: Share and iterate on projects instantly

### 🔧 **Bolt.DIY Integration**

- **WebContainer Environment**: Full Node.js runtime in the browser
- **Live Preview**: Instant feedback on code changes
- **Package Management**: npm/yarn support with real-time installation
- **File System**: Complete file management and editing capabilities

### 📊 **Enterprise Features**

- **Real-time Monitoring**: Service health and performance tracking
- **Analytics Dashboard**: Usage metrics and insights
- **Team Management**: Multi-user collaboration tools
- **Deployment Pipeline**: One-click deployment to multiple platforms

### 🎨 **Unified Experience**

- **System-wide Navigation**: Consistent UI across all applications
- **Responsive Design**: Mobile-first approach with dark/light themes
- **TypeScript Throughout**: 100% type safety and IntelliSense support
- **Modern Tech Stack**: Next.js 14, React 18, Tailwind CSS

### ✨ Editor Enhancements

The DIY builder now includes several editor enhancements to improve your workflow:

- **Minimap**: A minimap is displayed for quick navigation in large files. This can be toggled in the "Editor" settings tab.
- **Code Folding**: You can now collapse code blocks to get a better overview of your code. This can be toggled in the "Editor" settings tab.
- **Format on Save**: The editor will automatically format your code on save using Prettier. This can be toggled in the "Editor" settings tab.

### 🔍 Improved Search

The search functionality has been significantly improved:

- **Enhanced UI**: The search results now include file icons and better highlighting for a more intuitive experience.
- **Search Options**: You can now toggle case sensitivity, regex matching, and whole-word matching.
- **Performance**: The search results are now virtualized, which means that only the visible results are rendered. This significantly improves performance in large projects.

## 📁 Project Structure

```
WebduhVercel/
├── 📱 apps/
│   ├── 🏠 dashboard/              # Next.js main interface
│   │   ├── app/                   # App router pages
│   │   ├── components/            # React components
│   │   ├── lib/                   # Utilities and services
│   │   └── styles/                # Tailwind CSS styles
│   ├── 🔧 api/                    # Express.js backend
│   │   ├── src/                   # Source code
│   │   ├── routes/                # API routes
│   │   └── services/              # Business logic
│   └── ⚡ bolt-diy/               # Bolt.DIY integration
│       ├── app/                   # Remix application
│       ├── components/            # UI components
│       └── lib/                   # Core functionality
├── 📦 packages/
│   └── 🎨 shared-ui/             # Shared components
│       ├── src/                   # Source code
│       ├── components/            # Reusable components
│       └── config/                # Navigation config
├── 🏗️ infrastructure/
│   └── k3s/                      # Kubernetes configs
├── 📜 scripts/                   # Utility scripts
├── 🔧 Setup Scripts
│   ├── clear-and-setup.sh        # Unix setup
│   ├── clear-and-setup.bat       # Windows setup
│   └── webduh-complete-setup.bat # Complete setup
└── 📚 Documentation
    ├── README.md                  # This file
    ├── WEBDUH_COMPLETE_PLATFORM_SETUP.md
    └── BOLT_DIY_INTEGRATION_COMPLETE.md
```

## 🔧 Development Guide

### **Adding New Features**

1. **Shared Components**: Add to `packages/shared-ui/src/components/`
2. **Navigation Updates**: Modify `packages/shared-ui/src/config/navigation.ts`
3. **API Endpoints**: Create in `apps/api/src/routes/`
4. **Dashboard Pages**: Add to `apps/dashboard/app/`

### **Building & Testing**

```bash
# Build all packages
npm run build

# Run tests
npm run test

# Type checking
npm run typecheck

# Linting
npm run lint
```

### **Environment Configuration**

```bash
# Dashboard environment
cp apps/dashboard/.env.example apps/dashboard/.env.local

# API environment
cp apps/api/.env.example apps/api/.env

# Bolt.DIY environment
cp apps/bolt-diy/.env.example apps/bolt-diy/.env.local
```

## 🚀 Deployment

### **Development**

```bash
npm run dev
```

### **Production Build**

```bash
npm run build
npm run start
```

### **Docker Deployment**

```bash
docker-compose up -d
```

### **Kubernetes Deployment**

```bash
kubectl apply -f infrastructure/k3s/
```

## 🛠️ Configuration

### **Required Environment Variables**

**Dashboard (`apps/dashboard/.env.local`)**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_BOLT_DIY_URL=http://localhost:5173
NODE_ENV=development
```

**API (`apps/api/.env`)**

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/webduh
JWT_SECRET=your_jwt_secret_here
```

**Bolt.DIY (`apps/bolt-diy/.env.local`)**

```env
# Copy from .env.example and configure your API keys
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

## 📊 Competitive Advantages

| Feature                  | WebduhVercel         | v0.dev     | Bolt.new   |
| ------------------------ | -------------------- | ---------- | ---------- |
| **Multi-LLM Support**    | ✅ 5+ providers      | ❌ Single  | ❌ Single  |
| **WebContainer**         | ✅ Full Bolt.DIY     | ❌ Limited | ✅ Yes     |
| **Search Integration**   | ✅ Web + GitHub + SO | ❌ No      | ❌ Limited |
| **Real-time Monitoring** | ✅ Comprehensive     | ❌ No      | ❌ Basic   |
| **Open Source**          | ✅ MIT License       | ❌ Closed  | ❌ Closed  |
| **Self-hostable**        | ✅ Yes               | ❌ No      | ❌ No      |
| **Enterprise Ready**     | ✅ Yes               | ⚠️ Limited | ⚠️ Limited |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Documentation**: [Complete Setup Guide](WEBDUH_COMPLETE_PLATFORM_SETUP.md)
- **Bolt.DIY Integration**: [Integration Guide](BOLT_DIY_INTEGRATION_COMPLETE.md)
- **Issues**: [GitHub Issues](https://github.com/your-org/webduhvercel/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/webduhvercel/discussions)

## 🏆 Acknowledgments

- **Bolt.DIY** - For the amazing WebContainer technology
- **Vercel** - For inspiration and Next.js
- **OpenAI, Anthropic, Groq** - For AI capabilities
- **The Open Source Community** - For making this possible

---

**Made with ❤️ by the WebduhVercel Team**

_Ready to revolutionize web development? Start building with WebduhVercel today!_ 🚀
