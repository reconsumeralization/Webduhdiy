const fs = require('fs');
const path = require('path');

// Essential pages that developers need most
const essentialPages = [
  {
    path: 'apps/dashboard/app/docs/projects/page.tsx',
    title: 'Projects',
    content: `'use client';

import { DocPage } from '../components/DocPage';
import { CodeBlock } from '../components/CodeBlock';
import { QuickActions } from '../components/QuickActions';

export default function ProjectsPage() {
  return (
    <DocPage
      title="Projects"
      description="Learn how to create, configure, and manage your projects on Webduh."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Projects', href: '/docs/projects' }
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Overview</h2>
        <p>
          Projects are the foundation of your Webduh experience. Each project represents a 
          web application that you want to deploy and host. Projects can be connected to 
          Git repositories for automatic deployments.
        </p>

        <QuickActions className="my-8" />

        <h2>Creating a Project</h2>
        <h3>From Git Repository</h3>
        <p>The easiest way to create a project is to import from your Git repository:</p>
        
        <ol>
          <li>Connect your Git provider (GitHub, GitLab, or Bitbucket)</li>
          <li>Select the repository you want to deploy</li>
          <li>Configure build settings (usually auto-detected)</li>
          <li>Deploy your project</li>
        </ol>

        <CodeBlock
          language="bash"
          code={\`# Deploy from CLI
webduh --prod

# Deploy specific directory
webduh --prod ./my-app

# Deploy with custom build command
webduh --prod --build-command="npm run build:prod"\`}
          filename="CLI Deployment"
        />

        <h3>From Template</h3>
        <p>Start with a pre-configured template:</p>
        <ul>
          <li><strong>Next.js:</strong> Full-stack React framework</li>
          <li><strong>React:</strong> Client-side React application</li>
          <li><strong>Vue.js:</strong> Progressive JavaScript framework</li>
          <li><strong>Svelte:</strong> Compile-time optimized framework</li>
          <li><strong>Static Site:</strong> HTML, CSS, and JavaScript</li>
        </ul>

        <h2>Project Settings</h2>
        <h3>General Settings</h3>
        <p>Configure basic project information:</p>
        <ul>
          <li><strong>Project Name:</strong> Display name for your project</li>
          <li><strong>Framework:</strong> Auto-detected or manually set</li>
          <li><strong>Root Directory:</strong> For monorepo setups</li>
          <li><strong>Node.js Version:</strong> Runtime version</li>
        </ul>

        <h3>Build Settings</h3>
        <CodeBlock
          language="json"
          code={\`{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}\`}
          filename="Build Configuration"
        />

        <h3>Environment Variables</h3>
        <p>Set environment variables for different deployment environments:</p>
        <CodeBlock
          language="bash"
          code={\`# Production variables
NEXT_PUBLIC_API_URL=https://api.production.com
DATABASE_URL=postgresql://prod...

# Preview variables  
NEXT_PUBLIC_API_URL=https://api.staging.com
DATABASE_URL=postgresql://staging...\`}
          filename="Environment Variables"
        />

        <h2>Domains</h2>
        <p>Add custom domains to your project:</p>
        <CodeBlock
          language="text"
          code={\`# Production domains
yourdomain.com
www.yourdomain.com

# Branch-specific domains  
staging.yourdomain.com → staging branch
dev.yourdomain.com → develop branch\`}
          filename="Domain Configuration"
        />

        <h2>Team Collaboration</h2>
        <h3>Adding Team Members</h3>
        <p>Collaborate with your team:</p>
        <ul>
          <li><strong>Owner:</strong> Full access to project settings</li>
          <li><strong>Collaborator:</strong> Can deploy and view logs</li>
          <li><strong>Viewer:</strong> Read-only access</li>
        </ul>

        <h3>Git Integration</h3>
        <p>Configure Git workflow:</p>
        <ul>
          <li><strong>Production Branch:</strong> Usually main/master</li>
          <li><strong>Preview Branches:</strong> All other branches</li>
          <li><strong>Ignored Branches:</strong> Skip deployments</li>
        </ul>

        <h2>Project Monitoring</h2>
        <h3>Analytics</h3>
        <p>Monitor your project performance:</p>
        <ul>
          <li><strong>Page Views:</strong> Traffic analytics</li>
          <li><strong>Performance:</strong> Core Web Vitals</li>
          <li><strong>Geography:</strong> Visitor locations</li>
          <li><strong>Devices:</strong> Mobile vs desktop</li>
        </ul>

        <h3>Build Logs</h3>
        <p>Debug deployment issues:</p>
        <CodeBlock
          language="bash"
          code={\`# View latest build logs
webduh logs

# View specific deployment
webduh logs --url=your-deployment.webduh.app

# Follow real-time logs
webduh logs --follow\`}
          filename="Monitoring Commands"
        />
      </div>
    </DocPage>
  );
}`,
  },
  {
    path: 'apps/dashboard/app/docs/integrations/page.tsx',
    title: 'Integrations',
    content: `'use client';

import { DocPage } from '../components/DocPage';
import { CodeBlock } from '../components/CodeBlock';
import { FeatureComparison } from '../components/FeatureComparison';

export default function IntegrationsPage() {
  const integrationFeatures = [
    {
      name: 'GitHub Integration',
      webduh: true,
      vercel: true,
      netlify: true,
      description: 'Automatic deployments from GitHub repositories'
    },
    {
      name: 'GitLab Integration',
      webduh: true,
      vercel: true,
      netlify: 'Limited',
      description: 'Deploy from GitLab repositories'
    },
    {
      name: 'Bitbucket Integration',
      webduh: true,
      vercel: 'Limited',
      netlify: true,
      description: 'Connect Bitbucket repositories'
    },
    {
      name: 'Slack Notifications',
      webduh: true,
      vercel: true,
      netlify: true,
      description: 'Get notified about deployments'
    },
    {
      name: 'Discord Webhooks',
      webduh: true,
      vercel: false,
      netlify: 'Plugin',
      description: 'Send deployment updates to Discord'
    }
  ];

  return (
    <DocPage
      title="Integrations"
      description="Connect Webduh with your favorite tools and services for streamlined development workflows."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Integrations', href: '/docs/integrations' }
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Overview</h2>
        <p>
          Webduh integrates with popular development tools to streamline your workflow.
          Connect Git providers, monitoring services, and communication tools for a 
          seamless development experience.
        </p>

        <FeatureComparison 
          features={integrationFeatures}
          title="Integration Comparison"
          className="my-8"
        />

        <h2>Git Providers</h2>
        <h3>GitHub</h3>
        <p>Connect your GitHub repositories for automatic deployments:</p>
        <ol>
          <li>Install the Webduh GitHub App</li>
          <li>Select repositories to connect</li>
          <li>Configure branch protection rules</li>
          <li>Set up deployment environments</li>
        </ol>

        <CodeBlock
          language="bash"
          code={\`# Deploy from GitHub
git push origin main  # Triggers production deployment
git push origin feature-branch  # Creates preview deployment\`}
          filename="GitHub Integration"
        />

        <h3>GitLab</h3>
        <p>Deploy from GitLab repositories:</p>
        <CodeBlock
          language="yaml"
          code={\`# .gitlab-ci.yml
deploy:
  stage: deploy
  script:
    - npm install -g @webduh/cli
    - webduh --token=\$WEBDUH_TOKEN --prod
  only:
    - main\`}
          filename="GitLab CI/CD"
        />

        <h3>Bitbucket</h3>
        <p>Configure Bitbucket Pipelines:</p>
        <CodeBlock
          language="yaml"
          code={\`# bitbucket-pipelines.yml
pipelines:
  branches:
    main:
      - step:
          name: Deploy to Webduh
          script:
            - npm install -g @webduh/cli
            - webduh --token=\$WEBDUH_TOKEN --prod\`}
          filename="Bitbucket Pipelines"
        />

        <h2>Monitoring & Analytics</h2>
        <h3>Google Analytics</h3>
        <p>Track website analytics:</p>
        <CodeBlock
          language="javascript"
          code={\`// pages/_app.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as gtag from '../lib/gtag';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}\`}
          filename="Google Analytics Setup"
        />

        <h3>Sentry Error Tracking</h3>
        <p>Monitor errors in production:</p>
        <CodeBlock
          language="bash"
          code={\`# Install Sentry
npm install @sentry/nextjs

# Environment variables
SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project\`}
          filename="Sentry Integration"
        />

        <h2>Communication</h2>
        <h3>Slack Notifications</h3>
        <p>Get deployment notifications in Slack:</p>
        <CodeBlock
          language="json"
          code={\`{
  "webhooks": [
    {
      "url": "https://hooks.slack.com/services/...",
      "events": ["deployment.succeeded", "deployment.failed"]
    }
  ]
}\`}
          filename="Slack Webhook Configuration"
        />

        <h3>Discord Webhooks</h3>
        <p>Send updates to Discord channels:</p>
        <CodeBlock
          language="javascript"
          code={\`// api/webhook/discord.js
export default async function handler(req, res) {
  const { event, deployment } = req.body;
  
  const message = {
    content: \`🚀 Deployment \${event}: \${deployment.url}\`,
    embeds: [{
      title: deployment.meta.githubCommitMessage,
      color: event === 'succeeded' ? 0x00ff00 : 0xff0000,
      fields: [
        { name: 'Branch', value: deployment.meta.githubCommitRef },
        { name: 'Author', value: deployment.meta.githubCommitAuthorName }
      ]
    }]
  };

  await fetch(process.env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });

  res.status(200).json({ success: true });
}\`}
          filename="Discord Webhook"
        />

        <h2>Databases</h2>
        <h3>Vercel Postgres</h3>
        <p>Serverless PostgreSQL database:</p>
        <CodeBlock
          language="bash"
          code={\`# Install Vercel Postgres
npm install @vercel/postgres

# Environment variable
POSTGRES_URL=postgresql://...\`}
          filename="Vercel Postgres"
        />

        <h3>MongoDB Atlas</h3>
        <p>Cloud MongoDB database:</p>
        <CodeBlock
          language="javascript"
          code={\`// lib/mongodb.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export default async function connectToDatabase() {
  if (!client.isConnected()) {
    await client.connect();
  }
  return client.db('your-database');
}\`}
          filename="MongoDB Connection"
        />

        <h2>Authentication</h2>
        <h3>NextAuth.js</h3>
        <p>Authentication for Next.js applications:</p>
        <CodeBlock
          language="javascript"
          code={\`// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    }
  }
});\`}
          filename="NextAuth Configuration"
        />

        <h3>Auth0</h3>
        <p>Universal authentication platform:</p>
        <CodeBlock
          language="bash"
          code={\`# Install Auth0 SDK
npm install @auth0/nextjs-auth0

# Environment variables
AUTH0_SECRET=your-secret
AUTH0_BASE_URL=https://yourdomain.com
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret\`}
          filename="Auth0 Setup"
        />

        <h2>Content Management</h2>
        <h3>Contentful</h3>
        <p>Headless CMS integration:</p>
        <CodeBlock
          language="javascript"
          code={\`// lib/contentful.js
import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getEntries(contentType) {
  const entries = await client.getEntries({
    content_type: contentType
  });
  return entries.items;
}\`}
          filename="Contentful Integration"
        />

        <h2>Custom Integrations</h2>
        <p>Create custom integrations using webhooks and API endpoints:</p>
        <CodeBlock
          language="javascript"
          code={\`// api/integrations/custom.js
export default async function handler(req, res) {
  const { event, deployment } = req.body;
  
  // Custom integration logic
  if (event === 'deployment.succeeded') {
    await notifyCustomService(deployment);
  }
  
  res.status(200).json({ received: true });
}

async function notifyCustomService(deployment) {
  // Your custom notification logic
  console.log('Deployment succeeded:', deployment.url);
}\`}
          filename="Custom Integration"
        />
      </div>
    </DocPage>
  );
}`,
  },
  {
    path: 'apps/dashboard/app/docs/troubleshooting/page.tsx',
    title: 'Troubleshooting',
    content: `'use client';

import { DocPage } from '../components/DocPage';
import { CodeBlock } from '../components/CodeBlock';

export default function TroubleshootingPage() {
  return (
    <DocPage
      title="Troubleshooting"
      description="Common issues and solutions for Webduh deployments and development."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Troubleshooting', href: '/docs/troubleshooting' }
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Build Issues</h2>
        
        <h3>Build Command Failed</h3>
        <p>
          <strong>Problem:</strong> Your build command is failing during deployment.
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <ol>
          <li>Check that your build command is correct in your project settings</li>
          <li>Ensure all dependencies are listed in package.json</li>
          <li>Verify environment variables are set correctly</li>
        </ol>

        <CodeBlock
          language="json"
          code={\`{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "dev": "next dev"
  },
  "dependencies": {
    "next": "^13.0.0",
    "react": "^18.0.0"
  }
}\`}
          filename="package.json"
        />

        <h3>Out of Memory Error</h3>
        <p>
          <strong>Problem:</strong> Build fails with "JavaScript heap out of memory" error.
        </p>
        <p>
          <strong>Solution:</strong> Increase Node.js memory limit:
        </p>
        <CodeBlock
          language="json"
          code={\`{
  "scripts": {
    "build": "NODE_OPTIONS='--max_old_space_size=4096' next build"
  }
}\`}
          filename="Increase memory limit"
        />

        <h3>Module Not Found</h3>
        <p>
          <strong>Problem:</strong> Build fails with "Module not found" errors.
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <ul>
          <li>Check import paths are correct</li>
          <li>Ensure packages are installed: <code>npm install</code></li>
          <li>Check file case sensitivity on different operating systems</li>
        </ul>

        <CodeBlock
          language="javascript"
          code={\`// ❌ Wrong - case sensitive
import Component from './MyComponent';

// ✅ Correct - exact filename
import Component from './MyComponent.jsx';\`}
          filename="Case sensitivity fix"
        />

        <h2>Deployment Issues</h2>

        <h3>404 on Page Refresh</h3>
        <p>
          <strong>Problem:</strong> Single Page Application (SPA) returns 404 on page refresh.
        </p>
        <p>
          <strong>Solution:</strong> Configure rewrites in webduh.json:
        </p>
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
          filename="SPA rewrites"
        />

        <h3>Environment Variables Not Working</h3>
        <p>
          <strong>Problem:</strong> Environment variables are undefined in your application.
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <ul>
          <li>Ensure variables are set in project settings</li>
          <li>Use <code>NEXT_PUBLIC_</code> prefix for client-side variables</li>
          <li>Restart your development server after changes</li>
        </ul>

        <CodeBlock
          language="bash"
          code={\`# ❌ Not accessible in browser
API_URL=https://api.example.com

# ✅ Accessible in browser  
NEXT_PUBLIC_API_URL=https://api.example.com\`}
          filename="Environment variables"
        />

        <h3>Slow Build Times</h3>
        <p>
          <strong>Problem:</strong> Builds are taking too long to complete.
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <ul>
          <li>Enable build caching (enabled by default)</li>
          <li>Optimize dependencies and bundle size</li>
          <li>Use incremental builds when possible</li>
        </ul>

        <CodeBlock
          language="json"
          code={\`{
  "experimental": {
    "incrementalCacheHandlerPath": "./cache-handler.js"
  }
}\`}
          filename="next.config.js"
        />

        <h2>Domain Issues</h2>

        <h3>Domain Not Working</h3>
        <p>
          <strong>Problem:</strong> Custom domain is not resolving correctly.
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <ol>
          <li>Check DNS configuration</li>
          <li>Verify domain is added to project</li>
          <li>Wait for DNS propagation (up to 48 hours)</li>
        </ol>

        <CodeBlock
          language="text"
          code={\`# DNS Configuration
CNAME   www      your-project.webduh.app
A       @        76.76.19.19\`}
          filename="DNS Records"
        />

        <h3>SSL Certificate Issues</h3>
        <p>
          <strong>Problem:</strong> SSL certificate is not working for your domain.
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <ul>
          <li>Wait for automatic certificate provisioning</li>
          <li>Check domain validation records</li>
          <li>Contact support if issues persist</li>
        </ul>

        <h2>Performance Issues</h2>

        <h3>Slow Page Load Times</h3>
        <p>
          <strong>Problem:</strong> Pages are loading slowly.
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <ul>
          <li>Optimize images with next/image</li>
          <li>Enable code splitting</li>
          <li>Use CDN for static assets</li>
          <li>Implement proper caching headers</li>
        </ul>

        <CodeBlock
          language="javascript"
          code={\`// Optimize images
import Image from 'next/image';

function MyComponent() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={800}
      height={600}
      priority
    />
  );
}\`}
          filename="Image optimization"
        />

        <h3>Large Bundle Size</h3>
        <p>
          <strong>Problem:</strong> JavaScript bundle is too large.
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <ul>
          <li>Analyze bundle with webpack-bundle-analyzer</li>
          <li>Use dynamic imports for code splitting</li>
          <li>Remove unused dependencies</li>
        </ul>

        <CodeBlock
          language="javascript"
          code={\`// Dynamic imports for code splitting
const LazyComponent = dynamic(() => import('./LazyComponent'), {
  loading: () => <p>Loading...</p>,
});

// Tree shake unused exports
import { specificFunction } from 'large-library';\`}
          filename="Bundle optimization"
        />

        <h2>API and Function Issues</h2>

        <h3>Function Timeout</h3>
        <p>
          <strong>Problem:</strong> Serverless functions are timing out.
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <ul>
          <li>Optimize function code</li>
          <li>Increase timeout limit (max 30s)</li>
          <li>Use streaming for long operations</li>
        </ul>

        <CodeBlock
          language="json"
          code={\`{
  "functions": {
    "pages/api/**/*.js": {
      "maxDuration": 30
    }
  }
}\`}
          filename="Function timeout"
        />

        <h3>CORS Issues</h3>
        <p>
          <strong>Problem:</strong> Cross-origin requests are being blocked.
        </p>
        <p>
          <strong>Solution:</strong> Configure CORS headers:
        </p>
        <CodeBlock
          language="javascript"
          code={\`// pages/api/example.js
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Your API logic here
  res.status(200).json({ message: 'Hello World' });
}\`}
          filename="CORS configuration"
        />

        <h2>Getting Help</h2>
        <p>If you're still experiencing issues after trying these solutions:</p>
        <ul>
          <li><strong>Check build logs:</strong> Look for specific error messages</li>
          <li><strong>Search documentation:</strong> Use the search function to find relevant guides</li>
          <li><strong>Community support:</strong> Join our Discord community</li>
          <li><strong>Contact support:</strong> Reach out through the dashboard</li>
        </ul>

        <CodeBlock
          language="bash"
          code={\`# Useful debugging commands
webduh logs                    # View deployment logs
webduh ls                      # List deployments
webduh inspect URL             # Get deployment details
webduh --debug                 # Enable debug mode\`}
          filename="Debug commands"
        />
      </div>
    </DocPage>
  );
}`,
  },
];

// Create each essential page
console.log('🚀 Creating additional essential documentation pages...\n');

essentialPages.forEach((page) => {
  const dir = path.dirname(page.path);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write the file
  fs.writeFileSync(page.path, page.content);
  console.log(`✅ Created ${page.title} at ${page.path}`);
});

console.log(
  '\n🎉 Additional essential documentation pages created successfully!',
);
console.log('\n📋 Summary:');
console.log(`   • ${essentialPages.length} essential documentation pages`);
console.log('   • Projects management guide');
console.log('   • Comprehensive integrations guide');
console.log('   • Complete troubleshooting guide');
console.log('\n🚀 Ready to run: npm run dev');
