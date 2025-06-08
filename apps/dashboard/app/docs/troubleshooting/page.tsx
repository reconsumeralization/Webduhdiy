'use client';

import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';

export default function TroubleshootingPage() {
  return (
    <DocPage
      title="Troubleshooting"
      description="Common issues and solutions for Webduh deployments and development."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Troubleshooting', href: '/docs/troubleshooting' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Build Issues</h2>

        <h3>Build Command Failed</h3>
        <p>
          <strong>Problem:</strong> Your build command is failing during
          deployment.
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <ol>
          <li>
            Check that your build command is correct in your project settings
          </li>
          <li>Ensure all dependencies are listed in package.json</li>
          <li>Verify environment variables are set correctly</li>
        </ol>

        <CodeBlock language="json" filename="package.json">
          {`{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "dev": "next dev"
  },
  "dependencies": {
    "next": "^13.0.0",
    "react": "^18.0.0"
  }
}`}
        </CodeBlock>

        <h3>Out of Memory Error</h3>
        <p>
          <strong>Problem:</strong> Build fails with "JavaScript heap out of
          memory" error.
        </p>
        <p>
          <strong>Solution:</strong> Increase Node.js memory limit:
        </p>
        <CodeBlock language="json" filename="Increase memory limit">
          {`{
  "scripts": {
    "build": "NODE_OPTIONS='--max_old_space_size=4096' next build"
  }
}`}
        </CodeBlock>

        <h3>Module Not Found</h3>
        <p>
          <strong>Problem:</strong> Build fails with "Module not found" errors.
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <ul>
          <li>Check import paths are correct</li>
          <li>
            Ensure packages are installed: <code>npm install</code>
          </li>
          <li>Check file case sensitivity on different operating systems</li>
        </ul>

        <CodeBlock language="javascript" filename="Case sensitivity fix">
          {`// ❌ Wrong - case sensitive
import Component from './MyComponent';

// ✅ Correct - exact filename
import Component from './MyComponent.jsx';`}
        </CodeBlock>

        <h2>Deployment Issues</h2>

        <h3>404 on Page Refresh</h3>
        <p>
          <strong>Problem:</strong> Single Page Application (SPA) returns 404 on
          page refresh.
        </p>
        <p>
          <strong>Solution:</strong> Configure rewrites in webduh.json:
        </p>
        <CodeBlock language="json" filename="SPA rewrites">
          {`{
  "rewrites": [
    {
      "source": "/((?!api/.*).*)",
      "destination": "/index.html"
    }
  ]
}`}
        </CodeBlock>

        <h3>Environment Variables Not Working</h3>
        <p>
          <strong>Problem:</strong> Environment variables are undefined in your
          application.
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <ul>
          <li>Ensure variables are set in project settings</li>
          <li>
            Use <code>NEXT_PUBLIC_</code> prefix for client-side variables
          </li>
          <li>Restart your development server after changes</li>
        </ul>

        <CodeBlock language="bash" filename="Environment variables">
          {`# ❌ Not accessible in browser
API_URL=https://api.example.com

# ✅ Accessible in browser  
NEXT_PUBLIC_API_URL=https://api.example.com`}
        </CodeBlock>

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

        <CodeBlock language="json" filename="next.config.js">
          {`{
  "experimental": {
    "incrementalCacheHandlerPath": "./cache-handler.js"
  }
}`}
        </CodeBlock>

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

        <CodeBlock language="text" filename="DNS Records">
          {`# DNS Configuration
CNAME   www      your-project.webduh.app
A       @        76.76.19.19`}
        </CodeBlock>

        <h3>SSL Certificate Issues</h3>
        <p>
          <strong>Problem:</strong> SSL certificate is not working for your
          domain.
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

        <CodeBlock language="javascript" filename="Image optimization">
          {`// Optimize images
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
}`}
        </CodeBlock>

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

        <CodeBlock language="javascript" filename="Bundle optimization">
          {`// Dynamic imports for code splitting
const LazyComponent = dynamic(() => import('./LazyComponent'), {
  loading: () => <p>Loading...</p>,
});

// Tree shake unused exports
import { specificFunction } from 'large-library';`}
        </CodeBlock>

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

        <CodeBlock language="json" filename="Function timeout">
          {`{
  "functions": {
    "pages/api/**/*.js": {
      "maxDuration": 30
    }
  }
}`}
        </CodeBlock>

        <h3>CORS Issues</h3>
        <p>
          <strong>Problem:</strong> Cross-origin requests are being blocked.
        </p>
        <p>
          <strong>Solution:</strong> Configure CORS headers:
        </p>
        <CodeBlock language="javascript" filename="CORS configuration">
          {`// pages/api/example.js
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
}`}
        </CodeBlock>

        <h2>Getting Help</h2>
        <p>If you're still experiencing issues after trying these solutions:</p>
        <ul>
          <li>
            <strong>Check build logs:</strong> Look for specific error messages
          </li>
          <li>
            <strong>Search documentation:</strong> Use the search function to
            find relevant guides
          </li>
          <li>
            <strong>Community support:</strong> Join our Discord community
          </li>
          <li>
            <strong>Contact support:</strong> Reach out through the dashboard
          </li>
        </ul>

        <CodeBlock language="bash" filename="Debug commands">
          {`# Useful debugging commands
webduh logs                    # View deployment logs
webduh ls                      # List deployments
webduh inspect URL             # Get deployment details
webduh --debug                 # Enable debug mode`}
        </CodeBlock>
      </div>
    </DocPage>
  );
}
