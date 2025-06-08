// User & Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'member' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
  subscription: Subscription;
  teams: Team[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  timezone: string;
  language: string;
  defaultRegion: string;
}

export interface NotificationSettings {
  deployments: boolean;
  builds: boolean;
  domains: boolean;
  billing: boolean;
  security: boolean;
  email: boolean;
  sms: boolean;
  slack: boolean;
}

export interface Subscription {
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  periodEnd: Date;
  usage: Usage;
  limits: PlanLimits;
}

export interface Usage {
  bandwidth: number;
  builds: number;
  functions: number;
  edgeFunctions: number;
  analytics: number;
  storage: number;
}

export interface PlanLimits {
  bandwidth: number;
  builds: number;
  functions: number;
  edgeFunctions: number;
  analytics: number;
  storage: number;
  domains: number;
  teamMembers: number;
}

// Project & Deployment Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  framework: Framework;
  repository: Repository;
  domains: Domain[];
  deployments: Deployment[];
  environmentVariables: EnvironmentVariable[];
  settings: ProjectSettings;
  analytics: ProjectAnalytics;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  teamId?: string;
  status: 'active' | 'paused' | 'archived';
  visibility: 'public' | 'private';
  buildCommand?: string;
  outputDirectory?: string;
  installCommand?: string;
  devCommand?: string;
  rootDirectory?: string;
}

export interface Framework {
  name: string;
  slug: string;
  logo: string;
  description: string;
  website: string;
  detectionStrategy: DetectionStrategy;
  buildSettings: BuildSettings;
  presets: FrameworkPreset[];
}

export interface DetectionStrategy {
  packageJsonDependencies?: string[];
  configFiles?: string[];
  envKeys?: string[];
}

export interface BuildSettings {
  buildCommand: string;
  outputDirectory: string;
  installCommand: string;
  devCommand: string;
}

export interface FrameworkPreset {
  name: string;
  buildCommand?: string;
  outputDirectory?: string;
  installCommand?: string;
  devCommand?: string;
  environmentVariables?: Record<string, string>;
}

export interface Repository {
  type: 'github' | 'gitlab' | 'bitbucket';
  url: string;
  branch: string;
  rootDirectory?: string;
  private: boolean;
  owner: string;
  name: string;
  fullName: string;
}

export interface Deployment {
  id: string;
  url: string;
  state: 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED' | 'QUEUED';
  type: 'LAMBDAS' | 'STATIC';
  target: 'production' | 'preview' | 'development';
  source: DeploymentSource;
  build: Build;
  functions: EdgeFunction[];
  routes: Route[];
  headers: Header[];
  redirects: Redirect[];
  meta: Record<string, any>;
  createdAt: Date;
  readyAt?: Date;
  projectId: string;
  creatorId: string;
  checks: Check[];
  regions: string[];
  alias: string[];
}

export interface DeploymentSource {
  type: 'git' | 'cli' | 'api' | 'import';
  ref?: string;
  sha?: string;
  repoId?: string;
  message?: string;
  author?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface Build {
  id: string;
  status: 'PENDING' | 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED';
  logs: BuildLog[];
  output: BuildOutput;
  cache: BuildCache;
  duration: number;
  startedAt: Date;
  completedAt?: Date;
  region: string;
  runtime: Runtime;
}

export interface BuildLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  source: string;
}

export interface BuildOutput {
  size: number;
  files: OutputFile[];
  staticAssets: number;
  serverlessFunction: number;
  edgeFunctions: number;
}

export interface OutputFile {
  path: string;
  size: number;
  type: 'static' | 'function' | 'edge';
  checksum: string;
}

export interface BuildCache {
  status: 'HIT' | 'MISS' | 'PARTIAL';
  keys: string[];
  size: number;
  duration: number;
}

export interface Runtime {
  name: string;
  version: string;
  region: string;
  memory: number;
  timeout: number;
}

// Domain Types
export interface Domain {
  id: string;
  name: string;
  verified: boolean;
  verification: DomainVerification[];
  nameservers: string[];
  customNameservers?: string[];
  dnsRecords: DNSRecord[];
  sslCertificate?: SSLCertificate;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  isApex: boolean;
  redirect?: string;
  gitBranch?: string;
}

export interface DomainVerification {
  type: 'TXT' | 'CNAME' | 'A';
  domain: string;
  value: string;
  reason: string;
}

export interface DNSRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX' | 'SRV';
  name: string;
  value: string;
  ttl: number;
  priority?: number;
  weight?: number;
  port?: number;
  target?: string;
  mxPriority?: number;
}

export interface SSLCertificate {
  id: string;
  domains: string[];
  expiresAt: Date;
  issuer: string;
  serial: string;
  autoRenew: boolean;
  status: 'pending' | 'issued' | 'expired' | 'revoked';
}

