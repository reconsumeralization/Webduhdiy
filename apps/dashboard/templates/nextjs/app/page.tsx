import {
  ArrowRight,
  CheckCircle,
  Globe,
  Zap,
  Shield,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">WebduhApp</div>
          <div className="hidden md:flex space-x-8">
            <Link
              href="#features"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </Link>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
              Sign In
            </button>
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Build the Future
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {' '}
              Today
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Deploy your applications instantly with our enterprise-grade
            platform. Scale globally, secure by default, powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
              Start Building
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="px-8 py-4 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Built for developers, designed for scale, optimized for performance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-purple-400" />}
            title="Lightning Fast"
            description="Deploy in seconds with our global edge network. Sub-50ms response times worldwide."
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-purple-400" />}
            title="Enterprise Security"
            description="SOC2 compliant with end-to-end encryption, SSO, and advanced access controls."
          />
          <FeatureCard
            icon={<Globe className="h-8 w-8 text-purple-400" />}
            title="Global Scale"
            description="200+ edge locations worldwide. Handle millions of users effortlessly."
          />
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8 text-purple-400" />}
            title="Real-time Analytics"
            description="Comprehensive insights into performance, usage, and user behavior."
          />
          <FeatureCard
            icon={<CheckCircle className="h-8 w-8 text-purple-400" />}
            title="99.99% Uptime"
            description="Enterprise-grade reliability with automatic failover and redundancy."
          />
          <FeatureCard
            icon={<ArrowRight className="h-8 w-8 text-purple-400" />}
            title="Easy Integration"
            description="Connect with your favorite tools and services in minutes, not hours."
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gray-800/50 rounded-2xl p-12 backdrop-blur-sm">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <StatCard number="10M+" label="Deployments" />
            <StatCard number="99.99%" label="Uptime" />
            <StatCard number="200+" label="Edge Locations" />
            <StatCard number="50ms" label="Global Latency" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Join thousands of developers building the future with our platform.
          </p>
          <button className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg">
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-gray-800">
        <div className="text-center text-gray-400">
          <p>&copy; 2025 WebduhApp. Built with WebduhVercel Platform.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-gray-800/70 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-purple-400 mb-2">{number}</div>
      <div className="text-gray-300">{label}</div>
    </div>
  );
}
