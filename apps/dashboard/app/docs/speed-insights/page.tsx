import React from 'react';
import DocPage from '../components/DocPage';

const speedInsightsContent = (
  <div className="prose dark:prose-invert max-w-none">
    <h2>Speed Insights</h2>
    <p>
      <strong>Speed Insights</strong> help you understand and optimize the
      performance of your web application. Fast-loading sites provide a better
      user experience, improve SEO, and increase engagement.
    </p>
    <h3>What are Speed Insights?</h3>
    <p>
      Speed Insights analyze your site’s loading times, resource usage, and
      performance bottlenecks. They provide actionable recommendations to help
      you make your site faster and more efficient.
    </p>
    <h3>How to Use Speed Insights</h3>
    <ol>
      <li>
        Navigate to the <strong>Speed Insights</strong> section in your
        dashboard.
      </li>
      <li>
        Review the performance metrics, such as{' '}
        <strong>First Contentful Paint (FCP)</strong>,{' '}
        <strong>Time to Interactive (TTI)</strong>, and{' '}
        <strong>Largest Contentful Paint (LCP)</strong>.
      </li>
      <li>
        Check the list of recommendations and issues detected on your site.
      </li>
      <li>
        Follow the suggested optimizations, such as compressing images, reducing
        JavaScript bundle size, or enabling caching.
      </li>
      <li>Re-run the analysis after making changes to see improvements.</li>
    </ol>
    <h3>Key Metrics Explained</h3>
    <ul>
      <li>
        <strong>First Contentful Paint (FCP):</strong> Time until the first text
        or image is rendered.
      </li>
      <li>
        <strong>Largest Contentful Paint (LCP):</strong> Time until the largest
        visible element is rendered.
      </li>
      <li>
        <strong>Time to Interactive (TTI):</strong> Time until the page is fully
        interactive.
      </li>
      <li>
        <strong>Total Blocking Time (TBT):</strong> Time the main thread was
        blocked and unable to respond to user input.
      </li>
      <li>
        <strong>Cumulative Layout Shift (CLS):</strong> Measures visual
        stability and unexpected layout shifts.
      </li>
    </ul>
    <h3>Best Practices for Speed Optimization</h3>
    <ul>
      <li>Optimize and compress images.</li>
      <li>Minimize and defer JavaScript.</li>
      <li>Use efficient caching strategies.</li>
      <li>Serve static assets from a CDN.</li>
      <li>Reduce the number of third-party scripts.</li>
      <li>Preload critical resources.</li>
    </ul>
    <h3>Resources</h3>
    <ul>
      <li>
        <a
          href="https://web.dev/measure/"
          target="_blank"
          rel="noopener noreferrer"
        >
          web.dev/measure
        </a>
      </li>
      <li>
        <a
          href="https://developers.google.com/speed/pagespeed/insights/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google PageSpeed Insights
        </a>
      </li>
      <li>
        <a
          href="https://nextjs.org/docs/advanced-features/measuring-performance"
          target="_blank"
          rel="noopener noreferrer"
        >
          Next.js: Measuring Performance
        </a>
      </li>
    </ul>
    <p>
      Regularly monitoring your site’s speed ensures a smooth experience for
      your users and helps you stay ahead of performance issues.
    </p>
  </div>
);

export default function SpeedInsightsPage() {
  return (
    <DocPage
      title="Speed Insights"
      description="Learn how to analyze and optimize your site's performance using Speed Insights."
    >
      {speedInsightsContent}
    </DocPage>
  );
}
