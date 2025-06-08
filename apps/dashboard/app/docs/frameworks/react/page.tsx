'use client';

import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function ReactPage() {
  return (
    <DocPage
      title="React Applications"
      description="Deploy React applications with Create React App, Vite, and custom setups on Webduh."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Frameworks', href: '/docs/frameworks' },
        { label: 'React', href: '/docs/frameworks/react' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Quick Start</h2>
        <p>
          Deploy React applications built with Create React App, Vite, or custom
          webpack configurations. Webduh automatically detects your React setup
          and configures optimal build settings.
        </p>

        <h3>Create React App</h3>
        <p>Deploy a Create React App project:</p>
        <CodeBlock language="bash" filename="CRA Deployment">
          {`# Create new React app
npx create-react-app my-app
cd my-app

# Deploy to Webduh
npm install -g @webduh/cli
webduh --prod`}
        </CodeBlock>

        <h3>Vite React</h3>
        <p>Deploy a Vite-powered React application:</p>
        <CodeBlock language="bash" filename="Vite Deployment">
          {`# Create Vite React app
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install

# Deploy to Webduh
webduh --prod`}
        </CodeBlock>

        <h2>Configuration</h2>
        <h3>Build Settings</h3>
        <p>
          Webduh auto-detects React projects and uses these default settings:
        </p>
        <CodeBlock language="json" filename="Auto-detected settings">
          {`{
  "framework": "react",
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install",
  "devCommand": "npm start"
}`}
        </CodeBlock>

        <h3>Custom Configuration</h3>
        <p>Override defaults with webduh.json:</p>
        <CodeBlock language="json" filename="webduh.json">
          {`{
  "buildCommand": "npm run build:production",
  "outputDirectory": "dist",
  "env": {
    "REACT_APP_API_URL": "@api-url"
  },
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}`}
        </CodeBlock>

        <h2>Environment Variables</h2>
        <p>
          React apps support environment variables with the REACT_APP_ prefix:
        </p>
        <CodeBlock language="bash" filename="Environment Variables">
          {`# Environment variables
REACT_APP_API_URL=https://api.example.com
REACT_APP_ANALYTICS_ID=GA_TRACKING_ID
REACT_APP_VERSION=1.0.0`}
        </CodeBlock>

        <CodeBlock language="javascript" filename="Using Environment Variables">
          {`// Using environment variables in React
const apiUrl = process.env.REACT_APP_API_URL;
const analyticsId = process.env.REACT_APP_ANALYTICS_ID;

// In your component
function App() {
  useEffect(() => {
    // Initialize analytics
    gtag('config', analyticsId);
  }, []);

  return <div>My React App</div>;
}`}
        </CodeBlock>

        <h2>Routing</h2>
        <h3>React Router</h3>
        <p>Configure client-side routing with React Router:</p>
        <CodeBlock language="json" filename="SPA Routing">
          {`{
  "rewrites": [
    {
      "source": "/((?!api/.*).*)",
      "destination": "/index.html"
    }
  ]
}`}
        </CodeBlock>

        <CodeBlock language="javascript" filename="React Router Setup">
          {`// App.js with React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}`}
        </CodeBlock>

        <h2>Optimization</h2>
        <h3>Code Splitting</h3>
        <p>Optimize your React app with code splitting:</p>
        <CodeBlock language="javascript" filename="Code Splitting">
          {`import { lazy, Suspense } from 'react';

// Lazy load components
const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}`}
        </CodeBlock>

        <h3>Bundle Analysis</h3>
        <p>Analyze your bundle size:</p>
        <CodeBlock language="bash" filename="Bundle Analysis">
          {`# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Add script to package.json
"analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"`}
        </CodeBlock>

        <h2>API Integration</h2>
        <h3>Fetch API</h3>
        <p>Make API calls in your React components:</p>
        <CodeBlock language="javascript" filename="API Integration">
          {`import { useState, useEffect } from 'react';

function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(\`\${process.env.REACT_APP_API_URL}/data\`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}`}
        </CodeBlock>

        <h2>Testing</h2>
        <h3>Unit Tests</h3>
        <p>React apps come with Jest testing setup:</p>
        <CodeBlock language="javascript" filename="Unit Test">
          {`import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});`}
        </CodeBlock>

        <h2>Deployment</h2>
        <h3>Production Build</h3>
        <p>Optimize for production deployment:</p>
        <CodeBlock language="json" filename="Production Scripts">
          {`{
  "scripts": {
    "build": "react-scripts build",
    "build:analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"
  },
  "homepage": "https://yourdomain.com"
}`}
        </CodeBlock>

        <h3>Performance Monitoring</h3>
        <p>Monitor your React app performance:</p>
        <CodeBlock language="javascript" filename="Web Vitals">
          {`// src/index.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.id,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);`}
        </CodeBlock>
      </div>
    </DocPage>
  );
}
