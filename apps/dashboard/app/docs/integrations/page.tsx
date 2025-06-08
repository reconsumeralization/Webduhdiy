'use client';

// TODO: confirm version & license.
import React from 'react';
// TODO: confirm version & license.
import Link from 'next/link';

/* ---- embedded utilities ---- */
// DocPage component stub for self-containment
type DocPageProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  children: React.ReactNode;
};

function DocPage({ title, description, breadcrumbs, children }: DocPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          {breadcrumbs && (
            <nav className="mb-4">
              <ol className="flex space-x-2 text-sm text-gray-600 dark:text-gray-400">
                {breadcrumbs.map((item, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2">/</span>}
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="hover:text-gray-900 dark:hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-gray-900 dark:text-white">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </header>
        <main className="prose prose-gray dark:prose-invert max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
}

// CodeBlock component stub for self-containment
type CodeBlockProps = {
  language?: string;
  filename?: string;
  children: string;
};

function CodeBlock({ language = 'text', filename, children }: CodeBlockProps) {
  return (
    <div className="my-4">
      {filename && (
        <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm rounded-t-lg border-b border-gray-700">
          {filename}
        </div>
      )}
      <pre
        className={`bg-gray-900 text-gray-100 p-4 rounded-${filename ? 'b' : ''}-lg overflow-x-auto`}
      >
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  );
}
/* ---- end embedded utilities ---- */
import { FeatureComparison } from '../components/FeatureComparison';

export default function IntegrationsPage() {
  const integrationFeatures = [
    {
      name: 'GitHub Integration',
      webduh: true,
      vercel: true,
      netlify: true,
      description: 'Automatic deployments from GitHub repositories',
    },
    {
      name: 'GitLab Integration',
      webduh: true,
      vercel: true,
      netlify: 'Limited',
      description: 'Deploy from GitLab repositories',
    },
    {
      name: 'Bitbucket Integration',
      webduh: true,
      vercel: 'Limited',
      netlify: true,
      description: 'Connect Bitbucket repositories',
    },
    {
      name: 'Slack Notifications',
      webduh: true,
      vercel: true,
      netlify: true,
      description: 'Get notified about deployments',
    },
    {
      name: 'Discord Webhooks',
      webduh: true,
      vercel: false,
      netlify: 'Plugin',
      description: 'Send deployment updates to Discord',
    },
  ];

  return (
    <DocPage
      title="Integrations"
      description="Connect Webduh with your favorite tools and services for streamlined development workflows."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Integrations', href: '/docs/integrations' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Overview</h2>
        <p>
          Webduh integrates with popular development tools to streamline your
          workflow. Connect Git providers, monitoring services, and
          communication tools for a seamless development experience.
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
          filename="GitHub Integration"
        >{`# Deploy from GitHub
git push origin main  # Triggers production deployment
git push origin feature-branch  # Creates preview deployment`}</CodeBlock>

        <h3>GitLab</h3>
        <p>Deploy from GitLab repositories:</p>
        <CodeBlock language="yaml" filename="GitLab CI/CD">{`# .gitlab-ci.yml
deploy:
  stage: deploy
  script:
    - npm install -g @webduh/cli
    - webduh --token=$WEBDUH_TOKEN --prod
  only:
    - main`}</CodeBlock>

        <h3>Bitbucket</h3>
        <p>Configure Bitbucket Pipelines:</p>
        <CodeBlock
          language="yaml"
          filename="Bitbucket Pipelines"
        >{`# bitbucket-pipelines.yml
pipelines:
  branches:
    main:
      - step:
          name: Deploy to Webduh
          script:
            - npm install -g @webduh/cli
            - webduh --token=$WEBDUH_TOKEN --prod`}</CodeBlock>

        <h2>Monitoring & Analytics</h2>
        <h3>Google Analytics</h3>
        <p>Track website analytics:</p>
        <CodeBlock
          language="javascript"
          filename="Google Analytics Setup"
        >{`// pages/_app.js
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
}`}</CodeBlock>

        <h3>Sentry Error Tracking</h3>
        <p>Monitor errors in production:</p>
        <CodeBlock
          language="bash"
          filename="Sentry Integration"
        >{`# Install Sentry
npm install @sentry/nextjs

# Environment variables
SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project`}</CodeBlock>

        <h2>Communication</h2>
        <h3>Slack Notifications</h3>
        <p>Get deployment notifications in Slack:</p>
        <CodeBlock language="json" filename="Slack Webhook Configuration">{`{
  "webhooks": [
    {
      "url": "https://hooks.slack.com/services/...",
      "events": ["deployment.succeeded", "deployment.failed"]
    }
  ]
}`}</CodeBlock>

        <h3>Discord Webhooks</h3>
        <p>Send updates to Discord channels:</p>
        <CodeBlock
          language="javascript"
          filename="Discord Webhook"
        >{`// api/webhook/discord.js
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
}`}</CodeBlock>

        <h2>Databases</h2>
        <h3>Vercel Postgres</h3>
        <p>Serverless PostgreSQL database:</p>
        <CodeBlock
          language="bash"
          filename="Vercel Postgres"
        >{`# Install Vercel Postgres
npm install @vercel/postgres

# Environment variable
POSTGRES_URL=postgresql://...`}</CodeBlock>

        <h3>MongoDB Atlas</h3>
        <p>Cloud MongoDB database:</p>
        <CodeBlock
          language="javascript"
          filename="MongoDB Connection"
        >{`// lib/mongodb.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export default async function connectToDatabase() {
  if (!client.isConnected()) {
    await client.connect();
  }
  return client.db('your-database');
}`}</CodeBlock>

        <h2>Authentication</h2>
        <h3>NextAuth.js</h3>
        <p>Authentication for Next.js applications:</p>
        <CodeBlock
          language="javascript"
          filename="NextAuth Configuration"
        >{`// pages/api/auth/[...nextauth].js
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
});`}</CodeBlock>

        <h3>Auth0</h3>
        <p>Universal authentication platform:</p>
        <CodeBlock language="bash" filename="Auth0 Setup">{`# Install Auth0 SDK
npm install @auth0/nextjs-auth0

# Environment variables
AUTH0_SECRET=your-secret
AUTH0_BASE_URL=https://yourdomain.com
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret`}</CodeBlock>

        <h2>Content Management</h2>
        <h3>Contentful</h3>
        <p>Headless CMS integration:</p>
        <CodeBlock
          language="javascript"
          filename="Contentful Integration"
        >{`// lib/contentful.js
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
}`}</CodeBlock>

        <h2>Custom Integrations</h2>
        <p>Create custom integrations using webhooks and API endpoints:</p>
        <CodeBlock
          language="javascript"
          filename="Custom Integration"
        >{`// api/integrations/custom.js
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
}`}</CodeBlock>
      </div>
    </DocPage>
  );
}
