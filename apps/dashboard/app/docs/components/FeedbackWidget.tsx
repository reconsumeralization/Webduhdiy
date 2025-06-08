'use client';

import React, { useState } from 'react';

interface FeedbackWidgetProps {
  pageTitle: string;
  pagePath: string;
}

export default function FeedbackWidget({
  pageTitle,
  pagePath,
}: FeedbackWidgetProps) {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(
    null,
  );
  const [showDetails, setShowDetails] = useState(false);
  const [detailsFeedback, setDetailsFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = (type: 'helpful' | 'not-helpful') => {
    setFeedback(type);
    if (type === 'not-helpful') {
      setShowDetails(true);
    } else {
      // For helpful feedback, we can submit immediately
      submitFeedback(type, '');
    }
  };

  const submitFeedback = async (
    type: 'helpful' | 'not-helpful',
    details: string = '',
  ) => {
    try {
      // Here you would typically send to your analytics/feedback service
      console.log('Feedback submitted:', {
        type,
        details,
        pageTitle,
        pagePath,
        timestamp: new Date().toISOString(),
      });

      // For now, just simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSubmitted(true);

      // Hide the widget after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFeedback(null);
        setShowDetails(false);
        setDetailsFeedback('');
      }, 3000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const handleDetailsSubmit = () => {
    if (feedback) {
      submitFeedback(feedback, detailsFeedback);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-medium">Thank you for your feedback!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="space-y-4">
        {/* Initial feedback question */}
        {!feedback && (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Was this page helpful?
            </h4>
            <div className="flex gap-2">
              <button
                onClick={() => handleFeedback('helpful')}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                Yes
              </button>
              <button
                onClick={() => handleFeedback('not-helpful')}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13v-3m-7 10h2m5-10h4a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                  />
                </svg>
                No
              </button>
            </div>
          </div>
        )}

        {/* Details form for negative feedback */}
        {showDetails && feedback === 'not-helpful' && (
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900 dark:text-white">
              Help us improve this page
            </h5>
            <textarea
              value={detailsFeedback}
              onChange={(e) => setDetailsFeedback(e.target.value)}
              placeholder="What would make this page more helpful? (optional)"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleDetailsSubmit}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit feedback
              </button>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setFeedback(null);
                  setDetailsFeedback('');
                }}
                className="px-3 py-2 text-sm bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Thank you message for positive feedback */}
        {feedback === 'helpful' && !showDetails && (
          <div className="text-center py-2">
            <div className="text-green-600 dark:text-green-400 font-medium text-sm">
              Thanks for your feedback! 🎉
            </div>
          </div>
        )}
      </div>

      {/* Additional actions */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Have a suggestion?</span>
          <div className="flex gap-3">
            <a
              href={`https://github.com/webduh/webduh/edit/main/docs${pagePath}.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Edit on GitHub
            </a>
            <a
              href={`https://github.com/webduh/webduh/issues/new?title=Documentation feedback: ${encodeURIComponent(pageTitle)}&body=Page: ${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Report issue
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
