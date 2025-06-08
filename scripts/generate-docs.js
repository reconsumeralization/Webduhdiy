#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// All the documentation URLs and their metadata
const docsStructure = [
  {
    text: 'Getting Started',
    href: 'https://webduh.com/docs/getting-started-with-webduh',
  },
  {
    text: 'Projects and Deployments',
    href: 'https://webduh.com/docs/getting-started-with-webduh/projects-deployments',
  },
  {
    text: 'Use a Template',
    href: 'https://webduh.com/docs/getting-started-with-webduh/template',
  },
  {
    text: 'Import Existing Project',
    href: 'https://webduh.com/docs/getting-started-with-webduh/import',
  },
  {
    text: 'Add a Domain',
    href: 'https://webduh.com/docs/getting-started-with-webduh/domains',
  },
  {
    text: 'Buy a Domain',
    href: 'https://webduh.com/docs/getting-started-with-webduh/buy-domain',
  },
  {
    text: 'Transfer an Existing Domain',
    href: 'https://webduh.com/docs/getting-started-with-webduh/use-existing',
  },
  {
    text: 'Collaborate',
    href: 'https://webduh.com/docs/getting-started-with-webduh/collaborate',
  },
  {
    text: 'Next Steps',
    href: 'https://webduh.com/docs/getting-started-with-webduh/next-steps',
  },
  {
    text: 'Supported Frameworks',
    href: 'https://webduh.com/docs/frameworks',
  },
  {
    text: 'Next.js',
    href: 'https://webduh.com/docs/frameworks/nextjs',
  },
  {
    text: 'SvelteKit',
    href: 'https://webduh.com/docs/frameworks/sveltekit',
  },
  {
    text: 'Astro',
    href: 'https://webduh.com/docs/frameworks/astro',
  },
  {
    text: 'Nuxt',
    href: 'https://webduh.com/docs/frameworks/nuxt',
  },
  {
    text: 'Vite',
    href: 'https://webduh.com/docs/frameworks/vite',
  },
  {
    text: 'React Router',
    href: 'https://webduh.com/docs/frameworks/react-router',
  },
  {
    text: 'Remix',
    href: 'https://webduh.com/docs/frameworks/remix',
  },
  {
    text: 'Gatsby',
    href: 'https://webduh.com/docs/frameworks/gatsby',
  },
  {
    text: 'Create React App',
    href: 'https://webduh.com/docs/frameworks/create-react-app',
  },
  {
    text: 'All Frameworks',
    href: 'https://webduh.com/docs/frameworks/more-frameworks',
  },
  {
    text: 'Incremental Migration',
    href: 'https://webduh.com/docs/incremental-migration',
  },
  {
    text: 'Migration Guide',
    href: 'https://webduh.com/docs/incremental-migration/migration-guide',
  },
  {
    text: 'Technical Guidelines',
    href: 'https://webduh.com/docs/incremental-migration/technical-guidelines',
  },
  {
    text: 'Production Checklist',
    href: 'https://webduh.com/docs/production-checklist',
  },
  {
    text: 'Account Management',
    href: 'https://webduh.com/docs/accounts',
  },
  {
    text: 'Activity Log',
    href: 'https://webduh.com/docs/activity-log',
  },
  {
    text: 'Deployment Protection',
    href: 'https://webduh.com/docs/deployment-protection',
  },
  {
    text: 'Bypass Deployment Protection',
    href: 'https://webduh.com/docs/deployment-protection/methods-to-bypass-deployment-protection',
  },
  {
    text: 'Directory Sync',
    href: 'https://webduh.com/docs/directory-sync',
  },
  {
    text: 'SAML SSO',
    href: 'https://webduh.com/docs/saml',
  },
  {
    text: 'Two-factor (2FA)',
    href: 'https://webduh.com/docs/two-factor-authentication',
  },
  {
    text: 'REST API',
    href: 'https://webduh.com/docs/rest-api',
  },
  {
    text: 'webduh SDK',
    href: 'https://webduh.com/docs/sdk',
  },
  {
    text: 'Builds',
    href: 'https://webduh.com/docs/builds',
  },
  {
    text: 'Build Features',
    href: 'https://webduh.com/docs/builds/build-features',
  },
  {
    text: 'Build Image',
    href: 'https://webduh.com/docs/builds/build-image',
  },
  {
    text: 'Build Queues',
    href: 'https://webduh.com/docs/builds/build-queues',
  },
  {
    text: 'Configuring a Build',
    href: 'https://webduh.com/docs/builds/configure-a-build',
  },
  {
    text: 'Managing Builds',
    href: 'https://webduh.com/docs/builds/managing-builds',
  },
  {
    text: 'Deploy Hooks',
    href: 'https://webduh.com/docs/deploy-hooks',
  },
  {
    text: 'Deployment Retention',
    href: 'https://webduh.com/docs/deployment-retention',
  },
  {
    text: 'Deployments',
    href: 'https://webduh.com/docs/deployments',
  },
  {
    text: 'Environments',
    href: 'https://webduh.com/docs/deployments/environments',
  },
  {
    text: 'Generated URLs',
    href: 'https://webduh.com/docs/deployments/generated-urls',
  },
  {
    text: 'Managing Deployments',
    href: 'https://webduh.com/docs/deployments/managing-deployments',
  },
  {
    text: 'Environment Variables',
    href: 'https://webduh.com/docs/environment-variables',
  },
  {
    text: 'Framework Environment Variables',
    href: 'https://webduh.com/docs/environment-variables/framework-environment-variables',
  },
  {
    text: 'Git Integrations',
    href: 'https://webduh.com/docs/git',
  },
  {
    text: 'GitHub',
    href: 'https://webduh.com/docs/git/webduh-for-github',
  },
  {
    text: 'Azure DevOps',
    href: 'https://webduh.com/docs/git/webduh-for-azure-pipelines',
  },
  {
    text: 'Bitbucket',
    href: 'https://webduh.com/docs/git/webduh-for-bitbucket',
  },
  {
    text: 'GitLab',
    href: 'https://webduh.com/docs/git/webduh-for-gitlab',
  },
  {
    text: 'Instant Rollback',
    href: 'https://webduh.com/docs/instant-rollback',
  },
  {
    text: 'Monorepos',
    href: 'https://webduh.com/docs/monorepos',
  },
  {
    text: 'Turborepo',
    href: 'https://webduh.com/docs/monorepos/turborepo',
  },
  {
    text: 'Remote Caching',
    href: 'https://webduh.com/docs/monorepos/remote-caching',
  },
  {
    text: 'Nx',
    href: 'https://webduh.com/docs/monorepos/nx',
  },
  {
    text: 'Package Managers',
    href: 'https://webduh.com/docs/package-managers',
  },
  {
    text: 'Webhooks',
    href: 'https://webduh.com/docs/webhooks',
  },
  {
    text: 'Domains',
    href: 'https://webduh.com/docs/domains',
  },
  {
    text: 'Working with Domains',
    href: 'https://webduh.com/docs/domains/working-with-domains',
  },
  {
    text: 'Adding a Domain',
    href: 'https://webduh.com/docs/domains/working-with-domains/add-a-domain',
  },
  {
    text: 'Deploying & Redirecting Domains',
    href: 'https://webduh.com/docs/domains/working-with-domains/deploying-and-redirecting',
  },
  {
    text: 'Working with DNS',
    href: 'https://webduh.com/docs/domains/working-with-dns',
  },
  {
    text: 'Managing DNS Records',
    href: 'https://webduh.com/docs/domains/managing-dns-records',
  },
  {
    text: 'Working with SSL',
    href: 'https://webduh.com/docs/domains/working-with-ssl',
  },
  {
    text: 'Edge Network',
    href: 'https://webduh.com/docs/edge-network',
  },
  {
    text: 'Regions',
    href: 'https://webduh.com/docs/edge-network/regions',
  },
  {
    text: 'Compression',
    href: 'https://webduh.com/docs/edge-network/compression',
  },
  {
    text: 'Headers',
    href: 'https://webduh.com/docs/headers',
  },
  {
    text: 'Security Headers',
    href: 'https://webduh.com/docs/headers/security-headers',
  },
  {
    text: 'Image Optimization',
    href: 'https://webduh.com/docs/image-optimization',
  },
  {
    text: 'Getting Started',
    href: 'https://webduh.com/docs/image-optimization/quickstart',
  },
  {
    text: 'Redirects',
    href: 'https://webduh.com/docs/redirects',
  },
  {
    text: 'Rewrites',
    href: 'https://webduh.com/docs/rewrites',
  },
  {
    text: 'Comments',
    href: 'https://webduh.com/docs/comments',
  },
  {
    text: 'Feature Flags',
    href: 'https://webduh.com/docs/feature-flags',
  },
  {
    text: 'Toolbar',
    href: 'https://webduh.com/docs/webduh-toolbar',
  },
  {
    text: 'Cron Jobs',
    href: 'https://webduh.com/docs/cron-jobs',
  },
  {
    text: 'Getting Started',
    href: 'https://webduh.com/docs/cron-jobs/quickstart',
  },
  {
    text: 'Functions',
    href: 'https://webduh.com/docs/functions',
  },
  {
    text: 'Getting Started',
    href: 'https://webduh.com/docs/functions/quickstart',
  },
  {
    text: 'Streaming',
    href: 'https://webduh.com/docs/functions/streaming-functions',
  },
  {
    text: 'Runtimes',
    href: 'https://webduh.com/docs/functions/runtimes',
  },
  {
    text: 'Node.js',
    href: 'https://webduh.com/docs/functions/runtimes/node-js',
  },
  {
    text: 'Python',
    href: 'https://webduh.com/docs/functions/runtimes/python',
  },
  {
    text: 'Edge Runtime',
    href: 'https://webduh.com/docs/functions/runtimes/edge',
  },
  {
    text: 'Configuring Functions',
    href: 'https://webduh.com/docs/functions/configuring-functions',
  },
  {
    text: 'Middleware',
    href: 'https://webduh.com/docs/edge-middleware',
  },
  {
    text: 'Getting Started',
    href: 'https://webduh.com/docs/edge-middleware/quickstart',
  },
  {
    text: 'Speed Insights',
    href: 'https://webduh.com/docs/speed-insights',
  },
  {
    text: 'Getting Started',
    href: 'https://webduh.com/docs/speed-insights/quickstart',
  },
  {
    text: 'Web Analytics',
    href: 'https://webduh.com/docs/analytics',
  },
  {
    text: 'Getting Started',
    href: 'https://webduh.com/docs/analytics/quickstart',
  },
  {
    text: 'Projects',
    href: 'https://webduh.com/docs/projects',
  },
  {
    text: 'CLI',
    href: 'https://webduh.com/docs/cli',
  },
  {
    text: 'webduh deploy',
    href: 'https://webduh.com/docs/cli/deploy',
  },
  {
    text: 'webduh dev',
    href: 'https://webduh.com/docs/cli/dev',
  },
  {
    text: 'webduh build',
    href: 'https://webduh.com/docs/cli/build',
  },
  {
    text: 'Integrations',
    href: 'https://webduh.com/docs/integrations',
  },
];

