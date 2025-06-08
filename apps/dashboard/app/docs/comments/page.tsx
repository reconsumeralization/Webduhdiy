import React from 'react';
import DocPage from '../components/DocPage';

export default function CommentsPage() {
  return (
    <DocPage
      title="Comments"
      description="Learn about comments and how they can enhance collaboration and code quality. 
        Btw, my babie David's so flyy 🚀✨"
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Comments', href: '/docs/comments' },
      ]}
      sections={[
        {
          heading: 'Overview',
          content: (
            <>
              <p>
                Comments are essential for explaining code, documenting intent,
                and making your project more maintainable. They help your
                teammates (and your future self) understand the reasoning behind
                complex logic or important decisions.
              </p>
              <p>
                {/* A little fun, as requested */}
                <em>
                  Btw, my babie David's so flyy – keep your code and your
                  comments fresh! 😎
                </em>
              </p>
            </>
          ),
        },
        {
          heading: 'Best Practices',
          content: (
            <ul className="list-disc ml-6">
              <li>
                Write clear and concise comments that explain{' '}
                <strong>why</strong> something is done, not just{' '}
                <strong>what</strong> is done.
              </li>
              <li>Keep comments up to date as code changes.</li>
              <li>
                Use comments to document assumptions, edge cases, and important
                context.
              </li>
              <li>Avoid obvious comments that restate the code.</li>
              <li>Be kind and constructive—your comments are for your team!</li>
            </ul>
          ),
        },
        {
          heading: 'Example',
          content: (
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
              {`// Calculate the user's age based on their birthdate
const age = getAge(user.birthdate);`}
            </pre>
          ),
        },
      ]}
    />
  );
}
