# 🚀 WebduhVercel API Documentation

## 📖 Overview

The WebduhVercel API provides programmatic access to all platform features including project management, deployments, AI Builder, Bolt.DIY integration, and system monitoring.

**Base URL:** `http://localhost:3001/api`  
**API Version:** `v1`  
**Authentication:** JWT Bearer tokens

## 🔑 Authentication

### **Get API Token**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### **Using API Token**

Include the token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🏗️ Projects API

### **List Projects**

```http
GET /api/projects
Authorization: Bearer {token}
```

**Response:**

```json
{
  "projects": [
    {
      "id": "proj_123",
      "name": "my-nextjs-app",
      "description": "Next.js application with AI features",
      "framework": "nextjs",
      "status": "deployed",
      "url": "https://my-nextjs-app.webduhvercel.app",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T15:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### **Create Project**

```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "new-project",
  "description": "Description of the project",
  "framework": "nextjs",
  "template": "template_id",
  "gitRepo": "https://github.com/user/repo.git"
}
```

### **Get Project Details**

```http
GET /api/projects/{projectId}
Authorization: Bearer {token}
```

### **Update Project**

```http
PATCH /api/projects/{projectId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "updated-name",
  "description": "Updated description"
}
```

### **Delete Project**

```http
DELETE /api/projects/{projectId}
Authorization: Bearer {token}
```

## 🚀 Deployments API

### **List Deployments**

```http
GET /api/projects/{projectId}/deployments
Authorization: Bearer {token}
```

**Response:**

```json
{
  "deployments": [
    {
      "id": "deploy_123",
      "projectId": "proj_123",
      "status": "success",
      "url": "https://my-nextjs-app-git-main.webduhvercel.app",
      "branch": "main",
      "commit": "abc123def456",
      "buildTime": 45000,
      "createdAt": "2024-01-15T15:30:00Z"
    }
  ]
}
```

### **Create Deployment**

```http
POST /api/projects/{projectId}/deployments
Authorization: Bearer {token}
Content-Type: application/json

{
  "branch": "main",
  "environment": "production"
}
```

### **Get Deployment Status**

```http
GET /api/deployments/{deploymentId}
Authorization: Bearer {token}
```

### **Cancel Deployment**

```http
POST /api/deployments/{deploymentId}/cancel
Authorization: Bearer {token}
```

## 🤖 AI Builder API

### **Generate Code**

```http
POST /api/ai/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "prompt": "Create a responsive login form with validation",
  "framework": "react",
  "llmProvider": "openai",
  "model": "gpt-4",
  "context": {
    "existing_files": [],
    "dependencies": ["react", "tailwindcss"]
  }
}
```

**Response:**

```json
{
  "id": "gen_123",
  "status": "completed",
  "code": {
    "files": [
      {
        "path": "components/LoginForm.tsx",
        "content": "import React, { useState } from 'react'...",
        "language": "typescript"
      }
    ]
  },
  "suggestions": [
    "Add form validation with Yup",
    "Consider using React Hook Form"
  ]
}
```

### **Get Generation Status**

```http
GET /api/ai/generate/{generationId}
Authorization: Bearer {token}
```

### **Search Enhanced Context**

```http
POST /api/ai/search-context
Authorization: Bearer {token}
Content-Type: application/json

{
  "query": "React form validation best practices",
  "sources": ["web", "github", "stackoverflow"],
  "limit": 5
}
```

## ⚡ Bolt.DIY Integration API

### **Create Bolt.DIY Session**

```http
POST /api/bolt/sessions
Authorization: Bearer {token}
Content-Type: application/json

{
  "projectId": "proj_123",
  "template": "nextjs",
  "initialFiles": {
    "package.json": "...",
    "index.tsx": "..."
  }
}
```

**Response:**

```json
{
  "sessionId": "bolt_session_123",
  "url": "http://localhost:5173/sessions/bolt_session_123",
  "status": "ready",
  "expiresAt": "2024-01-15T20:00:00Z"
}
```

### **Get Session Status**

```http
GET /api/bolt/sessions/{sessionId}
Authorization: Bearer {token}
```

### **Update Session Files**

```http
POST /api/bolt/sessions/{sessionId}/files
Authorization: Bearer {token}
Content-Type: application/json

{
  "files": {
    "src/App.tsx": "updated content",
    "package.json": "updated dependencies"
  }
}
```

## 📊 Analytics API

### **Get Project Analytics**

```http
GET /api/analytics/projects/{projectId}
Authorization: Bearer {token}
?timeRange=7d&metrics=pageviews,visitors,bounceRate
```

**Response:**

```json
{
  "metrics": {
    "pageviews": {
      "total": 15420,
      "change": "+12.5%",
      "data": [
        { "date": "2024-01-09", "value": 2100 },
        { "date": "2024-01-10", "value": 2350 }
      ]
    },
    "visitors": {
      "total": 8920,
      "change": "+8.2%"
    }
  },
  "topPages": [
    { "path": "/", "views": 5420 },
    { "path": "/about", "views": 2100 }
  ]
}
```

### **Get Performance Metrics**

```http
GET /api/analytics/performance/{projectId}
Authorization: Bearer {token}
```

### **Real-time Analytics**

```http
GET /api/analytics/realtime/{projectId}
Authorization: Bearer {token}
```

## 🔧 System Monitoring API

### **Get Service Status**

```http
GET /api/system/status
Authorization: Bearer {token}
```

**Response:**

```json
{
  "services": [
    {
      "name": "dashboard",
      "status": "healthy",
      "port": 3000,
      "responseTime": 45,
      "uptime": "99.98%",
      "lastCheck": "2024-01-15T16:00:00Z"
    },
    {
      "name": "bolt-diy",
      "status": "healthy",
      "port": 5173,
      "responseTime": 89,
      "uptime": "99.95%"
    }
  ],
  "overall": "healthy"
}
```

### **Get System Metrics**

```http
GET /api/system/metrics
Authorization: Bearer {token}
```

### **Health Check**

```http
GET /api/health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T16:00:00Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

