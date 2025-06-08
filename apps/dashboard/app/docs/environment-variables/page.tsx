'use client';

import DocPage from '../components/DocPage';
import CodeBlock, { InlineCode } from '../components/CodeBlock';

export default function EnvironmentVariablesPage() {
  return (
    <DocPage
      title="Environment Variables"
      description="Manage environment variables and secrets for your webduh projects. Secure configuration management with support for multiple environments."
    >
      <div className="space-y-8">
        <div>
          <h2 id="overview">Overview</h2>
          <p>
            Environment variables allow you to store configuration values and
            secrets outside of your code. webduh provides secure environment
            variable management with support for different environments and
            scopes.
          </p>
        </div>

        <div>
          <h2 id="quick-start">Quick Start</h2>
          <p>Add environment variables to your project:</p>

          <CodeBlock language="bash">
            {`# Add a single environment variable
webduh env add DATABASE_URL=postgresql://user:pass@host:port/db

# Add multiple variables at once
webduh env add API_KEY=secret123 DEBUG=true NODE_ENV=production

# List all environment variables
webduh env list`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="environment-types">Environment Types</h2>
          <p>webduh supports different environment scopes:</p>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Production
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Variables for your live production deployments.
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Preview
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Variables for preview deployments and staging.
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Development
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Variables for local development and testing.
              </p>
            </div>
          </div>

          <CodeBlock language="bash">
            {`# Add variables to specific environments
webduh env add DATABASE_URL=prod_db_url --env production
webduh env add DATABASE_URL=staging_db_url --env preview
webduh env add DATABASE_URL=dev_db_url --env development

# List variables for specific environment
webduh env list --env production`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="framework-specific">Framework-Specific Variables</h2>

          <h3>Next.js</h3>
          <p>Next.js supports different types of environment variables:</p>

          <CodeBlock language="bash" filename=".env.local">
            {`# Server-side only (secure)
DATABASE_URL=postgresql://...
API_SECRET_KEY=your-secret-key

# Client-side (public, prefixed with NEXT_PUBLIC_)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ANALYTICS_ID=ga-123456789`}
          </CodeBlock>

          <h3>React/Vite</h3>
          <CodeBlock language="bash" filename=".env">
            {`# Vite variables (prefixed with VITE_)
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My Awesome App`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="bulk-operations">Bulk Operations</h2>
          <p>Manage multiple environment variables efficiently:</p>

          <CodeBlock language="bash">
            {`# Import from .env file
webduh env add --from-file .env.production

# Export to file
webduh env export --to-file backup.env

# Copy variables between environments
webduh env copy --from development --to staging

# Clear all variables (use with caution)
webduh env clear --env development`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="security">Security Best Practices</h2>

          <ul>
            <li>
              <strong>Never commit secrets:</strong> Use .env files and add them
              to .gitignore
            </li>
            <li>
              <strong>Use different keys per environment:</strong> Separate
              production and development secrets
            </li>
            <li>
              <strong>Rotate secrets regularly:</strong> Update API keys and
              passwords periodically
            </li>
            <li>
              <strong>Limit access:</strong> Only give team members access to
              necessary environments
            </li>
          </ul>

          <CodeBlock language="bash" filename=".gitignore">
            {`# Environment files
.env
.env.local
.env.production
.env.staging

# Secret files
secrets.json
config/secrets.yml`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="accessing-variables">Accessing Variables in Code</h2>

          <h3>Node.js/Next.js</h3>
          <CodeBlock language="javascript">
            {`// Server-side access
const dbUrl = process.env.DATABASE_URL
const apiKey = process.env.API_SECRET_KEY

// Client-side access (Next.js)
const publicApiUrl = process.env.NEXT_PUBLIC_API_URL`}
          </CodeBlock>

          <h3>React/Vite</h3>
          <CodeBlock language="javascript">
            {`// Vite environment variables
const apiUrl = import.meta.env.VITE_API_URL
const appTitle = import.meta.env.VITE_APP_TITLE`}
          </CodeBlock>
        </div>
      </div>
    </DocPage>
  );
}
