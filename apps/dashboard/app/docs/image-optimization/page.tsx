'use client';

import DocPage from '../components/DocPage';

export default function ImageOptimizationPage() {
  return (
    <DocPage
      title="Image Optimization"
      description="Automatically optimize images for better performance and user experience."
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 id="overview">Overview</h2>
          <p>
            webduh automatically optimizes your images for better performance
            and faster load times. With built-in support for modern formats,
            responsive resizing, and smart compression, you can deliver
            high-quality visuals without sacrificing speed.
          </p>
        </section>
        <section>
          <h3>Key Features</h3>
          <ul>
            <li>Automatic conversion to next-gen formats (WebP, AVIF, etc.)</li>
            <li>On-the-fly resizing and cropping</li>
            <li>Smart compression for minimal file size and maximum quality</li>
            <li>CDN delivery for global performance</li>
            <li>Easy integration with your existing workflow</li>
          </ul>
        </section>
        <section>
          <h3>How It Works</h3>
          <p>
            Simply upload your images or point webduh to your image sources.
            webduh will handle optimization, caching, and delivery, ensuring
            your users always get the best experience.
          </p>
        </section>
        <section>
          <h3>Get Started</h3>
          <p>
            Check out the{' '}
            <a href="/docs/image-optimization/quickstart" className="underline">
              Quickstart guide
            </a>{' '}
            to learn how to enable image optimization for your project.
          </p>
        </section>
      </div>
    </DocPage>
  );
}
