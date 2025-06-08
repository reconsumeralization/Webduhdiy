import React from 'react';
import DocPage from '../../components/DocPage';

export default function ConfigureABuildPage() {
  return (
    <DocPage
      title="Configuring a Build"
      description="Learn how to configure your build process in webduh. Set up build commands, environment variables, and advanced options to tailor your CI/CD pipeline for your project's needs."
      breadcrumbs={[
        { label: 'Builds', href: '/docs/builds' },
        {
          label: 'Configuring a Build',
          href: '/docs/builds/configure-a-build',
        },
      ]}
      sections={[
        {
          heading: 'Overview',
          content:
            'Configuring a build in webduh allows you to customize how your project is built and deployed. You can specify build and install commands, set environment variables, and adjust advanced settings to optimize your workflow.',
        },
        {
          heading: 'Setting Build & Install Commands',
          content:
            "Define custom build and install commands to match your project's requirements. For example, you might use 'npm install' and 'npm run build' for a Node.js project. These commands can be set in your project settings or via a configuration file.",
        },
        {
          heading: 'Managing Environment Variables',
          content:
            'Environment variables let you securely inject secrets and configuration into your build process. Set variables for different environments (development, preview, production) to control behavior and access credentials safely.',
        },
        {
          heading: 'Advanced Options',
          content:
            'Take advantage of advanced options such as build caching, monorepo support, and custom Docker images. These features help you optimize build times and support complex project structures.',
        },
        {
          heading: 'Best Practices',
          content:
            'Keep your build configuration simple and version-controlled. Regularly review your build logs to catch issues early, and use preview deployments to test changes before merging.',
        },
      ]}
    />
  );
}