## 👥 Team Management API

### **List Team Members**

```http
GET /api/team/members
Authorization: Bearer {token}
```

### **Invite Team Member**

```http
POST /api/team/invite
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "newmember@example.com",
  "role": "developer",
  "permissions": ["read", "deploy"]
}
```

### **Update Member Role**

```http
PATCH /api/team/members/{memberId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "admin",
  "permissions": ["read", "write", "deploy", "admin"]
}
```

## 🌐 Domains API

### **List Domains**

```http
GET /api/domains
Authorization: Bearer {token}
```

### **Add Domain**

```http
POST /api/domains
Authorization: Bearer {token}
Content-Type: application/json

{
  "domain": "example.com",
  "projectId": "proj_123"
}
```

### **Verify Domain**

```http
POST /api/domains/{domainId}/verify
Authorization: Bearer {token}
```

### **Configure DNS**

```http
POST /api/domains/{domainId}/dns
Authorization: Bearer {token}
Content-Type: application/json

{
  "records": [
    {
      "type": "A",
      "name": "@",
      "value": "192.168.1.1"
    }
  ]
}
```

## 📁 Templates API

### **List Templates**

```http
GET /api/templates
Authorization: Bearer {token}
?framework=nextjs&category=ecommerce
```

**Response:**

```json
{
  "templates": [
    {
      "id": "template_123",
      "name": "E-commerce Store",
      "description": "Full-featured online store with cart and payments",
      "framework": "nextjs",
      "category": "ecommerce",
      "preview": "https://preview.webduhvercel.app/template_123",
      "features": ["authentication", "payments", "inventory"],
      "complexity": "intermediate"
    }
  ]
}
```

### **Get Template Details**

```http
GET /api/templates/{templateId}
Authorization: Bearer {token}
```

### **Deploy Template**

```http
POST /api/templates/{templateId}/deploy
Authorization: Bearer {token}
Content-Type: application/json

{
  "projectName": "my-store",
  "customizations": {
    "theme": "dark",
    "features": ["payments", "analytics"]
  }
}
```

## 🔔 Webhooks API

### **List Webhooks**

```http
GET /api/webhooks
Authorization: Bearer {token}
```

### **Create Webhook**

```http
POST /api/webhooks
Authorization: Bearer {token}
Content-Type: application/json

{
  "url": "https://myapp.com/webhook",
  "events": ["deployment.created", "deployment.ready"],
  "projectId": "proj_123"
}
```

### **Webhook Events**

Available events:

- `deployment.created`
- `deployment.ready`
- `deployment.failed`
- `project.created`
- `project.updated`
- `domain.verified`
- `ai.generation.completed`

## 📈 Rate Limits

| Endpoint Category | Requests per minute |
| ----------------- | ------------------- |
| Authentication    | 10                  |
| Projects          | 60                  |
| Deployments       | 30                  |
| AI Generation     | 10                  |
| Analytics         | 100                 |
| System Status     | 200                 |

## ❌ Error Codes

| Status Code | Description                             |
| ----------- | --------------------------------------- |
| 400         | Bad Request - Invalid parameters        |
| 401         | Unauthorized - Invalid or missing token |
| 403         | Forbidden - Insufficient permissions    |
| 404         | Not Found - Resource doesn't exist      |
| 429         | Too Many Requests - Rate limit exceeded |
| 500         | Internal Server Error                   |

**Error Response Format:**

```json
{
  "error": {
    "code": "INVALID_PROJECT",
    "message": "Project not found",
    "details": {
      "projectId": "proj_invalid"
    }
  }
}
```

## 📚 SDKs & Libraries

### **JavaScript/TypeScript SDK**

```bash
npm install @webduh/sdk
```

```typescript
import { WebduhClient } from '@webduh/sdk';

const client = new WebduhClient({
  apiKey: 'your_api_key',
  baseUrl: 'http://localhost:3001',
});

const projects = await client.projects.list();
```

### **Python SDK**

```bash
pip install webduh-python
```

```python
from webduh import WebduhClient

client = WebduhClient(api_key='your_api_key')
projects = client.projects.list()
```

## 🧪 Testing

### **Test Environment**

- **Base URL:** `http://localhost:3001/api`
- **Test API Key:** Available in development mode
- **Mock Data:** Pre-populated test projects and deployments

### **Example Requests**

```bash
# Test authentication
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# List projects
curl -X GET http://localhost:3001/api/projects \
  -H "Authorization: Bearer your_token"
```

## 📋 Changelog

### **v1.0.0** - Initial Release

- ✅ Complete REST API
- ✅ JWT Authentication
- ✅ Project & Deployment management
- ✅ AI Builder integration
- ✅ Bolt.DIY session management
- ✅ Real-time analytics
- ✅ System monitoring

---

**🚀 Ready to build amazing applications with WebduhVercel API!**
