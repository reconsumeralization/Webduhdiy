'use client';

import DocPage from '../components/DocPage';
import CodeBlock, { InlineCode } from '../components/CodeBlock';

export default function FeatureFlagsPage() {
  return (
    <DocPage
      title="Feature Flags"
      description="Control the rollout of new features in your webduh projects. Use feature flags to enable, disable, or gradually release features to users without redeploying."
    >
      <div className="space-y-8">
        <div>
          <h2 id="overview">Overview</h2>
          <p>
            Feature flags (also known as feature toggles) let you turn features
            on or off for different users, environments, or segments. This
            enables safer deployments, A/B testing, and progressive rollouts.
          </p>
        </div>

        <div>
          <h2 id="quick-start">Quick Start</h2>
          <p>Add a feature flag to your project:</p>
          <CodeBlock language="bash">
            {`# Add a new feature flag
webduh feature-flag add enable-new-dashboard

# List all feature flags
webduh feature-flag list

# Enable a flag for production
webduh feature-flag enable enable-new-dashboard --env=production
`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="usage">Using Feature Flags in Code</h2>
          <p>
            Access feature flags in your application code using environment
            variables or the webduh SDK:
          </p>
          <CodeBlock language="javascript" filename="app/page.tsx">
            {`import { useFeatureFlag } from 'webduh/sdk'

export default function Page() {
  const isEnabled = useFeatureFlag('enable-new-dashboard')
  return isEnabled ? <NewDashboard /> : <OldDashboard />
}
`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="best-practices">Best Practices</h2>
          <ul>
            <li>Remove unused flags to keep your codebase clean.</li>
            <li>Use flags for gradual rollouts and quick rollbacks.</li>
            <li>Document the purpose of each flag.</li>
          </ul>
        </div>
      </div>
    </DocPage>
  );
}
