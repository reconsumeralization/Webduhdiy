'use client';

import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  LightBulbIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarDaysIcon,
  BellIcon,
  FolderIcon,
  ShareIcon,
  EyeIcon,
  HandRaisedIcon,
  AcademicCapIcon,
  BookOpenIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  StarIcon,
  TagIcon,
  ArrowRightIcon,
  VideoCameraIcon,
  MicrophoneIcon,
} from '@heroicons/react/24/outline';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  timezone: string;
  skills: string[];
  projects: string[];
  lastActivity: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'on_hold' | 'completed';
  progress: number;
  members: string[];
  deadline: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
}

interface Discussion {
  id: string;
  title: string;
  category: 'question' | 'announcement' | 'feature_request' | 'bug_report';
  author: string;
  timestamp: number;
  replies: number;
  views: number;
  tags: string[];
  solved: boolean;
  upvotes: number;
}

interface CodeReview {
  id: string;
  title: string;
  author: string;
  repository: string;
  branch: string;
  status: 'pending' | 'approved' | 'changes_requested' | 'merged';
  reviewers: {
    id: string;
    status: 'pending' | 'approved' | 'changes_requested';
  }[];
  linesChanged: number;
  comments: number;
  timestamp: number;
}

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  author: string;
  content: string;
  tags: string[];
  views: number;
  likes: number;
  lastUpdated: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const CollaborationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'team' | 'projects' | 'discussions' | 'reviews' | 'knowledge'
  >('overview');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [codeReviews, setCodeReviews] = useState<CodeReview[]>([]);
  const [knowledgeArticles, setKnowledgeArticles] = useState<
    KnowledgeArticle[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateMockData = () => {
      const mockMembers: TeamMember[] = [
        {
          id: 'member-1',
          name: 'Sarah Chen',
          avatar: '/api/placeholder/32/32',
          role: 'Senior Frontend Developer',
          status: 'online',
          timezone: 'PST',
          skills: ['React', 'TypeScript', 'UI/UX Design'],
          projects: ['project-1', 'project-2'],
          lastActivity: Date.now() - 300000,
        },
        {
          id: 'member-2',
          name: 'Marcus Johnson',
          avatar: '/api/placeholder/32/32',
          role: 'Backend Engineer',
          status: 'online',
          timezone: 'EST',
          skills: ['Node.js', 'Python', 'Database Design'],
          projects: ['project-1', 'project-3'],
          lastActivity: Date.now() - 600000,
        },
        {
          id: 'member-3',
          name: 'Elena Rodriguez',
          avatar: '/api/placeholder/32/32',
          role: 'DevOps Engineer',
          status: 'away',
          timezone: 'MST',
          skills: ['AWS', 'Docker', 'Kubernetes'],
          projects: ['project-2', 'project-3'],
          lastActivity: Date.now() - 1800000,
        },
        {
          id: 'member-4',
          name: 'David Kim',
          avatar: '/api/placeholder/32/32',
          role: 'Product Manager',
          status: 'busy',
          timezone: 'PST',
          skills: ['Product Strategy', 'Analytics', 'User Research'],
          projects: ['project-1', 'project-2', 'project-3'],
          lastActivity: Date.now() - 900000,
        },
      ];

      const mockProjects: Project[] = [
        {
          id: 'project-1',
          name: 'E-commerce Platform Redesign',
          description:
            'Complete UI/UX overhaul of the main e-commerce platform',
          status: 'active',
          progress: 65,
          members: ['member-1', 'member-2', 'member-4'],
          deadline: Date.now() + 86400000 * 14,
          priority: 'high',
          tasks: { total: 32, completed: 21, inProgress: 7, pending: 4 },
        },
        {
          id: 'project-2',
          name: 'Mobile App Development',
          description: 'Native mobile app for iOS and Android platforms',
          status: 'active',
          progress: 42,
          members: ['member-1', 'member-3', 'member-4'],
          deadline: Date.now() + 86400000 * 28,
          priority: 'medium',
          tasks: { total: 28, completed: 12, inProgress: 8, pending: 8 },
        },
        {
          id: 'project-3',
          name: 'Infrastructure Migration',
          description: 'Migration to cloud-native architecture',
          status: 'active',
          progress: 78,
          members: ['member-2', 'member-3'],
          deadline: Date.now() + 86400000 * 7,
          priority: 'critical',
          tasks: { total: 15, completed: 12, inProgress: 2, pending: 1 },
        },
      ];

      const mockDiscussions: Discussion[] = [
        {
          id: 'disc-1',
          title:
            'Best practices for React state management in large applications',
          category: 'question',
          author: 'member-1',
          timestamp: Date.now() - 3600000,
          replies: 12,
          views: 145,
          tags: ['React', 'State Management', 'Best Practices'],
          solved: false,
          upvotes: 8,
        },
        {
          id: 'disc-2',
          title: 'New deployment process effective immediately',
          category: 'announcement',
          author: 'member-3',
          timestamp: Date.now() - 7200000,
          replies: 5,
          views: 89,
          tags: ['DevOps', 'Deployment', 'Process'],
          solved: true,
          upvotes: 15,
        },
        {
          id: 'disc-3',
          title: 'Feature request: Dark mode for admin dashboard',
          category: 'feature_request',
          author: 'member-4',
          timestamp: Date.now() - 10800000,
          replies: 18,
          views: 201,
          tags: ['UI/UX', 'Feature Request', 'Dashboard'],
          solved: false,
          upvotes: 23,
        },
      ];

      const mockReviews: CodeReview[] = [
        {
          id: 'review-1',
          title: 'Add user authentication middleware',
          author: 'member-2',
          repository: 'backend-api',
          branch: 'feature/auth-middleware',
          status: 'pending',
          reviewers: [
            { id: 'member-1', status: 'pending' },
            { id: 'member-3', status: 'approved' },
          ],
          linesChanged: 245,
          comments: 8,
          timestamp: Date.now() - 1800000,
        },
        {
          id: 'review-2',
          title: 'Implement shopping cart functionality',
          author: 'member-1',
          repository: 'frontend-app',
          branch: 'feature/shopping-cart',
          status: 'changes_requested',
          reviewers: [
            { id: 'member-2', status: 'changes_requested' },
            { id: 'member-4', status: 'approved' },
          ],
          linesChanged: 187,
          comments: 5,
          timestamp: Date.now() - 3600000,
        },
        {
          id: 'review-3',
          title: 'Update Docker configuration',
          author: 'member-3',
          repository: 'infrastructure',
          branch: 'update/docker-config',
          status: 'approved',
          reviewers: [
            { id: 'member-2', status: 'approved' },
            { id: 'member-1', status: 'approved' },
          ],
          linesChanged: 42,
          comments: 2,
          timestamp: Date.now() - 5400000,
        },
      ];

      const mockKnowledge: KnowledgeArticle[] = [
        {
          id: 'kb-1',
          title: 'Setting up CI/CD pipelines with GitHub Actions',
          category: 'DevOps',
          author: 'member-3',
          content:
            'Complete guide to setting up automated deployment pipelines...',
          tags: ['CI/CD', 'GitHub Actions', 'DevOps'],
          views: 324,
          likes: 42,
          lastUpdated: Date.now() - 86400000,
          difficulty: 'intermediate',
        },
        {
          id: 'kb-2',
          title: 'React Performance Optimization Techniques',
          category: 'Frontend',
          author: 'member-1',
          content:
            'Learn advanced techniques to optimize React applications...',
          tags: ['React', 'Performance', 'Optimization'],
          views: 198,
          likes: 31,
          lastUpdated: Date.now() - 172800000,
          difficulty: 'advanced',
        },
        {
          id: 'kb-3',
          title: 'Database Schema Design Best Practices',
          category: 'Backend',
          author: 'member-2',
          content:
            'Comprehensive guide to designing scalable database schemas...',
          tags: ['Database', 'Schema Design', 'SQL'],
          views: 156,
          likes: 28,
          lastUpdated: Date.now() - 259200000,
          difficulty: 'intermediate',
        },
      ];

      setTeamMembers(mockMembers);
      setProjects(mockProjects);
      setDiscussions(mockDiscussions);
      setCodeReviews(mockReviews);
      setKnowledgeArticles(mockKnowledge);
      setIsLoading(false);
    };

    setTimeout(generateMockData, 1000);

    // Real-time updates simulation
    const interval = setInterval(() => {
      setTeamMembers((prev) =>
        prev.map((member) => ({
          ...member,
          lastActivity:
            member.status === 'online' ? Date.now() : member.lastActivity,
        })),
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getReviewStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'changes_requested':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'merged':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Collaboration Hub
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time team collaboration and project management
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
            <VideoCameraIcon className="h-4 w-4" />
            <span>Start Meeting</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2">
            <PlusIcon className="h-4 w-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: UserGroupIcon },
            { id: 'team', name: 'Team', icon: UserIcon },
            { id: 'projects', name: 'Projects', icon: FolderIcon },
            {
              id: 'discussions',
              name: 'Discussions',
              icon: ChatBubbleLeftRightIcon,
            },
            { id: 'reviews', name: 'Code Reviews', icon: CodeBracketIcon },
            { id: 'knowledge', name: 'Knowledge Base', icon: BookOpenIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Team Members
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {teamMembers.length}
                  </p>
                </div>
                <UserGroupIcon className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-sm text-green-600 mt-2">
                {teamMembers.filter((m) => m.status === 'online').length} online
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Projects
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {projects.filter((p) => p.status === 'active').length}
                  </p>
                </div>
                <FolderIcon className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {Math.round(
                  projects.reduce((sum, p) => sum + p.progress, 0) /
                    projects.length,
                )}
                % avg progress
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Pending Reviews
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {codeReviews.filter((r) => r.status === 'pending').length}
                  </p>
                </div>
                <CodeBracketIcon className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-sm text-orange-600 mt-2">needs attention</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Open Discussions
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {discussions.filter((d) => !d.solved).length}
                  </p>
                </div>
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {discussions.reduce((sum, d) => sum + d.replies, 0)} total
                replies
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Status */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Team Status
              </h3>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}
                        ></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 capitalize">
                        {member.status}
                      </p>
                      <p className="text-xs text-gray-400">
                        {Math.round((Date.now() - member.lastActivity) / 60000)}
                        m ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Code Reviews */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Code Reviews
              </h3>
              <div className="space-y-4">
                {codeReviews.slice(0, 3).map((review) => (
                  <div
                    key={review.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {review.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {review.repository} • {review.linesChanged} lines
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getReviewStatusColor(review.status)}`}
                    >
                      {review.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Progress */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Project Progress
            </h3>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {project.tasks.completed}/{project.tasks.total} tasks
                        completed
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(project.priority)}`}
                      >
                        {project.priority}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-gray-600" />
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}
                      ></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {member.role}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {member.status} • {member.timezone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700">
                      Message
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <VideoCameraIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Active Projects
                    </h4>
                    <div className="space-y-1">
                      {member.projects.map((projectId) => {
                        const project = projects.find(
                          (p) => p.id === projectId,
                        );
                        return project ? (
                          <p
                            key={projectId}
                            className="text-xs text-gray-600 dark:text-gray-400"
                          >
                            {project.name}
                          </p>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Activity
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Last active:{' '}
                      {Math.round((Date.now() - member.lastActivity) / 60000)}{' '}
                      minutes ago
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {project.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(project.priority)}`}
                      >
                        {project.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {project.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">
                      {project.progress}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      complete
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-purple-500 h-3 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tasks
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-green-600">Completed:</span>
                        <span>{project.tasks.completed}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-yellow-600">In Progress:</span>
                        <span>{project.tasks.inProgress}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Pending:</span>
                        <span>{project.tasks.pending}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Team
                    </h4>
                    <div className="flex -space-x-2">
                      {project.members.map((memberId) => {
                        const member = teamMembers.find(
                          (m) => m.id === memberId,
                        );
                        return member ? (
                          <div
                            key={memberId}
                            className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center"
                          >
                            <UserIcon className="h-3 w-3 text-gray-600" />
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </h4>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        project.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : project.status === 'on_hold'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Deadline
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {Math.round((project.deadline - Date.now()) / 86400000)}{' '}
                      days left
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discussions Tab */}
      {activeTab === 'discussions' && (
        <div className="space-y-6">
          <div className="grid gap-4">
            {discussions.map((discussion) => (
              <div
                key={discussion.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {discussion.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          discussion.category === 'question'
                            ? 'bg-blue-100 text-blue-800'
                            : discussion.category === 'announcement'
                              ? 'bg-purple-100 text-purple-800'
                              : discussion.category === 'feature_request'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {discussion.category.replace('_', ' ')}
                      </span>
                      {discussion.solved && (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span>
                        by{' '}
                        {
                          teamMembers.find((m) => m.id === discussion.author)
                            ?.name
                        }
                      </span>
                      <span>•</span>
                      <span>
                        {Math.round(
                          (Date.now() - discussion.timestamp) / 3600000,
                        )}{' '}
                        hours ago
                      </span>
                      <span>•</span>
                      <span>{discussion.replies} replies</span>
                      <span>•</span>
                      <span>{discussion.views} views</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {discussion.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <HandRaisedIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {discussion.upvotes}
                      </span>
                    </div>
                    <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {codeReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {review.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getReviewStatusColor(review.status)}`}
                      >
                        {review.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        by{' '}
                        {teamMembers.find((m) => m.id === review.author)?.name}
                      </span>
                      <span>•</span>
                      <span>
                        {review.repository}/{review.branch}
                      </span>
                      <span>•</span>
                      <span>{review.linesChanged} lines changed</span>
                      <span>•</span>
                      <span>{review.comments} comments</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round((Date.now() - review.timestamp) / 3600000)}{' '}
                      hours ago
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reviewers
                    </h4>
                    <div className="flex items-center space-x-2">
                      {review.reviewers.map((reviewer) => {
                        const member = teamMembers.find(
                          (m) => m.id === reviewer.id,
                        );
                        return member ? (
                          <div
                            key={reviewer.id}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                              <UserIcon className="h-3 w-3 text-gray-600" />
                            </div>
                            <span
                              className={`text-xs ${
                                reviewer.status === 'approved'
                                  ? 'text-green-600'
                                  : reviewer.status === 'changes_requested'
                                    ? 'text-red-600'
                                    : 'text-yellow-600'
                              }`}
                            >
                              {reviewer.status.replace('_', ' ')}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Review
                    </button>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      View Diff
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Knowledge Base Tab */}
      {activeTab === 'knowledge' && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {knowledgeArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {article.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          article.difficulty === 'beginner'
                            ? 'bg-green-100 text-green-800'
                            : article.difficulty === 'intermediate'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {article.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span>
                        by{' '}
                        {teamMembers.find((m) => m.id === article.author)?.name}
                      </span>
                      <span>•</span>
                      <span>{article.category}</span>
                      <span>•</span>
                      <span>
                        {Math.round(
                          (Date.now() - article.lastUpdated) / 86400000,
                        )}{' '}
                        days ago
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {article.content.slice(0, 150)}...
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {article.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div className="flex items-center space-x-1">
                        <EyeIcon className="h-4 w-4" />
                        <span>{article.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <StarIcon className="h-4 w-4" />
                        <span>{article.likes}</span>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborationHub;
