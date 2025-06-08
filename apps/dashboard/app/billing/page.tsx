'use client';

// TODO: confirm version & license.
import React, { useState } from 'react';
// TODO: confirm version & license.
import Link from 'next/link';

/* ---- embedded utilities ---- */
// Heroicons/Outline SVGs (inlined for self-containment, minimal subset)
type IconProps = React.SVGProps<SVGSVGElement> & { className?: string };

function CreditCardIcon({ className = '', ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <rect x="2.25" y="6.75" width="19.5" height="10.5" rx="2.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 9.75h19.5" />
    </svg>
  );
}

function CheckCircleIcon({ className = '', ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function DocumentTextIcon({ className = '', ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 9.75V6.75A2.25 2.25 0 0014.25 4.5h-4.5A2.25 2.25 0 007.5 6.75v10.5A2.25 2.25 0 009.75 19.5h4.5A2.25 2.25 0 0016.5 17.25v-3"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15.75h.008v.008H12v-.008zM9.75 12h4.5"
      />
    </svg>
  );
}

function ArrowDownTrayIcon({ className = '', ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 12l4.5 4.5m0 0l4.5-4.5m-4.5 4.5V3"
      />
    </svg>
  );
}

function Cog6ToothIcon({ className = '', ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 2.25v1.636a8.25 8.25 0 00-2.25.936l-1.155-1.155a.75.75 0 00-1.06 0l-1.06 1.06a.75.75 0 000 1.06l1.155 1.155a8.25 8.25 0 00-.936 2.25H2.25a.75.75 0 000 1.5h1.636a8.25 8.25 0 00.936 2.25l-1.155 1.155a.75.75 0 000 1.06l1.06 1.06a.75.75 0 001.06 0l1.155-1.155a8.25 8.25 0 002.25.936v1.636a.75.75 0 001.5 0v-1.636a8.25 8.25 0 002.25-.936l1.155 1.155a.75.75 0 001.06 0l1.06-1.06a.75.75 0 000-1.06l-1.155-1.155a8.25 8.25 0 00.936-2.25h1.636a.75.75 0 000-1.5h-1.636a8.25 8.25 0 00-.936-2.25l1.155-1.155a.75.75 0 000-1.06l-1.06-1.06a.75.75 0 00-1.06 0l-1.155 1.155a8.25 8.25 0 00-2.25-.936V2.25a.75.75 0 00-1.5 0z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function BanknotesIcon({ className = '', ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <rect x="2.25" y="6.75" width="19.5" height="10.5" rx="2.25" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ChartBarIcon({ className = '', ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
      <rect x="7.5" y="10.5" width="3" height="7.5" rx="1" />
      <rect x="13.5" y="6" width="3" height="12" rx="1" />
    </svg>
  );
}

function CalendarIcon({ className = '', ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <rect x="3" y="6" width="18" height="15" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4" />
    </svg>
  );
}
/* ---- end embedded utilities ---- */

type DashboardLayoutProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
};

function DashboardLayout({
  title,
  description,
  headerActions,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              {description && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
            {headerActions && (
              <div className="mt-4 md:mt-0">{headerActions}</div>
            )}
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}

// Mock billing data
const subscriptionData = {
  plan: 'Pro',
  status: 'active',
  price: 20,
  billingCycle: 'monthly',
  nextBillingDate: '2024-04-15',
  trialEndsAt: null,
  features: [
    'Unlimited projects',
    '10 team members',
    'Advanced analytics',
    'Priority support',
    'Custom domains',
    '100GB bandwidth',
  ],
};

const usageData = {
  projects: { current: 8, limit: null },
  teamMembers: { current: 5, limit: 10 },
  bandwidth: { current: 45.2, limit: 100, unit: 'GB' },
  builds: { current: 234, limit: null },
  customDomains: { current: 3, limit: null },
};

const invoices = [
  {
    id: 'inv_001',
    date: '2024-03-15',
    amount: 20.0,
    status: 'paid',
    period: 'Mar 2024',
    downloadUrl: '#',
  },
  {
    id: 'inv_002',
    date: '2024-02-15',
    amount: 20.0,
    status: 'paid',
    period: 'Feb 2024',
    downloadUrl: '#',
  },
  {
    id: 'inv_003',
    date: '2024-01-15',
    amount: 20.0,
    status: 'paid',
    period: 'Jan 2024',
    downloadUrl: '#',
  },
];

const paymentMethods = [
  {
    id: 'pm_001',
    type: 'card',
    brand: 'visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2027,
    isDefault: true,
  },
];

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'usage' | 'invoices' | 'payment'
  >('overview');

  const getStatusBadge = (status: string) => {
    const configs = {
      active: {
        bg: 'bg-green-100 dark:bg-green-900/20',
        text: 'text-green-800 dark:text-green-300',
        label: 'Active',
      },
      trial: {
        bg: 'bg-blue-100 dark:bg-blue-900/20',
        text: 'text-blue-800 dark:text-blue-300',
        label: 'Trial',
      },
      past_due: {
        bg: 'bg-red-100 dark:bg-red-900/20',
        text: 'text-red-800 dark:text-red-300',
        label: 'Past Due',
      },
      cancelled: {
        bg: 'bg-gray-100 dark:bg-gray-900/20',
        text: 'text-gray-800 dark:text-gray-300',
        label: 'Cancelled',
      },
    };
    const config = configs[status as keyof typeof configs] || configs.cancelled;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getUsagePercentage = (current: number, limit: number | null) => {
    if (!limit) return 0;
    return Math.min((current / limit) * 100, 100);
  };

  return (
    <DashboardLayout
      title="Billing & Usage"
      description="Manage your subscription, usage, and payment methods"
      headerActions={
        <Link
          href="/billing/plans"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Cog6ToothIcon className="h-4 w-4 mr-2" />
          Manage Plan
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Current Plan Overview */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <CreditCardIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {subscriptionData.plan} Plan
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatCurrency(subscriptionData.price)}/
                  {subscriptionData.billingCycle}
                </p>
              </div>
            </div>
            {getStatusBadge(subscriptionData.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Plan Features
              </h3>
              <ul className="space-y-2">
                {subscriptionData.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                  >
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Next Billing Date
                </h3>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {new Date(
                    subscriptionData.nextBillingDate,
                  ).toLocaleDateString()}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Amount Due
                </h3>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <BanknotesIcon className="h-4 w-4 mr-2" />
                  {formatCurrency(subscriptionData.price)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                href="/billing/plans"
                className="block w-full px-4 py-2 text-center text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                Change Plan
              </Link>
              <button className="block w-full px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: ChartBarIcon },
              { id: 'usage', label: 'Usage', icon: ChartBarIcon },
              { id: 'invoices', label: 'Invoices', icon: DocumentTextIcon },
              { id: 'payment', label: 'Payment Methods', icon: CreditCardIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'usage' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Current Usage
              </h3>
              <div className="space-y-6">
                {Object.entries(usageData).map(([key, data]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {data.current}
                        {'unit' in data ? data.unit || '' : ''}
                        {data.limit
                          ? ` / ${data.limit}${'unit' in data ? data.unit || '' : ''}`
                          : ' (Unlimited)'}
                      </span>
                    </div>
                    {data.limit && (
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            getUsagePercentage(data.current, data.limit) > 80
                              ? 'bg-red-500'
                              : getUsagePercentage(data.current, data.limit) >
                                  60
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                          }`}
                          style={{
                            width: `${getUsagePercentage(data.current, data.limit)}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Billing History
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Download
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {invoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {invoice.id}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {invoice.period}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(invoice.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Paid
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Payment Methods
                </h3>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                  Add Payment Method
                </button>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                          <CreditCardIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            •••• •••• •••• {method.last4}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Expires {method.expMonth}/{method.expYear}
                          </div>
                        </div>
                        {method.isDefault && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                          Edit
                        </button>
                        <button className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
