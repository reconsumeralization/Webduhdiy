const fs = require('fs');
const path = require('path');

// Framework and security documentation
const frameworkPages = [
  {
    path: 'apps/dashboard/app/docs/frameworks/react/page.tsx',
    title: 'React Applications',
    content: `'use client';

import { DocPage } from '../../components/DocPage';
import { CodeBlock } from '../../components/CodeBlock';

export default function ReactPage() {
  return (
    <DocPage
      title="React Applications"
      description="Deploy React applications with Create React App, Vite, and custom setups on Webduh."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Frameworks', href: '/docs/frameworks' },
        { label: 'React', href: '/docs/frameworks/react' }
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Quick Start</h2>
        <p>
          Deploy React applications built with Create React App, Vite, or custom webpack configurations.
          Webduh automatically detects your React setup and configures optimal build settings.
        </p>

        <h3>Create React App</h3>
        <p>Deploy a Create React App project:</p>
        <CodeBlock
          language="bash"
          code={\`# Create new React app
npx create-react-app my-app
cd my-app

# Deploy to Webduh
npm install -g @webduh/cli
webduh --prod\`}
          filename="CRA Deployment"
        />

        <h3>Vite React</h3>
        <p>Deploy a Vite-powered React application:</p>
        <CodeBlock
          language="bash"
          code={\`# Create Vite React app
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install

# Deploy to Webduh
webduh --prod\`}
          filename="Vite Deployment"
        />

        <h2>Configuration</h2>
        <h3>Build Settings</h3>
        <p>Webduh auto-detects React projects and uses these default settings:</p>
        <CodeBlock
          language="json"
          code={\`{
  "framework": "react",
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install",
  "devCommand": "npm start"
}\`}
          filename="Auto-detected settings"
        />

        <h3>Custom Configuration</h3>
        <p>Override defaults with webduh.json:</p>
        <CodeBlock
          language="json"
          code={\`{
  "buildCommand": "npm run build:production",
  "outputDirectory": "dist",
  "env": {
    "REACT_APP_API_URL": "@api-url"
  },
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}\`}
          filename="webduh.json"
        />

        <h2>Environment Variables</h2>
        <p>React apps support environment variables with the REACT_APP_ prefix:</p>
        <CodeBlock
          language="bash"
          code={\`# Environment variables
REACT_APP_API_URL=https://api.example.com
REACT_APP_ANALYTICS_ID=GA_TRACKING_ID
REACT_APP_VERSION=1.0.0\`}
          filename="Environment Variables"
        />

        <CodeBlock
          language="javascript"
          code={\`// Using environment variables in React
const apiUrl = process.env.REACT_APP_API_URL;
const analyticsId = process.env.REACT_APP_ANALYTICS_ID;

// In your component
function App() {
  useEffect(() => {
    // Initialize analytics
    gtag('config', analyticsId);
  }, []);

  return <div>My React App</div>;
}\`}
          filename="Using Environment Variables"
        />

        <h2>Routing</h2>
        <h3>React Router</h3>
        <p>Configure client-side routing with React Router:</p>
        <CodeBlock
          language="json"
          code={\`{
  "rewrites": [
    {
      "source": "/((?!api/.*).*)",
      "destination": "/index.html"
    }
  ]
}\`}
          filename="SPA Routing"
        />

        <CodeBlock
          language="javascript"
          code={\`// App.js with React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}\`}
          filename="React Router Setup"
        />

        <h2>Optimization</h2>
        <h3>Code Splitting</h3>
        <p>Optimize your React app with code splitting:</p>
        <CodeBlock
          language="javascript"
          code={\`import { lazy, Suspense } from 'react';

// Lazy load components
const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}\`}
          filename="Code Splitting"
        />

        <h3>Bundle Analysis</h3>
        <p>Analyze your bundle size:</p>
        <CodeBlock
          language="bash"
          code={\`# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Add script to package.json
"analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"\`}
          filename="Bundle Analysis"
        />

        <h2>API Integration</h2>
        <h3>Fetch API</h3>
        <p>Make API calls in your React components:</p>
        <CodeBlock
          language="javascript"
          code={\`import { useState, useEffect } from 'react';

function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(\`\${process.env.REACT_APP_API_URL}/data\`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}\`}
          filename="API Integration"
        />

        <h2>Testing</h2>
        <h3>Unit Tests</h3>
        <p>React apps come with Jest testing setup:</p>
        <CodeBlock
          language="javascript"
          code={\`import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});\`}
          filename="Unit Test"
        />

        <h2>Deployment</h2>
        <h3>Production Build</h3>
        <p>Optimize for production deployment:</p>
        <CodeBlock
          language="json"
          code={\`{
  "scripts": {
    "build": "react-scripts build",
    "build:analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"
  },
  "homepage": "https://yourdomain.com"
}\`}
          filename="Production Scripts"
        />

        <h3>Performance Monitoring</h3>
        <p>Monitor your React app performance:</p>
        <CodeBlock
          language="javascript"
          code={\`// src/index.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.id,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);\`}
          filename="Web Vitals"
        />
      </div>
    </DocPage>
  );
}`,
  },
  {
    path: 'apps/dashboard/app/docs/security/page.tsx',
    title: 'Security',
    content: `'use client';

import { DocPage } from '../components/DocPage';
import { CodeBlock } from '../components/CodeBlock';

export default function SecurityPage() {
  return (
    <DocPage
      title="Security"
      description="Security best practices, headers, and configurations for your Webduh applications."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Security', href: '/docs/security' }
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Overview</h2>
        <p>
          Webduh provides enterprise-grade security features by default, including automatic HTTPS,
          DDoS protection, and security headers. This guide covers additional security measures
          you can implement in your applications.
        </p>

        <h2>HTTPS and SSL</h2>
        <h3>Automatic HTTPS</h3>
        <p>
          All Webduh deployments come with automatic HTTPS using Let's Encrypt certificates.
          Custom domains automatically receive SSL certificates within minutes of DNS configuration.
        </p>

        <h3>HTTP to HTTPS Redirects</h3>
        <p>Force HTTPS redirects for all traffic:</p>
        <CodeBlock
          language="json"
          code={\`{
  "redirects": [
    {
      "source": "http://example.com/:path*",
      "destination": "https://example.com/:path*",
      "permanent": true
    }
  ]
}\`}
          filename="HTTPS Redirects"
        />

        <h2>Security Headers</h2>
        <h3>Content Security Policy (CSP)</h3>
        <p>Protect against XSS attacks with CSP headers:</p>
        <CodeBlock
          language="json"
          code={\`{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.example.com"
        }
      ]
    }
  ]
}\`}
          filename="CSP Headers"
        />

        <h3>Additional Security Headers</h3>
        <p>Implement comprehensive security headers:</p>
        <CodeBlock
          language="json"
          code={\`{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}\`}
          filename="Security Headers"
        />

        <h2>Environment Variables</h2>
        <h3>Secure Secret Management</h3>
        <p>Store sensitive data securely:</p>
        <CodeBlock
          language="bash"
          code={\`# Use environment variables for secrets
DATABASE_PASSWORD=your-secure-password
API_SECRET_KEY=your-secret-key
JWT_SECRET=your-jwt-secret

# Never commit secrets to Git
echo "*.env*" >> .gitignore\`}
          filename="Secret Management"
        />

        <h3>Environment-Specific Secrets</h3>
        <p>Use different secrets for different environments:</p>
        <CodeBlock
          language="javascript"
          code={\`// api/auth.js
const secret = process.env.JWT_SECRET;
const dbPassword = process.env.DATABASE_PASSWORD;

if (!secret || !dbPassword) {
  throw new Error('Required environment variables are missing');
}

// Use secrets in your application
const token = jwt.sign(payload, secret, { expiresIn: '1h' });\`}
          filename="Using Secrets"
        />

        <h2>API Security</h2>
        <h3>Rate Limiting</h3>
        <p>Implement rate limiting for API endpoints:</p>
        <CodeBlock
          language="javascript"
          code={\`// lib/rateLimit.js
import rateLimit from 'express-rate-limit';

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// api/protected.js
import { apiRateLimit } from '../lib/rateLimit';

export default async function handler(req, res) {
  await apiRateLimit(req, res);
  
  // Your API logic here
  res.json({ message: 'Protected endpoint' });
}\`}
          filename="Rate Limiting"
        />

        <h3>Input Validation</h3>
        <p>Validate and sanitize user input:</p>
        <CodeBlock
          language="javascript"
          code={\`import Joi from 'joi';
import DOMPurify from 'isomorphic-dompurify';

// Define validation schema
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(50).required(),
  age: Joi.number().integer().min(13).max(120)
});

export default async function handler(req, res) {
  // Validate input
  const { error, value } = userSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  // Sanitize HTML content
  const sanitizedName = DOMPurify.sanitize(value.name);
  
  // Process validated and sanitized data
  res.json({ success: true });
}\`}
          filename="Input Validation"
        />

        <h2>Authentication</h2>
        <h3>JWT Token Security</h3>
        <p>Implement secure JWT token handling:</p>
        <CodeBlock
          language="javascript"
          code={\`import jwt from 'jsonwebtoken';

// Generate token with expiration
function generateToken(userId) {
  return jwt.sign(
    { userId, iat: Math.floor(Date.now() / 1000) },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// Verify token middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}\`}
          filename="JWT Security"
        />

        <h3>Session Security</h3>
        <p>Secure session configuration:</p>
        <CodeBlock
          language="javascript"
          code={\`// next.config.js
module.exports = {
  experimental: {
    esmExternals: false
  },
  env: {
    SESSION_SECRET: process.env.SESSION_SECRET,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Set-Cookie',
            value: 'sessionId=; HttpOnly; Secure; SameSite=Strict'
          }
        ]
      }
    ];
  }
};\`}
          filename="Session Configuration"
        />

        <h2>Database Security</h2>
        <h3>SQL Injection Prevention</h3>
        <p>Use parameterized queries to prevent SQL injection:</p>
        <CodeBlock
          language="javascript"
          code={\`// ❌ Vulnerable to SQL injection
const query = \`SELECT * FROM users WHERE email = '\${email}'\`;

// ✅ Safe parameterized query
import { query } from '../lib/db';

async function getUser(email) {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
}

// ✅ Using ORM (Prisma example)
const user = await prisma.user.findUnique({
  where: { email: email }
});\`}
          filename="SQL Injection Prevention"
        />

        <h2>CORS Configuration</h2>
        <h3>Restrict Origins</h3>
        <p>Configure CORS to allow only trusted origins:</p>
        <CodeBlock
          language="javascript"
          code={\`// api/cors-example.js
const allowedOrigins = [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
].filter(Boolean);

export default function handler(req, res) {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Your API logic
}\`}
          filename="CORS Configuration"
        />

        <h2>Monitoring and Logging</h2>
        <h3>Security Event Logging</h3>
        <p>Log security-relevant events:</p>
        <CodeBlock
          language="javascript"
          code={\`// lib/logger.js
function logSecurityEvent(event, req, details = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    url: req.url,
    ...details
  };
  
  // Send to your logging service
  console.log('SECURITY_EVENT:', JSON.stringify(logEntry));
}

// Usage in API endpoints
export default function handler(req, res) {
  try {
    // API logic
  } catch (error) {
    logSecurityEvent('AUTHENTICATION_FAILURE', req, {
      reason: 'Invalid credentials'
    });
    res.status(401).json({ error: 'Authentication failed' });
  }
}\`}
          filename="Security Logging"
        />

        <h2>Dependency Security</h2>
        <h3>Vulnerability Scanning</h3>
        <p>Regularly scan for vulnerabilities:</p>
        <CodeBlock
          language="bash"
          code={\`# Audit dependencies
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Install only production dependencies
npm ci --production\`}
          filename="Dependency Auditing"
        />

        <h3>Dependency Pinning</h3>
        <p>Pin dependency versions for security:</p>
        <CodeBlock
          language="json"
          code={\`{
  "dependencies": {
    "react": "18.2.0",
    "next": "13.1.6",
    "lodash": "4.17.21"
  },
  "scripts": {
    "preinstall": "npm audit --audit-level=high"
  }
}\`}
          filename="Version Pinning"
        />

        <h2>Security Checklist</h2>
        <ul>
          <li>✅ Enable HTTPS redirects</li>
          <li>✅ Configure security headers (CSP, HSTS, etc.)</li>
          <li>✅ Use environment variables for secrets</li>
          <li>✅ Implement input validation and sanitization</li>
          <li>✅ Set up rate limiting for APIs</li>
          <li>✅ Use parameterized database queries</li>
          <li>✅ Configure CORS properly</li>
          <li>✅ Log security events</li>
          <li>✅ Regular dependency audits</li>
          <li>✅ Monitor for unusual activity</li>
        </ul>
      </div>
    </DocPage>
  );
}`,
  },
  {
    path: 'apps/dashboard/app/docs/performance/page.tsx',
    title: 'Performance',
    content: `'use client';

import { DocPage } from '../components/DocPage';
import { CodeBlock } from '../components/CodeBlock';

export default function PerformancePage() {
  return (
    <DocPage
      title="Performance Optimization"
      description="Optimize your applications for speed, Core Web Vitals, and user experience on Webduh."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Performance', href: '/docs/performance' }
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Overview</h2>
        <p>
          Webduh provides global CDN, automatic compression, and edge caching by default.
          This guide covers additional optimizations you can implement to maximize performance.
        </p>

        <h2>Core Web Vitals</h2>
        <h3>Largest Contentful Paint (LCP)</h3>
        <p>Optimize loading performance:</p>
        <CodeBlock
          language="javascript"
          code={\`// Optimize images with Next.js
import Image from 'next/image';

function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority // Load immediately
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}

// Preload critical resources
export default function Layout({ children }) {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/fonts/inter.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
      </Head>
      {children}
    </>
  );
}\`}
          filename="LCP Optimization"
        />

        <h3>First Input Delay (FID)</h3>
        <p>Reduce JavaScript execution time:</p>
        <CodeBlock
          language="javascript"
          code={\`// Code splitting with dynamic imports
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}

// Use Web Workers for heavy computations
const worker = new Worker('/worker.js');
worker.postMessage({ data: heavyData });
worker.onmessage = (event) => {
  const result = event.data;
  // Update UI with result
};\`}
          filename="FID Optimization"
        />

        <h3>Cumulative Layout Shift (CLS)</h3>
        <p>Prevent layout shifts:</p>
        <CodeBlock
          language="css"
          code={\`/* Reserve space for images */
.image-container {
  width: 100%;
  height: 300px;
  position: relative;
}

/* Skeleton loading */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}\`}
          filename="CLS Prevention"
        />

        <h2>Image Optimization</h2>
        <h3>Next.js Image Component</h3>
        <p>Automatic image optimization:</p>
        <CodeBlock
          language="javascript"
          code={\`import Image from 'next/image';

// Responsive images
function Gallery() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {images.map((image) => (
        <Image
          key={image.id}
          src={image.src}
          alt={image.alt}
          width={400}
          height={300}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
      ))}
    </div>
  );
}

// Custom loader for external images
const myLoader = ({ src, width, quality }) => {
  return \`https://example.com/\${src}?w=\${width}&q=\${quality || 75}\`;
};

function ExternalImage() {
  return (
    <Image
      loader={myLoader}
      src="image.jpg"
      alt="External image"
      width={500}
      height={300}
    />
  );
}\`}
          filename="Image Optimization"
        />

        <h2>Bundle Optimization</h2>
        <h3>Bundle Analysis</h3>
        <p>Analyze and optimize bundle size:</p>
        <CodeBlock
          language="bash"
          code={\`# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Configure next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  experimental: {
    optimizeCss: true,
    optimizeImages: true,
  },
});

# Analyze bundle
ANALYZE=true npm run build\`}
          filename="Bundle Analysis"
        />

        <h3>Tree Shaking</h3>
        <p>Remove unused code:</p>
        <CodeBlock
          language="javascript"
          code={\`// ❌ Imports entire library
import _ from 'lodash';

// ✅ Import only what you need
import { debounce } from 'lodash';

// ✅ Even better - use specific imports
import debounce from 'lodash/debounce';

// Configure webpack for better tree shaking
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: false,
  },
};\`}
          filename="Tree Shaking"
        />

        <h2>Caching Strategies</h2>
        <h3>HTTP Caching</h3>
        <p>Configure optimal cache headers:</p>
        <CodeBlock
          language="json"
          code={\`{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
}\`}
          filename="Cache Headers"
        />

        <h3>API Response Caching</h3>
        <p>Cache API responses:</p>
        <CodeBlock
          language="javascript"
          code={\`// In-memory cache
const cache = new Map();

export default async function handler(req, res) {
  const cacheKey = req.url;
  
  // Check cache first
  if (cache.has(cacheKey)) {
    const cachedData = cache.get(cacheKey);
    if (Date.now() - cachedData.timestamp < 300000) { // 5 minutes
      return res.json(cachedData.data);
    }
  }
  
  // Fetch fresh data
  const data = await fetchDataFromAPI();
  
  // Store in cache
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.json(data);
}\`}
          filename="API Caching"
        />

        <h2>Database Optimization</h2>
        <h3>Query Optimization</h3>
        <p>Optimize database queries:</p>
        <CodeBlock
          language="javascript"
          code={\`// ❌ N+1 query problem
const users = await User.findAll();
for (const user of users) {
  user.posts = await Post.findAll({ where: { userId: user.id } });
}

// ✅ Use includes/joins
const users = await User.findAll({
  include: [Post]
});

// ✅ Use pagination
const users = await User.findAll({
  limit: 20,
  offset: page * 20,
  order: [['createdAt', 'DESC']]
});\`}
          filename="Database Queries"
        />

        <h2>CDN and Edge Optimization</h2>
        <h3>Static Asset Optimization</h3>
        <p>Optimize static assets for CDN delivery:</p>
        <CodeBlock
          language="javascript"
          code={\`// next.config.js
module.exports = {
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.yourdomain.com' 
    : '',
  
  images: {
    domains: ['cdn.yourdomain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};\`}
          filename="CDN Configuration"
        />

        <h2>Runtime Performance</h2>
        <h3>React Performance</h3>
        <p>Optimize React components:</p>
        <CodeBlock
          language="javascript"
          code={\`import { memo, useMemo, useCallback, useState } from 'react';

// Memoize expensive components
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: true
    }));
  }, [data]);

  return <div>{processedData.length} items</div>;
});

// Memoize callbacks
function Parent() {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <Child onClick={handleClick} />;
}\`}
          filename="React Optimization"
        />

        <h2>Monitoring</h2>
        <h3>Web Vitals Tracking</h3>
        <p>Monitor performance metrics:</p>
        <CodeBlock
          language="javascript"
          code={\`// pages/_app.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics({ name, value, id }) {
  gtag('event', name, {
    event_category: 'Web Vitals',
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    event_label: id,
    non_interaction: true,
  });
}

export function reportWebVitals(metric) {
  sendToAnalytics(metric);
}

// Monitor specific metrics
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);\`}
          filename="Performance Monitoring"
        />

        <h2>Performance Checklist</h2>
        <ul>
          <li>✅ Optimize images with proper sizing and formats</li>
          <li>✅ Implement code splitting and lazy loading</li>
          <li>✅ Configure appropriate cache headers</li>
          <li>✅ Minimize JavaScript bundle size</li>
          <li>✅ Use performance monitoring tools</li>
          <li>✅ Optimize database queries</li>
          <li>✅ Preload critical resources</li>
          <li>✅ Prevent layout shifts</li>
          <li>✅ Use CDN for static assets</li>
          <li>✅ Monitor Core Web Vitals</li>
        </ul>
      </div>
    </DocPage>
  );
}`,
  },
];

// Create framework-specific directories
const frameworkDirs = [
  'apps/dashboard/app/docs/frameworks',
  'apps/dashboard/app/docs/frameworks/react',
  'apps/dashboard/app/docs/security',
  'apps/dashboard/app/docs/performance',
];

frameworkDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Create each framework page
console.log('🚀 Creating framework-specific and security documentation...\n');

frameworkPages.forEach((page) => {
  const dir = path.dirname(page.path);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write the file
  fs.writeFileSync(page.path, page.content);
  console.log(`✅ Created ${page.title} at ${page.path}`);
});

console.log('\n🎉 Framework and security documentation created successfully!');
console.log('\n📋 Summary:');
console.log(`   • ${frameworkPages.length} specialized documentation pages`);
console.log('   • React framework guide with CRA and Vite');
console.log('   • Comprehensive security documentation');
console.log('   • Performance optimization guide');
console.log('\n🚀 Ready to run: npm run dev');
