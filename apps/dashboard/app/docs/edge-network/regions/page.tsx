import React from 'react';
import DocPage from '../../components/DocPage';

export default function RegionsPage() {
  return (
    <DocPage
      title="Edge Network Regions"
      description="Discover how webduh's global edge regions deliver content with low latency and high availability."
      breadcrumbs={[
        { label: 'Edge Network', href: '/docs/edge-network' },
        { label: 'Regions', href: '/docs/edge-network/regions' },
      ]}
    >
      <section className="prose dark:prose-invert max-w-none space-y-6">
        <h2>What are Edge Regions?</h2>
        <p>
          Edge regions are physical data centers distributed around the world.
          webduh automatically deploys your application to these regions,
          ensuring users connect to the closest location for optimal speed and
          reliability.
        </p>
        <h3>Benefits of Multiple Regions</h3>
        <ul>
          <li>
            <strong>Low Latency:</strong> Users connect to the nearest region,
            reducing load times.
          </li>
          <li>
            <strong>High Availability:</strong> Traffic is automatically
            rerouted if a region is unavailable.
          </li>
          <li>
            <strong>Scalability:</strong> Your app can handle global traffic
            spikes with ease.
          </li>
        </ul>
        <h3>Current Edge Regions</h3>
        <p>
          webduh's edge network spans 50+ regions across North America, Europe,
          Asia, South America, Africa, and Oceania.
        </p>
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Region</th>
              <th className="px-4 py-2 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">us-east-1</td>
              <td className="px-4 py-2">Virginia, USA</td>
            </tr>
            <tr>
              <td className="px-4 py-2">eu-west-1</td>
              <td className="px-4 py-2">Dublin, Ireland</td>
            </tr>
            <tr>
              <td className="px-4 py-2">ap-northeast-1</td>
              <td className="px-4 py-2">Tokyo, Japan</td>
            </tr>
            <tr>
              <td className="px-4 py-2">sa-east-1</td>
              <td className="px-4 py-2">São Paulo, Brazil</td>
            </tr>
            <tr>
              <td className="px-4 py-2">af-south-1</td>
              <td className="px-4 py-2">Cape Town, South Africa</td>
            </tr>
            {/* Add more regions as needed */}
          </tbody>
        </table>
        <h3>How Region Selection Works</h3>
        <p>
          When a user visits your site, webduh automatically routes their
          request to the nearest available region. No manual configuration is
          required.
        </p>
        <h3>Learn More</h3>
        <p>
          For advanced configuration and a full list of regions, see the{' '}
          <a
            href="/docs/edge-network"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            Edge Network documentation
          </a>
          .
        </p>
      </section>
    </DocPage>
  );
}
