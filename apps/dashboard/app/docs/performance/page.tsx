'use client';

// TODO: confirm version & license.
import React from 'react';
// TODO: confirm version & license.
import Link from 'next/link';

/* ---- embedded utilities ---- */
// DocPage component stub for self-containment
type DocPageProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  children: React.ReactNode;
};

function DocPage({ title, description, breadcrumbs, children }: DocPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          {breadcrumbs && (
            <nav className="mb-4">
              <ol className="flex space-x-2 text-sm text-gray-600 dark:text-gray-400">
                {breadcrumbs.map((item, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2">/</span>}
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="hover:text-gray-900 dark:hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-gray-900 dark:text-white">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </header>
        <main className="prose prose-gray dark:prose-invert max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
}

// CodeBlock component stub for self-containment
type CodeBlockProps = {
  language?: string;
  filename?: string;
  children: string;
};

function CodeBlock({ language = 'text', filename, children }: CodeBlockProps) {
  return (
    <div className="my-4">
      {filename && (
        <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm rounded-t-lg border-b border-gray-700">
          {filename}
        </div>
      )}
      <pre
        className={`bg-gray-900 text-gray-100 p-4 rounded-${filename ? 'b' : ''}-lg overflow-x-auto`}
      >
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  );
}
/* ---- end embedded utilities ---- */

export default function PerformancePage() {
  return (
    <DocPage
      title="Performance Optimization"
      description="Optimize your applications for speed, Core Web Vitals, and user experience on Webduh."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Performance', href: '/docs/performance' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Overview</h2>
        <p>
          Webduh provides global CDN, automatic compression, and edge caching by
          default. This guide covers additional optimizations you can implement
          to maximize performance.
        </p>

        <h2>Core Web Vitals</h2>
        <h3>Largest Contentful Paint (LCP)</h3>
        <p>Optimize loading performance:</p>
        <CodeBlock
          language="javascript"
          children={`// Optimize images with Next.js
import Image from 'next/image';

function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority // Load immediately
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}

// Preload critical resources
export default function Layout({ children }) {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/fonts/inter.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
      </Head>
      {children}
    </>
  );
}`}
          filename="LCP Optimization"
        />

        <h3>First Input Delay (FID)</h3>
        <p>Reduce JavaScript execution time:</p>
        <CodeBlock
          language="javascript"
          children={`// Code splitting with dynamic imports
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}

// Use Web Workers for heavy computations
const worker = new Worker('/worker.js');
worker.postMessage({ data: heavyData });
worker.onmessage = (event) => {
  const result = event.data;
  // Update UI with result
};`}
          filename="FID Optimization"
        />

        <h3>Cumulative Layout Shift (CLS)</h3>
        <p>Prevent layout shifts:</p>
        <CodeBlock
          language="css"
          children={`/* Reserve space for images */
.image-container {
  width: 100%;
  height: 300px;
  position: relative;
}

/* Skeleton loading */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`}
          filename="CLS Prevention"
        />

        <h2>Image Optimization</h2>
        <h3>Next.js Image Component</h3>
        <p>Automatic image optimization:</p>
        <CodeBlock
          language="javascript"
          children={`import Image from 'next/image';

// Responsive images
function Gallery() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {images.map((image) => (
        <Image
          key={image.id}
          src={image.src}
          alt={image.alt}
          width={400}
          height={300}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
      ))}
    </div>
  );
}

// Custom loader for external images
const myLoader = ({ src, width, quality }) => {
  return \`https://example.com/\${src}?w=\${width}&q=\${quality || 75}\`;
};

function ExternalImage() {
  return (
    <Image
      loader={myLoader}
      src="image.jpg"
      alt="External image"
      width={500}
      height={300}
    />
  );
}`}
          filename="Image Optimization"
        />

        <h2>Bundle Optimization</h2>
        <h3>Bundle Analysis</h3>
        <p>Analyze and optimize bundle size:</p>
        <CodeBlock
          language="bash"
          children={`# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Configure next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  experimental: {
    optimizeCss: true,
    optimizeImages: true,
  },
});

# Analyze bundle
ANALYZE=true npm run build`}
          filename="Bundle Analysis"
        />

        <h3>Tree Shaking</h3>
        <p>Remove unused code:</p>
        <CodeBlock
          language="javascript"
          children={`// ❌ Imports entire library
import _ from 'lodash';

// ✅ Import only what you need
import { debounce } from 'lodash';

// ✅ Even better - use specific imports
import debounce from 'lodash/debounce';

// Configure webpack for better tree shaking
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: false,
  },
};`}
          filename="Tree Shaking"
        />

        <h2>Caching Strategies</h2>
        <h3>HTTP Caching</h3>
        <p>Configure optimal cache headers:</p>
        <CodeBlock
          language="json"
          children={`{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
}`}
          filename="Cache Headers"
        />

        <h3>API Response Caching</h3>
        <p>Cache API responses:</p>
        <CodeBlock
          language="javascript"
          children={`// In-memory cache
const cache = new Map();

export default async function handler(req, res) {
  const cacheKey = req.url;
  
  // Check cache first
  if (cache.has(cacheKey)) {
    const cachedData = cache.get(cacheKey);
    if (Date.now() - cachedData.timestamp < 300000) { // 5 minutes
      return res.json(cachedData.data);
    }
  }
  
  // Fetch fresh data
  const data = await fetchDataFromAPI();
  
  // Store in cache
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.json(data);
}`}
          filename="API Caching"
        />

        <h2>Database Optimization</h2>
        <h3>Query Optimization</h3>
        <p>Optimize database queries:</p>
        <CodeBlock
          language="javascript"
          children={`// ❌ N+1 query problem
const users = await User.findAll();
for (const user of users) {
  user.posts = await Post.findAll({ where: { userId: user.id } });
}

// ✅ Use includes/joins
const users = await User.findAll({
  include: [Post]
});

// ✅ Use pagination
const users = await User.findAll({
  limit: 20,
  offset: page * 20,
  order: [['createdAt', 'DESC']]
});`}
          filename="Database Queries"
        />

        <h2>CDN and Edge Optimization</h2>
        <h3>Static Asset Optimization</h3>
        <p>Optimize static assets for CDN delivery:</p>
        <CodeBlock
          language="javascript"
          children={`// next.config.js
module.exports = {
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.yourdomain.com' 
    : '',
  
  images: {
    domains: ['cdn.yourdomain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};`}
          filename="CDN Configuration"
        />

        <h2>Runtime Performance</h2>
        <h3>React Performance</h3>
        <p>Optimize React components:</p>
        <CodeBlock
          language="javascript"
          children={`import { memo, useMemo, useCallback, useState } from 'react';

// Memoize expensive components
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: true
    }));
  }, [data]);

  return <div>{processedData.length} items</div>;
});

// Memoize callbacks
function Parent() {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <Child onClick={handleClick} />;
}`}
          filename="React Optimization"
        />

        <h2>Monitoring</h2>
        <h3>Web Vitals Tracking</h3>
        <p>Monitor performance metrics:</p>
        <CodeBlock
          language="javascript"
          children={`// pages/_app.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics({ name, value, id }) {
  gtag('event', name, {
    event_category: 'Web Vitals',
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    event_label: id,
    non_interaction: true,
  });
}

export function reportWebVitals(metric) {
  sendToAnalytics(metric);
}

// Monitor specific metrics
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);`}
          filename="Performance Monitoring"
        />

        <h2>Performance Checklist</h2>
        <ul>
          <li>✅ Optimize images with proper sizing and formats</li>
          <li>✅ Implement code splitting and lazy loading</li>
          <li>✅ Configure appropriate cache headers</li>
          <li>✅ Minimize JavaScript bundle size</li>
          <li>✅ Use performance monitoring tools</li>
          <li>✅ Optimize database queries</li>
          <li>✅ Preload critical resources</li>
          <li>✅ Prevent layout shifts</li>
          <li>✅ Use CDN for static assets</li>
          <li>✅ Monitor Core Web Vitals</li>
        </ul>
      </div>
    </DocPage>
  );
}
