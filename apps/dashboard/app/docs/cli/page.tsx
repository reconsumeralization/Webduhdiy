'use client';

import DocPage from '../components/DocPage';
import CodeBlock, { InlineCode } from '../components/CodeBlock';

export default function CLIPage() {
  return (
    <DocPage
      title="webduh CLI"
      description="Command-line interface for deploying and managing your webduh projects. Deploy, configure, and monitor your applications from the terminal."
    >
      <div className="space-y-8">
        <div>
          <h2 id="overview">Overview</h2>
          <p>
            The webduh CLI is a powerful command-line tool that enables you to
            deploy and manage your projects directly from your terminal. It
            provides all the functionality of the web dashboard plus advanced
            automation capabilities.
          </p>
        </div>

        <div>
          <h2 id="installation">Installation</h2>
          <p>Install the webduh CLI globally using npm, yarn, or pnpm:</p>

          <CodeBlock language="bash" filename="Install webduh CLI">
            {`# Using npm
npm install -g webduh

# Using yarn
yarn global add webduh

# Using pnpm
pnpm add -g webduh

# Verify installation
webduh --version`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="authentication">Authentication</h2>
          <p>Authenticate with your webduh account to start deploying:</p>

          <CodeBlock language="bash">
            {`# Login with browser (recommended)
webduh login

# Login with token
webduh login --token YOUR_ACCESS_TOKEN

# Check current user
webduh whoami

# Logout
webduh logout`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="deploy-command">Deploy Command</h2>
          <p>The deploy command is the most frequently used CLI command:</p>

          <CodeBlock language="bash">
            {`# Deploy current directory
webduh deploy

# Deploy with custom project name
webduh deploy --name my-awesome-app

# Deploy with environment variables
webduh deploy --env NODE_ENV=production --env API_URL=https://api.prod.com

# Deploy with custom build command
webduh deploy --build-command "npm run build:prod"`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="project-management">Project Management</h2>
          <p>Manage your projects and deployments:</p>

          <CodeBlock language="bash">
            {`# List all projects
webduh projects list

# Get project details
webduh projects inspect my-project

# Delete project
webduh projects remove my-project

# List deployments
webduh deployments list

# Rollback to previous deployment
webduh rollback`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="environment-variables">Environment Variables</h2>
          <p>Manage environment variables for your projects:</p>

          <CodeBlock language="bash">
            {`# List environment variables
webduh env list

# Add environment variable
webduh env add DATABASE_URL=postgresql://...

# Add multiple variables
webduh env add API_KEY=secret123 DEBUG=true

# Remove environment variable
webduh env remove DATABASE_URL`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="domains">Domain Management</h2>
          <p>Manage custom domains for your projects:</p>

          <CodeBlock language="bash">
            {`# Add domain
webduh domains add example.com

# List domains
webduh domains list

# Remove domain
webduh domains remove example.com

# Check SSL status
webduh ssl status example.com`}
          </CodeBlock>
        </div>
      </div>
    </DocPage>
  );
}
