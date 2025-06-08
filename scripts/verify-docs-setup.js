const fs = require('fs');
const path = require('path');

// Documentation routes that should exist
const docRoutes = [
  'apps/dashboard/app/docs/page.tsx',
  'apps/dashboard/app/docs/getting-started-with-webduh/page.tsx',
  'apps/dashboard/app/docs/frameworks/nextjs/page.tsx',
  'apps/dashboard/app/docs/functions/page.tsx',
  'apps/dashboard/app/docs/cli/page.tsx',
  'apps/dashboard/app/docs/domains/page.tsx',
  'apps/dashboard/app/docs/analytics/page.tsx',
  'apps/dashboard/app/docs/environment-variables/page.tsx',
];

// Component files that should exist
const componentFiles = [
  'apps/dashboard/app/docs/components/SearchComponent.tsx',
  'apps/dashboard/app/docs/components/TableOfContents.tsx',
  'apps/dashboard/app/docs/components/PrevNextNavigation.tsx',
  'apps/dashboard/app/docs/components/CodeBlock.tsx',
  'apps/dashboard/app/docs/components/ThemeToggle.tsx',
  'apps/dashboard/app/docs/components/FeedbackWidget.tsx',
  'apps/dashboard/app/docs/components/MobileNavigation.tsx',
  'apps/dashboard/app/docs/components/SEOHead.tsx',
  'apps/dashboard/app/docs/components/ProgressIndicator.tsx',
  'apps/dashboard/app/docs/components/DocPage.tsx',
  'apps/dashboard/app/docs/components/index.ts',
];

console.log('🔍 Verifying documentation setup...\n');

// Check documentation routes
console.log('📄 Documentation Pages:');
docRoutes.forEach((route) => {
  const fullPath = path.join(__dirname, '..', route);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? '✅' : '❌'} ${route}`);
});

console.log('\n🧩 Component Files:');
componentFiles.forEach((component) => {
  const fullPath = path.join(__dirname, '..', component);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? '✅' : '❌'} ${component}`);
});

// Check for common issues
console.log('\n🔧 Common Issues Check:');

// Check if barrel export exists
const barrelExportPath = path.join(
  __dirname,
  '..',
  'apps/dashboard/app/docs/components/index.ts',
);
if (fs.existsSync(barrelExportPath)) {
  const barrelContent = fs.readFileSync(barrelExportPath, 'utf8');
  const hasProgressIndicator = barrelContent.includes('ProgressIndicator');
  console.log(
    `${hasProgressIndicator ? '✅' : '❌'} ProgressIndicator in barrel exports`,
  );
} else {
  console.log('❌ Barrel export file missing');
}

// Check for common import issues in a few key files
const filesToCheck = [
  'apps/dashboard/app/docs/frameworks/nextjs/page.tsx',
  'apps/dashboard/app/docs/functions/page.tsx',
];

filesToCheck.forEach((file) => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasCorrectImport =
      content.includes('import ProgressIndicator from') &&
      !content.includes('import { ProgressIndicator }');
    console.log(
      `${hasCorrectImport ? '✅' : '❌'} Correct ProgressIndicator import in ${file}`,
    );
  }
});

console.log(`
🎯 Next Steps:
1. Access the documentation at: http://localhost:3001/docs
2. Test navigation between pages
3. Verify all components render correctly
4. Check mobile responsiveness
5. Test dark mode toggle

🚀 If all items above show ✅, your documentation system is ready!
`);