// Base directory for docs
const DOCS_BASE_DIR = path.join(__dirname, '..', 'apps', 'dashboard', 'app');

// Extract path from URL and normalize
function extractPath(url) {
  const urlObj = new URL(url);
  return urlObj.pathname.replace(/^\//, ''); // Remove leading slash
}

// Convert path to component name
function pathToComponentName(filePath) {
  const parts = filePath.split('/').filter(Boolean);
  const lastPart = parts[parts.length - 1];

  return (
    lastPart
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('') + 'Page'
  );
}

// Generate breadcrumbs from path
function generateBreadcrumbs(fullPath) {
  const parts = fullPath.split('/').filter(Boolean);
  const breadcrumbs = [];

  for (let i = 1; i < parts.length - 1; i++) {
    const pathSegments = parts.slice(0, i + 1);
    const href = '/' + pathSegments.join('/');

    // Find the title for this path
    const matchingDoc = docsStructure.find(
      (doc) => extractPath(doc.href) === pathSegments.join('/'),
    );

    const label = matchingDoc
      ? matchingDoc.text
      : pathSegments[pathSegments.length - 1]
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

    breadcrumbs.push({ label, href });
  }

  return breadcrumbs;
}

// Generate relative import path for DocPage component
function generateDocPageImport(filePath) {
  const depth = filePath.split('/').filter(Boolean).length - 1; // -1 because we don't count the file itself
  const relativePath = '../'.repeat(depth) + 'components/DocPage';
  return relativePath;
}

// Generate page content
function generatePageContent(doc) {
  const filePath = extractPath(doc.href);
  const componentName = pathToComponentName(filePath);
  const breadcrumbs = generateBreadcrumbs(filePath);
  const docPageImport = generateDocPageImport(filePath);

  // Generate description based on title and context
  let description = `Learn about ${doc.text.toLowerCase()}`;

  // Custom descriptions for better UX
  const customDescriptions = {
    'Getting Started': 'Learn how to deploy your first project with webduh',
    'Supported Frameworks':
      'Deploy with Next.js, React, Vue, Svelte, and many more frameworks',
    'Next.js': 'Deploy Next.js applications with zero configuration',
    Functions:
      'Serverless functions and API routes with multiple runtime support',
    CLI: 'Command line interface for deploying and managing projects',
    'Web Analytics': 'Privacy-first web analytics to understand your visitors',
    Deployments: 'Manage, configure, and monitor your deployments',
    Domains: 'Custom domains, SSL certificates, and DNS management',
    'Environment Variables': 'Securely manage configuration and secrets',
    'Git Integrations': 'Connect GitHub, GitLab, Bitbucket, and Azure DevOps',
    Monorepos: 'Deploy multiple projects from a single repository',
    'Speed Insights': 'Real-world performance monitoring and Core Web Vitals',
  };

  if (customDescriptions[doc.text]) {
    description = customDescriptions[doc.text];
  }

  let content = `import React from 'react'
import DocPage from '${docPageImport}'

export default function ${componentName}() {
  return (
    <DocPage
      title="${doc.text}"
      description="${description}"`;

  if (breadcrumbs.length > 0) {
    content += `
      breadcrumbs={[
${breadcrumbs.map((bc) => `        { label: '${bc.label}', href: '${bc.href}' }`).join(',\n')}
      ]}`;
  }

  content += `
    />
  )
}`;

  return content;
}

// Ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Main generation function
function generateAllPages() {
  console.log('🚀 Starting documentation generation...\n');

  let createdPages = 0;
  let skippedPages = 0;

  for (const doc of docsStructure) {
    const relativePath = extractPath(doc.href);
    const fullPath = path.join(DOCS_BASE_DIR, relativePath);
    const dir = path.dirname(fullPath);
    const filePath = path.join(fullPath, 'page.tsx');

    // Ensure directory exists
    ensureDir(fullPath);

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping ${relativePath} (already exists)`);
      skippedPages++;
      continue;
    }

    // Generate and write the page content
    const content = generatePageContent(doc);

    try {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Created ${relativePath}/page.tsx`);
      createdPages++;
    } catch (error) {
      console.error(
        `❌ Error creating ${relativePath}/page.tsx:`,
        error.message,
      );
    }
  }

  console.log(`\n🎉 Documentation generation complete!`);
  console.log(`📄 Created: ${createdPages} pages`);
  console.log(`⏭️  Skipped: ${skippedPages} pages (already existed)`);
  console.log(`📁 Total: ${docsStructure.length} pages processed`);
}

// Run the script
if (require.main === module) {
  generateAllPages();
}

module.exports = { generateAllPages };
