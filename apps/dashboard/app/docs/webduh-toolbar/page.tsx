import React from 'react';
import DocPage from '../components/DocPage';

const toolbarContent = (
  <div className="prose dark:prose-invert max-w-none">
    <h2>What is the webduh Toolbar?</h2>
    <p>
      The <strong>webduh Toolbar</strong> is a powerful, extensible UI component
      that provides users with quick access to essential actions, navigation,
      and context-aware tools within your application.
    </p>
    <h3>Key Features</h3>
    <ul>
      <li>
        <strong>Customizable:</strong> Add, remove, or rearrange toolbar items
        to fit your workflow.
      </li>
      <li>
        <strong>Context-aware:</strong> Toolbar adapts to the current page or
        selection.
      </li>
      <li>
        <strong>Accessible:</strong> Fully keyboard-navigable and screen reader
        friendly.
      </li>
      <li>
        <strong>Lightweight:</strong> Minimal dependencies and optimized for
        performance.
      </li>
    </ul>
    <h3>Getting Started</h3>
    <ol>
      <li>
        <strong>Install the Toolbar package:</strong>
        <pre>
          <code>npm install @webduh/toolbar</code>
        </pre>
      </li>
      <li>
        <strong>Import and use in your app:</strong>
        <pre>
          <code>{`import { Toolbar, ToolbarButton } from '@webduh/toolbar'

export default function MyPage() {
  return (
    <Toolbar>
      <ToolbarButton icon="plus" label="Add" onClick={handleAdd} />
      <ToolbarButton icon="edit" label="Edit" onClick={handleEdit} />
      {/* Add more buttons as needed */}
    </Toolbar>
  )
}`}</code>
        </pre>
      </li>
    </ol>
    <h3>Best Practices</h3>
    <ul>
      <li>Group related actions together for clarity.</li>
      <li>Use icons and labels for better usability.</li>
      <li>
        Keep the toolbar concise—avoid overcrowding with too many actions.
      </li>
    </ul>
    <h3>Learn More</h3>
    <p>
      See the{' '}
      <a href="/docs/components/toolbar">Toolbar component documentation</a> for
      advanced usage, theming, and accessibility guidelines.
    </p>
  </div>
);

export default function WebduhToolbarPage() {
  return (
    <DocPage
      title="Toolbar"
      description="Learn about the webduh Toolbar, its features, and how to integrate it into your app."
    >
      {toolbarContent}
    </DocPage>
  );
}
