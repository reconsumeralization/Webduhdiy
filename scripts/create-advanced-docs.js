const fs = require('fs');
const path = require('path');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Advanced documentation pages
const advancedDocs = [
  {
    path: 'apps/dashboard/app/docs/deployments/page.tsx',
    content: `'use client'

import DocPage from '../components/DocPage'
import CodeBlock from '../components/CodeBlock'

export default function DeploymentsPage() {
  return (
    <DocPage 
      title="Deployments" 
      description="Manage your webduh deployments with advanced features like preview deployments, rollbacks, and deployment protection."
    >
      <div className="space-y-8">
        <div>
          <h2 id="overview">Overview</h2>
          <p>
            Every git push to your connected repository triggers a new deployment on webduh. 
            Get instant previews, zero-downtime deployments, and easy rollbacks.
          </p>
        </div>

        <div>
          <h2 id="preview-deployments">Preview Deployments</h2>
          <p>Every branch and pull request gets its own preview URL:</p>

          <CodeBlock language="bash">
{\`# Each branch gets a unique URL
feature-branch → https://feature-branch-abc123.webduh.app
staging → https://staging-def456.webduh.app

# Pull requests get preview URLs
PR #123 → https://pr-123-ghi789.webduh.app\`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="production-deployments">Production Deployments</h2>
          <p>Deploy to production from your main branch:</p>

          <CodeBlock language="bash">
{\`# Automatic production deployment
git push origin main

# Manual production promotion
webduh deployments promote deployment-id\`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="rollbacks">Rollbacks</h2>
          <p>Instantly rollback to any previous deployment:</p>

          <CodeBlock language="bash">
{\`# Rollback to previous deployment
webduh rollback

# Rollback to specific deployment
webduh rollback deployment-abc123\`}
          </CodeBlock>
        </div>
      </div>
    </DocPage>
  )
}
`,
  },
  {
    path: 'apps/dashboard/app/docs/edge-network/page.tsx',
    content: `'use client'

import DocPage from '../components/DocPage'
import CodeBlock from '../components/CodeBlock'

export default function EdgeNetworkPage() {
  return (
    <DocPage 
      title="Edge Network" 
      description="webduh's global edge network delivers your content from 50+ locations worldwide for optimal performance."
    >
      <div className="space-y-8">
        <div>
          <h2 id="overview">Overview</h2>
          <p>
            webduh's edge network automatically distributes your application across 50+ edge locations worldwide, 
            ensuring fast load times for users everywhere.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Edge Locations</div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">&lt;100ms</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Global Latency</div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">99.99%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Uptime SLA</div>
            </div>
          </div>
        </div>

        <div>
          <h2 id="caching">Smart Caching</h2>
          <p>Automatic caching with intelligent cache invalidation:</p>

          <CodeBlock language="javascript" filename="next.config.js">
{\`module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=1, stale-while-revalidate',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}\`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="edge-functions">Edge Functions</h2>
          <p>Run code at the edge for ultra-low latency:</p>

          <CodeBlock language="javascript" filename="middleware.js">
{\`import { NextResponse } from 'next/server'

export function middleware(request) {
  // Geolocation-based routing
  const country = request.geo?.country
  
  if (country === 'GB') {
    return NextResponse.redirect('/uk')
  }
  
  if (country === 'JP') {
    return NextResponse.redirect('/japan')
  }
  
  return NextResponse.next()
}

export const config = {
  runtime: 'edge',
  matcher: '/',
}\`}
          </CodeBlock>
        </div>
      </div>
    </DocPage>
  )
}
`,
  },
  {
    path: 'apps/dashboard/app/docs/security/page.tsx',
    content: `'use client'

import DocPage from '../components/DocPage'
import CodeBlock from '../components/CodeBlock'

export default function SecurityPage() {
  return (
    <DocPage 
      title="Security" 
      description="webduh provides enterprise-grade security features including automatic SSL, DDoS protection, and security headers."
    >
      <div className="space-y-8">
        <div>
          <h2 id="overview">Overview</h2>
          <p>
            Security is built into every layer of webduh. From automatic SSL certificates to DDoS protection, 
            your applications are secured by default.
          </p>
        </div>

        <div>
          <h2 id="ssl-certificates">SSL Certificates</h2>
          <p>Free, automatic SSL certificates for all deployments:</p>

          <ul>
            <li>• Automatic HTTPS redirect</li>
            <li>• TLS 1.3 encryption</li>
            <li>• Wildcard certificate support</li>
            <li>• Automatic renewal</li>
          </ul>
        </div>

        <div>
          <h2 id="security-headers">Security Headers</h2>
          <p>Configure security headers for your application:</p>

          <CodeBlock language="javascript" filename="next.config.js">
{\`module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },
}\`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="environment-isolation">Environment Isolation</h2>
          <p>Each deployment runs in an isolated environment:</p>

          <ul>
            <li>• Containerized functions</li>
            <li>• Network isolation</li>
            <li>• Encrypted environment variables</li>
            <li>• Secure secret management</li>
          </ul>
        </div>
      </div>
    </DocPage>
  )
}
`,
  },
];

console.log('🔒 Creating advanced documentation pages...');

advancedDocs.forEach((doc) => {
  const fullPath = path.join(__dirname, '..', doc.path);
  const dir = path.dirname(fullPath);

  ensureDir(dir);
  fs.writeFileSync(fullPath, doc.content);
  console.log(`✅ Created ${doc.path}`);
});

console.log(`
🎉 Advanced Documentation Created!

📦 New Advanced Pages:
✅ Deployments - Preview deployments, rollbacks, and production management
✅ Edge Network - Global CDN, caching, and edge functions
✅ Security - SSL certificates, security headers, and protection features

🚀 Your documentation system now covers:
• Framework integration (Next.js, React, etc.)
• Serverless functions and APIs
• CLI tools and automation
• Custom domains and DNS
• Analytics and monitoring
• Environment management
• Advanced deployment workflows
• Global edge network optimization
• Enterprise security features

🎯 Production-Ready Documentation Complete!
Navigate to http://localhost:3001/docs to explore your comprehensive documentation system.
`);
