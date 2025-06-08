'use client';

import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';

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
            Every git push to your connected repository triggers a new
            deployment on webduh. Get instant previews, zero-downtime
            deployments, and easy rollbacks.
          </p>
        </div>

        <div>
          <h2 id="preview-deployments">Preview Deployments</h2>
          <p>Every branch and pull request gets its own preview URL:</p>

          <CodeBlock language="bash">
            {`# Each branch gets a unique URL
feature-branch → https://feature-branch-abc123.webduh.app
staging → https://staging-def456.webduh.app

# Pull requests get preview URLs
PR #123 → https://pr-123-ghi789.webduh.app`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="production-deployments">Production Deployments</h2>
          <p>Deploy to production from your main branch:</p>

          <CodeBlock language="bash">
            {`# Automatic production deployment
git push origin main

# Manual production promotion
webduh deployments promote deployment-id`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="rollbacks">Rollbacks</h2>
          <p>Instantly rollback to any previous deployment:</p>

          <CodeBlock language="bash">
            {`# Rollback to previous deployment
webduh rollback

# Rollback to specific deployment
webduh rollback deployment-abc123`}
          </CodeBlock>
        </div>
      </div>
    </DocPage>
  );
}
