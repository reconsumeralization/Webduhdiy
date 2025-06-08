import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function QuickstartPage() {
  return (
    <DocPage
      title="Getting Started"
      description="Learn how to deploy your first project with webduh's image optimization. This guide will walk you through the basics of optimizing and serving images efficiently."
      breadcrumbs={[
        { label: 'Image Optimization', href: '/docs/image-optimization' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Overview</h2>
          <p>
            webduh's image optimization helps you deliver fast, high-quality
            images to your users. This quickstart will show you how to enable
            image optimization for your project and use the optimized image URLs
            in your app.
          </p>
        </section>
        <section>
          <h3>1. Prerequisites</h3>
          <ul>
            <li>
              A{' '}
              <a
                href="https://webduh.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                webduh
              </a>{' '}
              account
            </li>
            <li>An existing project or a new project set up in webduh</li>
            <li>Some images you want to optimize and serve</li>
          </ul>
        </section>
        <section>
          <h3>2. Enable Image Optimization</h3>
          <ol>
            <li>Go to your project dashboard in webduh.</li>
            <li>
              Navigate to <strong>Settings &gt; Image Optimization</strong>.
            </li>
            <li>
              Toggle <strong>Enable Image Optimization</strong> to{' '}
              <strong>On</strong>.
            </li>
          </ol>
        </section>
        <section>
          <h3>3. Use Optimized Image URLs</h3>
          <p>
            Once enabled, you can serve your images through webduh's
            optimization CDN. Replace your image URLs with the optimized
            endpoint:
          </p>
          <CodeBlock
            language="html"
            filename="Example"
          >{`<img src="https://cdn.webduh.com/your-project/images/photo.jpg?width=800&format=webp" alt="Optimized" />`}</CodeBlock>
          <ul>
            <li>
              <code>width</code>: Resize the image to the specified width (in
              pixels).
            </li>
            <li>
              <code>format</code>: Convert the image to a modern format like{' '}
              <code>webp</code> or <code>avif</code>.
            </li>
          </ul>
        </section>
        <section>
          <h3>4. Next Steps</h3>
          <ul>
            <li>
              Explore advanced options like quality, cropping, and responsive
              images.
            </li>
            <li>
              Read the{' '}
              <a href="/docs/image-optimization/advanced" className="underline">
                Advanced Image Optimization
              </a>{' '}
              guide.
            </li>
            <li>
              Monitor your image usage and performance in the webduh dashboard.
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
