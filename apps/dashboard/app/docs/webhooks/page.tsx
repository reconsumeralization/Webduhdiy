import React from 'react';
import DocPage from '../components/DocPage';

const webhooksContent = (
  <div className="prose dark:prose-invert max-w-none">
    <h2>What are Webhooks?</h2>
    <p>
      <strong>Webhooks</strong> allow your application to receive real-time
      notifications when certain events occur. Instead of polling for changes,
      webhooks push updates to your endpoint as soon as something happens.
    </p>
    <h3>How Webhooks Work</h3>
    <ol>
      <li>
        <strong>Register your endpoint:</strong> Provide a publicly accessible
        URL where you want to receive webhook events.
      </li>
      <li>
        <strong>Event occurs:</strong> When a relevant event happens (e.g., a
        new user signs up), our system sends an HTTP POST request to your
        endpoint.
      </li>
      <li>
        <strong>Process the payload:</strong> Your server receives the event
        data and can take action accordingly.
      </li>
    </ol>
    <h3>Example Payload</h3>
    <pre>
      <code>
        {`POST /your/webhook/endpoint
Content-Type: application/json

{
  "event": "user.created",
  "data": {
    "id": "12345",
    "email": "user@example.com",
    "created_at": "2025-06-02T12:34:56Z"
  }
}`}
      </code>
    </pre>
    <h3>Best Practices</h3>
    <ul>
      <li>
        Validate incoming requests using a secret or signature to ensure
        authenticity.
      </li>
      <li>
        Respond with a <code>2xx</code> status code to acknowledge receipt.
      </li>
      <li>Implement retry logic for failed deliveries on your end.</li>
      <li>
        Keep your endpoint fast and reliable; process heavy tasks asynchronously
        if possible.
      </li>
    </ul>
    <h3>Common Use Cases</h3>
    <ul>
      <li>Syncing user data with external systems</li>
      <li>Triggering workflows in response to events</li>
      <li>Real-time notifications and integrations</li>
    </ul>
    <h3>Getting Started</h3>
    <ol>
      <li>
        Go to <strong>Settings &rarr; Webhooks</strong> in your dashboard.
      </li>
      <li>
        Click <strong>Add Webhook</strong> and enter your endpoint URL.
      </li>
      <li>Choose which events you want to subscribe to.</li>
      <li>Save your webhook and test delivery using the dashboard tools.</li>
    </ol>
    <p>
      For more details, see the{' '}
      <a
        href="https://docs.webduh.com/webhooks"
        target="_blank"
        rel="noopener noreferrer"
      >
        webhooks documentation
      </a>
      .
    </p>
  </div>
);

export default function WebhooksPage() {
  return (
    <DocPage
      title="Webhooks"
      description="Learn how to use webhooks to receive real-time notifications and integrate with external systems."
    >
      {webhooksContent}
    </DocPage>
  );
}