// Team & Collaboration Types
export interface Team {
  id: string;
  name: string;
  slug: string;
  avatar?: string;
  description?: string;
  plan: string;
  members: TeamMember[];
  invites: TeamInvite[];
  projects: Project[];
  settings: TeamSettings;
  billing: TeamBilling;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  userId: string;
  user: User;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
  invitedBy: string;
}

export interface TeamInvite {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  token: string;
  expiresAt: Date;
  createdAt: Date;
  invitedBy: string;
}

export interface TeamSettings {
  requireTwoFactor: boolean;
  allowedDomains: string[];
  ssoEnabled: boolean;
  auditLogRetention: number;
  defaultRole: 'member' | 'viewer';
}

export interface TeamBilling {
  customerId: string;
  subscriptionId: string;
  paymentMethod: PaymentMethod;
  invoices: Invoice[];
  usage: Usage;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  default: boolean;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  dueDate: Date;
  paidAt?: Date;
  downloadUrl: string;
}

// Environment & Configuration Types
export interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  encrypted: boolean;
  target: 'production' | 'preview' | 'development' | 'all';
  type: 'plain' | 'secret' | 'system';
  gitBranch?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectSettings {
  framework?: string;
  buildCommand?: string;
  outputDirectory?: string;
  installCommand?: string;
  devCommand?: string;
  rootDirectory?: string;
  nodeVersion?: string;
  autoAssignCustomDomain: boolean;
  passwordProtection?: {
    enabled: boolean;
    password: string;
  };
  trustedIps?: string[];
  headers: Header[];
  redirects: Redirect[];
  rewrites: Rewrite[];
  functions: FunctionConfig;
  analytics: AnalyticsConfig;
  sourceProtection: boolean;
  directoryListing: boolean;
  cleanUrls: boolean;
  trailingSlash?: boolean;
}

export interface Header {
  source: string;
  headers: Record<string, string>;
}

export interface Redirect {
  source: string;
  destination: string;
  permanent: boolean;
  statusCode?: number;
}

export interface Rewrite {
  source: string;
  destination: string;
}

export interface FunctionConfig {
  runtime: string;
  memory: number;
  timeout: number;
  regions: string[];
  environmentVariables: Record<string, string>;
}

// Analytics Types
export interface ProjectAnalytics {
  pageViews: AnalyticsData[];
  uniqueVisitors: AnalyticsData[];
  topPages: PageAnalytics[];
  topCountries: CountryAnalytics[];
  topReferrers: ReferrerAnalytics[];
  topDevices: DeviceAnalytics[];
  bandwidth: BandwidthAnalytics[];
  performance: PerformanceAnalytics;
  webVitals: WebVitalsData[];
}

export interface AnalyticsData {
  timestamp: Date;
  value: number;
}

export interface PageAnalytics {
  path: string;
  views: number;
  uniqueVisitors: number;
  avgDuration: number;
  bounceRate: number;
}

export interface CountryAnalytics {
  country: string;
  countryCode: string;
  visitors: number;
  percentage: number;
}

export interface ReferrerAnalytics {
  referrer: string;
  visitors: number;
  percentage: number;
}

export interface DeviceAnalytics {
  device: string;
  type: 'desktop' | 'mobile' | 'tablet';
  visitors: number;
  percentage: number;
}

export interface BandwidthAnalytics {
  timestamp: Date;
  bytes: number;
  requests: number;
}

export interface PerformanceAnalytics {
  avgLoadTime: number;
  avgFCP: number;
  avgLCP: number;
  avgCLS: number;
  avgFID: number;
  p95LoadTime: number;
  lighthouseScore: number;
}

export interface WebVitalsData {
  timestamp: Date;
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  ttfb: number;
  url: string;
}

export interface AnalyticsConfig {
  enabled: boolean;
  anonymizeIps: boolean;
  cookieConsent: boolean;
  dataRetention: number;
  customEvents: boolean;
}

// Function & Edge Types
export interface EdgeFunction {
  id: string;
  name: string;
  source: string;
  regions: string[];
  runtime: string;
  memory: number;
  timeout: number;
  environmentVariables: Record<string, string>;
  routes: string[];
  logs: FunctionLog[];
  metrics: FunctionMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface FunctionLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  requestId: string;
  duration: number;
  region: string;
}

export interface FunctionMetrics {
  invocations: number;
  errors: number;
  duration: number;
  coldStarts: number;
  memory: number;
  bandwidth: number;
}

export interface Route {
  src: string;
  dest?: string;
  methods?: string[];
  headers?: Record<string, string>;
  status?: number;
  continue?: boolean;
  caseSensitive?: boolean;
  check?: boolean;
  important?: boolean;
  middleware?: number;
}

// Monitoring & Checks Types
export interface Check {
  id: string;
  name: string;
  path: string;
  status: 'running' | 'completed' | 'failed' | 'canceled';
  conclusion:
    | 'success'
    | 'failure'
    | 'neutral'
    | 'cancelled'
    | 'timed_out'
    | 'action_required';
  output: CheckOutput;
  blocking: boolean;
  rerequestable: boolean;
  createdAt: Date;
  completedAt?: Date;
  detailsUrl?: string;
}

