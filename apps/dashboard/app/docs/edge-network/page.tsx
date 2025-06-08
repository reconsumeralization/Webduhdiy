'use client';

import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';

export default function EdgeNetworkPage() {
  return (
    <DocPage
      title="Edge Network"
      description="webduh's global edge network delivers your content from 50+ locations worldwide for optimal performance."
    >
      <div className="space-y-8">
        <div>
          <h2 id="overview">Overview</h2>
          <p>
            webduh's edge network automatically distributes your application
            across 50+ edge locations worldwide, ensuring fast load times for
            users everywhere.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                50+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Edge Locations
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                &lt;100ms
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Global Latency
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                99.99%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Uptime SLA
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 id="caching">Smart Caching</h2>
          <p>Automatic caching with intelligent cache invalidation:</p>

          <CodeBlock language="javascript" filename="next.config.js">
            {`module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=1, stale-while-revalidate',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="edge-functions">Edge Functions</h2>
          <p>Run code at the edge for ultra-low latency:</p>

          <CodeBlock language="javascript" filename="middleware.js">
            {`import { NextResponse } from 'next/server'

export function middleware(request) {
  // Geolocation-based routing
  const country = request.geo?.country
  
  if (country === 'GB') {
    return NextResponse.redirect('/uk')
  }
  
  if (country === 'JP') {
    return NextResponse.redirect('/japan')
  }
  
  return NextResponse.next()
}

export const config = {
  runtime: 'edge',
  matcher: '/',
}`}
          </CodeBlock>
        </div>
      </div>
    </DocPage>
  );
}
