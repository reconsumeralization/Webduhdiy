#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// All the documentation URLs from our structure
const docsStructure = [
  'docs/getting-started-with-webduh',
  'docs/getting-started-with-webduh/projects-deployments',
  'docs/getting-started-with-webduh/template',
  'docs/getting-started-with-webduh/import',
  'docs/getting-started-with-webduh/domains',
  'docs/getting-started-with-webduh/buy-domain',
  'docs/getting-started-with-webduh/use-existing',
  'docs/getting-started-with-webduh/collaborate',
  'docs/getting-started-with-webduh/next-steps',
  'docs/frameworks',
  'docs/frameworks/nextjs',
  'docs/frameworks/sveltekit',
  'docs/frameworks/astro',
  'docs/frameworks/nuxt',
  'docs/frameworks/vite',
  'docs/frameworks/react-router',
  'docs/frameworks/remix',
  'docs/frameworks/gatsby',
  'docs/frameworks/create-react-app',
  'docs/frameworks/more-frameworks',
  'docs/incremental-migration',
  'docs/incremental-migration/migration-guide',
  'docs/incremental-migration/technical-guidelines',
  'docs/production-checklist',
  'docs/accounts',
  'docs/activity-log',
  'docs/deployment-protection',
  'docs/deployment-protection/methods-to-bypass-deployment-protection',
  'docs/directory-sync',
  'docs/saml',
  'docs/two-factor-authentication',
  'docs/rest-api',
  'docs/sdk',
  'docs/builds',
  'docs/builds/build-features',
  'docs/builds/build-image',
  'docs/builds/build-queues',
  'docs/builds/configure-a-build',
  'docs/builds/managing-builds',
  'docs/deploy-hooks',
  'docs/deployment-retention',
  'docs/deployments',
  'docs/deployments/environments',
  'docs/deployments/generated-urls',
  'docs/deployments/managing-deployments',
  'docs/environment-variables',
  'docs/environment-variables/framework-environment-variables',
  'docs/git',
  'docs/git/webduh-for-github',
  'docs/git/webduh-for-azure-pipelines',
  'docs/git/webduh-for-bitbucket',
  'docs/git/webduh-for-gitlab',
  'docs/instant-rollback',
  'docs/monorepos',
  'docs/monorepos/turborepo',
  'docs/monorepos/remote-caching',
  'docs/monorepos/nx',
  'docs/package-managers',
  'docs/webhooks',
  'docs/domains',
  'docs/domains/working-with-domains',
  'docs/domains/working-with-domains/add-a-domain',
  'docs/domains/working-with-domains/deploying-and-redirecting',
  'docs/domains/working-with-dns',
  'docs/domains/managing-dns-records',
  'docs/domains/working-with-ssl',
  'docs/edge-network',
  'docs/edge-network/regions',
  'docs/edge-network/compression',
  'docs/headers',
  'docs/headers/security-headers',
  'docs/image-optimization',
  'docs/image-optimization/quickstart',
  'docs/redirects',
  'docs/rewrites',
  'docs/comments',
  'docs/feature-flags',
  'docs/webduh-toolbar',
  'docs/cron-jobs',
  'docs/cron-jobs/quickstart',
  'docs/functions',
  'docs/functions/quickstart',
  'docs/functions/streaming-functions',
  'docs/functions/runtimes',
  'docs/functions/runtimes/node-js',
  'docs/functions/runtimes/python',
  'docs/functions/runtimes/edge',
  'docs/functions/configuring-functions',
  'docs/edge-middleware',
  'docs/edge-middleware/quickstart',
  'docs/speed-insights',
  'docs/speed-insights/quickstart',
  'docs/analytics',
  'docs/analytics/quickstart',
  'docs/projects',
  'docs/cli',
  'docs/cli/deploy',
  'docs/cli/dev',
  'docs/cli/build',
  'docs/integrations',
];

// Base directory for docs
const DOCS_BASE_DIR = path.join(__dirname, '..', 'apps', 'dashboard', 'app');

function verifyAllPages() {
  console.log('🔍 Verifying documentation pages...\n');

  let existingPages = 0;
  let missingPages = 0;
  const missing = [];

  for (const docPath of docsStructure) {
    const fullPath = path.join(DOCS_BASE_DIR, docPath, 'page.tsx');

    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${docPath}/page.tsx`);
      existingPages++;
    } else {
      console.log(`❌ ${docPath}/page.tsx (MISSING)`);
      missing.push(docPath);
      missingPages++;
    }
  }

  console.log(`\n📊 Verification Results:`);
  console.log(`✅ Existing: ${existingPages} pages`);
  console.log(`❌ Missing: ${missingPages} pages`);
  console.log(`📁 Total: ${docsStructure.length} pages checked`);

  if (missing.length > 0) {
    console.log(`\n❌ Missing pages:`);
    missing.forEach((page) => console.log(`   - ${page}`));
  } else {
    console.log(`\n🎉 All documentation pages exist!`);
  }

  return missing;
}

// Also check for any unexpected pages that might need cleanup
function findExtraPages() {
  console.log(`\n🔍 Checking for unexpected pages...`);

  function scanDirectory(dirPath, relativePath = '') {
    if (!fs.existsSync(dirPath)) return [];

    const items = fs.readdirSync(dirPath);
    let found = [];

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const currentRelative = relativePath ? `${relativePath}/${item}` : item;

      if (fs.statSync(itemPath).isDirectory()) {
        if (item === 'components') continue; // Skip components directory
        found = found.concat(scanDirectory(itemPath, currentRelative));
      } else if (item === 'page.tsx') {
        const pagePath = relativePath ? `docs/${relativePath}` : 'docs';
        if (!docsStructure.includes(pagePath)) {
          found.push(pagePath);
        }
      }
    }

    return found;
  }

  const docsDir = path.join(DOCS_BASE_DIR, 'docs');
  const extraPages = scanDirectory(docsDir);

  if (extraPages.length > 0) {
    console.log(`⚠️  Found ${extraPages.length} unexpected pages:`);
    extraPages.forEach((page) => console.log(`   - ${page}`));
  } else {
    console.log(`✅ No unexpected pages found`);
  }

  return extraPages;
}

// Run verification
if (require.main === module) {
  const missing = verifyAllPages();
  const extra = findExtraPages();

  if (missing.length === 0 && extra.length === 0) {
    console.log(`\n🎉 Documentation structure is perfect!`);
    process.exit(0);
  } else {
    console.log(`\n⚠️  Issues found - see above for details`);
    process.exit(1);
  }
}

module.exports = { verifyAllPages, findExtraPages };