export interface CheckOutput {
  title: string;
  summary: string;
  text?: string;
  annotations: CheckAnnotation[];
}

export interface CheckAnnotation {
  path: string;
  startLine: number;
  endLine: number;
  startColumn?: number;
  endColumn?: number;
  annotationLevel: 'notice' | 'warning' | 'failure';
  message: string;
  title?: string;
  rawDetails?: string;
}

// Activity & Audit Types
export interface Activity {
  id: string;
  type: ActivityType;
  user: User;
  team?: Team;
  project?: Project;
  deployment?: Deployment;
  data: Record<string, any>;
  createdAt: Date;
  ipAddress: string;
  userAgent: string;
}

export type ActivityType =
  | 'project.created'
  | 'project.deleted'
  | 'project.updated'
  | 'deployment.created'
  | 'deployment.promoted'
  | 'deployment.deleted'
  | 'domain.added'
  | 'domain.removed'
  | 'domain.verified'
  | 'team.created'
  | 'team.member.added'
  | 'team.member.removed'
  | 'team.member.role.changed'
  | 'environment.created'
  | 'environment.updated'
  | 'environment.deleted'
  | 'webhook.created'
  | 'webhook.deleted'
  | 'integration.added'
  | 'integration.removed';

// Webhook Types
export interface Webhook {
  id: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  active: boolean;
  headers: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  lastDelivery?: WebhookDelivery;
  projectId?: string;
  teamId?: string;
}

export type WebhookEvent =
  | 'deployment.created'
  | 'deployment.ready'
  | 'deployment.error'
  | 'deployment.canceled'
  | 'deployment.promoted'
  | 'project.created'
  | 'project.removed'
  | 'domain.created'
  | 'domain.removed'
  | 'check.completed';

export interface WebhookDelivery {
  id: string;
  event: WebhookEvent;
  payload: Record<string, any>;
  response: {
    status: number;
    headers: Record<string, string>;
    body: string;
  };
  success: boolean;
  attempts: number;
  timestamp: Date;
  duration: number;
}

// Integration Types
export interface Integration {
  id: string;
  type: 'github' | 'gitlab' | 'bitbucket' | 'slack' | 'discord' | 'vercel';
  name: string;
  configuration: Record<string, any>;
  enabled: boolean;
  scopes: string[];
  token: string;
  refreshToken?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  teamId?: string;
  userId: string;
}

// File Upload Types
export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  path: string;
  metadata: Record<string, any>;
  createdAt: Date;
  userId: string;
  projectId?: string;
}

// Search & Filter Types
export interface SearchResult {
  id: string;
  type: 'project' | 'deployment' | 'domain' | 'team' | 'user';
  title: string;
  description: string;
  url: string;
  metadata: Record<string, any>;
  score: number;
}

export interface FilterOptions {
  search?: string;
  status?: string[];
  type?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  owner?: string;
  team?: string;
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  page?: number;
  limit?: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  error?: ApiError;
  pagination?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// WebSocket Types
export interface WebSocketMessage {
  type: string;
  data: any;
  id?: string;
  timestamp: Date;
}

export interface DeploymentEvent extends WebSocketMessage {
  type: 'deployment.update';
  data: {
    deploymentId: string;
    projectId: string;
    status: Deployment['state'];
    progress: number;
    logs?: BuildLog[];
  };
}

export interface BuildEvent extends WebSocketMessage {
  type: 'build.update';
  data: {
    buildId: string;
    deploymentId: string;
    status: Build['status'];
    logs: BuildLog[];
    output?: BuildOutput;
  };
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

export type EntityWithId<T> = T & {
  id: string;
};

// Form Types
export interface FormState<T = any> {
  data: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: React.ComponentType;
}

// UI Component Types
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType;
  disabled?: boolean;
  badge?: string | number;
  content: React.ReactNode;
}

// Theme Types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fontSize: 'sm' | 'md' | 'lg';
  density: 'compact' | 'comfortable' | 'spacious';
}

// State Management Types
export interface GlobalState {
  user: User | null;
  currentTeam: Team | null;
  projects: Project[];
  notifications: Notification[];
  ui: UIState;
  realtime: RealtimeState;
}

export interface UIState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  loading: boolean;
  theme: ThemeConfig;
  modals: Record<string, boolean>;
}

export interface RealtimeState {
  connected: boolean;
  deploymentUpdates: Record<string, DeploymentEvent>;
  buildLogs: Record<string, BuildLog[]>;
  analytics: Record<string, AnalyticsData[]>;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  primary?: boolean;
}

// Export default type collections
export type {
  User as WebduhUser,
  Project as WebduhProject,
  Deployment as WebduhDeployment,
  Team as WebduhTeam,
  Domain as WebduhDomain,
  ProjectAnalytics as WebduhAnalytics,
};
