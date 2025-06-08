'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@webduh/shared-ui/src/components/Button';
import { ThemeToggle, useTheme } from '@webduh/shared-ui/src/hooks/useTheme';
import {
  GitBranch,
  Upload,
  Zap,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  ExternalLink,
  Play,
  Settings,
  RefreshCw,
  Download,
  Terminal,
  Layers,
  Activity,
} from 'lucide-react';

interface Deployment {
  id: string;
  projectName: string;
  status: 'building' | 'ready' | 'error' | 'deploying';
  url: string;
  branch: string;
  commit: string;
  commitMessage: string;
  createdAt: string;
  buildTime: string;
  domain: string;
}

const mockDeployments: Deployment[] = [
  {
    id: '1',
    projectName: 'NextJS Portfolio',
    status: 'ready',
    url: 'https://portfolio-abc123.webduhvercel.app',
    branch: 'main',
    commit: 'a1b2c3d',
    commitMessage: 'Add new portfolio section',
    createdAt: '2025-02-06T10:30:00Z',
    buildTime: '45s',
    domain: 'portfolio.example.com',
  },
  {
    id: '2',
    projectName: 'E-commerce Store',
    status: 'building',
    url: 'https://store-def456.webduhvercel.app',
    branch: 'feature/checkout',
    commit: 'e4f5g6h',
    commitMessage: 'Implement payment gateway',
    createdAt: '2025-02-06T11:15:00Z',
    buildTime: '2m 15s',
    domain: 'store.example.com',
  },
  {
    id: '3',
    projectName: 'Blog Platform',
    status: 'error',
    url: 'https://blog-ghi789.webduhvercel.app',
    branch: 'main',
    commit: 'i7j8k9l',
    commitMessage: 'Fix build configuration',
    createdAt: '2025-02-06T09:45:00Z',
    buildTime: '1m 32s',
    domain: 'blog.example.com',
  },
];

export default function DeploymentsPage() {
  const { theme, resolvedTheme } = useTheme();
  const [selectedDeployment, setSelectedDeployment] = useState<string | null>(
    null,
  );
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployments, setDeployments] = useState<Deployment[]>(mockDeployments);

  const getStatusIcon = (status: Deployment['status']) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'building':
      case 'deploying':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status: Deployment['status']) => {
    switch (status) {
      case 'ready':
        return 'Ready';
      case 'building':
        return 'Building';
      case 'deploying':
        return 'Deploying';
      case 'error':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const handleNewDeployment = async (type: 'git' | 'upload' | 'template') => {
    setIsDeploying(true);

    // Simulate deployment process
    const newDeployment: Deployment = {
      id: Date.now().toString(),
      projectName: `New Project (${type})`,
      status: 'building',
      url: `https://new-${Date.now()}.webduhvercel.app`,
      branch: 'main',
      commit: 'pending',
      commitMessage: 'Initial deployment',
      createdAt: new Date().toISOString(),
      buildTime: '0s',
      domain: '',
    };

    setDeployments((prev) => [newDeployment, ...prev]);

    // Simulate build progress
    setTimeout(() => {
      setDeployments((prev) =>
        prev.map((d) =>
          d.id === newDeployment.id
            ? { ...d, status: 'deploying' as const, buildTime: '1m 15s' }
            : d,
        ),
      );
    }, 2000);

    setTimeout(() => {
      setDeployments((prev) =>
        prev.map((d) =>
          d.id === newDeployment.id
            ? {
                ...d,
                status: 'ready' as const,
                buildTime: '1m 45s',
                commit: 'a9b8c7d',
                domain: `${type}-project.example.com`,
              }
            : d,
        ),
      );
      setIsDeploying(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Deployments
              </h1>
              <p className="text-muted-foreground mt-2">
                Deploy your applications instantly with enterprise-grade
                infrastructure
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button
                variant="gradient"
                size="lg"
                icon={<Zap className="w-4 h-4" />}
                onClick={() => handleNewDeployment('git')}
                loading={isDeploying}
              >
                New Deployment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Deployment Options */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Deploy From
              </h2>

              <Button
                variant="outline"
                className="w-full justify-start"
                icon={<GitBranch className="w-4 h-4" />}
                onClick={() => handleNewDeployment('git')}
                disabled={isDeploying}
              >
                Git Repository
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                icon={<Upload className="w-4 h-4" />}
                onClick={() => handleNewDeployment('upload')}
                disabled={isDeploying}
              >
                Upload Files
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                icon={<Layers className="w-4 h-4" />}
                onClick={() => handleNewDeployment('template')}
                disabled={isDeploying}
              >
                From Template
              </Button>

              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-foreground mb-3">
                  Quick Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active</span>
                    <span className="text-green-600 font-medium">
                      {deployments.filter((d) => d.status === 'ready').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Building</span>
                    <span className="text-blue-600 font-medium">
                      {
                        deployments.filter((d) =>
                          ['building', 'deploying'].includes(d.status),
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Failed</span>
                    <span className="text-red-600 font-medium">
                      {deployments.filter((d) => d.status === 'error').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Features */}
            <div className="bg-card rounded-xl border border-border p-6 mt-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Platform Features
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Global Edge Network
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Instant Deployments
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Real-time Analytics
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Auto-scaling
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Deployments List */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-xl border border-border">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">
                    Recent Deployments
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<RefreshCw className="w-4 h-4" />}
                  >
                    Refresh
                  </Button>
                </div>
              </div>

              <div className="divide-y divide-border">
                {deployments.map((deployment) => (
                  <div
                    key={deployment.id}
                    className="p-6 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedDeployment(deployment.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(deployment.status)}
                          <h3 className="font-semibold text-foreground">
                            {deployment.projectName}
                          </h3>
                          <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                            {getStatusText(deployment.status)}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            {deployment.branch}
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                            {deployment.commit}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {deployment.buildTime}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {deployment.commitMessage}
                        </p>

                        <div className="flex items-center gap-2">
                          <a
                            href={deployment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {deployment.url}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          {deployment.domain && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">
                                {deployment.domain}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Eye className="w-4 h-4" />}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Terminal className="w-4 h-4" />}
                        >
                          Logs
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Settings className="w-4 h-4" />}
                        >
                          Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {deployments.length === 0 && (
                <div className="p-12 text-center">
                  <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No deployments yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Get started by deploying your first project
                  </p>
                  <Button
                    variant="default"
                    icon={<Zap className="w-4 h-4" />}
                    onClick={() => handleNewDeployment('git')}
                  >
                    Create Deployment
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
