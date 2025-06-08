const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require('@octokit/auth-app');
const crypto = require('crypto');
const JSZip = require('jszip');
const winston = require('winston');

class GitHubService {
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'github.log' }),
      ],
    });

    // GitHub App configuration
    this.appId = process.env.GITHUB_APP_ID;
    this.privateKey = process.env.GITHUB_PRIVATE_KEY;
    this.clientId = process.env.GITHUB_CLIENT_ID;
    this.clientSecret = process.env.GITHUB_CLIENT_SECRET;
    this.webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

    // Initialize Octokit with app authentication if available
    if (this.appId && this.privateKey) {
      this.appOctokit = new Octokit({
        authStrategy: createAppAuth,
        auth: {
          appId: this.appId,
          privateKey: this.privateKey,
        },
      });
    }

    // Rate limiting cache
    this.rateLimitCache = new Map();
    this.requestCache = new Map();
  }

  /**
   * Create user-authenticated Octokit instance
   */
  createUserOctokit(accessToken) {
    return new Octokit({
      auth: accessToken,
      request: {
        retries: 3,
        retryAfter: 2,
      },
    });
  }

  /**
   * Exchange code for access token (OAuth flow)
   */
  async exchangeCodeForToken(code, state) {
    try {
      const response = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code,
            state,
          }),
        },
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(`GitHub OAuth error: ${data.error_description}`);
      }

      return {
        access_token: data.access_token,
        token_type: data.token_type,
        scope: data.scope,
      };
    } catch (error) {
      this.logger.error('GitHub OAuth token exchange failed:', error);
      throw error;
    }
  }

  /**
   * Get user information from GitHub
   */
  async getUserInfo(accessToken) {
    const octokit = this.createUserOctokit(accessToken);

    try {
      const { data: user } = await octokit.rest.users.getAuthenticated();
      const { data: emails } =
        await octokit.rest.users.listEmailsForAuthenticatedUser();

      return {
        id: user.id,
        login: user.login,
        name: user.name,
        email: emails.find((email) => email.primary)?.email,
        avatar_url: user.avatar_url,
        html_url: user.html_url,
        public_repos: user.public_repos,
        private_repos: user.total_private_repos,
      };
    } catch (error) {
      this.logger.error('Failed to get GitHub user info:', error);
      throw error;
    }
  }

  /**
   * List user repositories
   */
  async getUserRepositories(accessToken, options = {}) {
    const octokit = this.createUserOctokit(accessToken);
    const {
      type = 'all',
      sort = 'updated',
      direction = 'desc',
      per_page = 30,
      page = 1,
      affiliation = 'owner,collaborator',
    } = options;

    try {
      const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser(
        {
          type,
          sort,
          direction,
          per_page,
          page,
          affiliation,
        },
      );

      return repos.map((repo) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        private: repo.private,
        fork: repo.fork,
        html_url: repo.html_url,
        clone_url: repo.clone_url,
        ssh_url: repo.ssh_url,
        default_branch: repo.default_branch,
        language: repo.language,
        languages_url: repo.languages_url,
        topics: repo.topics,
        archived: repo.archived,
        disabled: repo.disabled,
        pushed_at: repo.pushed_at,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        size: repo.size,
        stargazers_count: repo.stargazers_count,
        watchers_count: repo.watchers_count,
        forks_count: repo.forks_count,
        open_issues_count: repo.open_issues_count,
        owner: {
          login: repo.owner.login,
          avatar_url: repo.owner.avatar_url,
          type: repo.owner.type,
        },
      }));
    } catch (error) {
      this.logger.error('Failed to list GitHub repositories:', error);
      throw error;
    }
  }

  /**
   * Get repository contents
   */
  async getRepositoryContents(accessToken, owner, repo, path = '', ref = null) {
    const octokit = this.createUserOctokit(accessToken);

    try {
      const params = { owner, repo, path };
      if (ref) params.ref = ref;

      const { data } = await octokit.rest.repos.getContent(params);
      return data;
    } catch (error) {
      this.logger.error('Failed to get repository contents:', error);
      throw error;
    }
  }

  /**
   * Download repository as ZIP
   */
  async downloadRepositoryZip(accessToken, owner, repo, ref = 'main') {
    const octokit = this.createUserOctokit(accessToken);

    try {
      const { data } = await octokit.rest.repos.downloadZipballArchive({
        owner,
        repo,
        ref,
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to download repository ZIP:', error);
      throw error;
    }
  }

  /**
   * Extract files from GitHub repository ZIP
   */
  async extractRepositoryFiles(zipBuffer) {
    try {
      const zip = await JSZip.loadAsync(zipBuffer);
      const files = [];

      // Find root folder
      let rootFolder = '';
      zip.forEach((relativePath) => {
        if (!rootFolder && relativePath.includes('/')) {
          rootFolder = relativePath.split('/')[0];
        }
      });

      // Extract all files
      for (const [filename, zipEntry] of Object.entries(zip.files)) {
        if (zipEntry.dir) continue;
        if (filename === rootFolder) continue;

        // Remove root folder from path
        let normalizedPath = filename;
        if (rootFolder && filename.startsWith(rootFolder + '/')) {
          normalizedPath = filename.substring(rootFolder.length + 1);
        }

        const content = await zipEntry.async('string');
        files.push({
          path: normalizedPath,
          name: normalizedPath.split('/').pop() || '',
          content,
          size: content.length,
        });
      }

      return files;
    } catch (error) {
      this.logger.error('Failed to extract repository files:', error);
      throw error;
    }
  }

  /**
   * Get repository languages
   */
  async getRepositoryLanguages(accessToken, owner, repo) {
    const octokit = this.createUserOctokit(accessToken);

    try {
      const { data } = await octokit.rest.repos.listLanguages({ owner, repo });
      return data;
    } catch (error) {
      this.logger.error('Failed to get repository languages:', error);
      throw error;
    }
  }

  /**
   * Get repository branches
   */
  async getRepositoryBranches(accessToken, owner, repo) {
    const octokit = this.createUserOctokit(accessToken);

    try {
      const { data } = await octokit.rest.repos.listBranches({ owner, repo });
      return data.map((branch) => ({
        name: branch.name,
        commit: {
          sha: branch.commit.sha,
          url: branch.commit.url,
        },
        protected: branch.protected,
      }));
    } catch (error) {
      this.logger.error('Failed to get repository branches:', error);
      throw error;
    }
  }

  /**
   * Create webhook for repository
   */
  async createWebhook(
    accessToken,
    owner,
    repo,
    webhookUrl,
    events = ['push', 'pull_request'],
  ) {
    const octokit = this.createUserOctokit(accessToken);

    try {
      const { data } = await octokit.rest.repos.createWebhook({
        owner,
        repo,
        name: 'web',
        active: true,
        events,
        config: {
          url: webhookUrl,
          content_type: 'json',
          secret: this.webhookSecret,
          insecure_ssl: '0',
        },
      });

      return {
        id: data.id,
        url: data.url,
        events: data.events,
        active: data.active,
        config: data.config,
      };
    } catch (error) {
      this.logger.error('Failed to create webhook:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload, signature) {
    if (!this.webhookSecret) {
      this.logger.warn('Webhook secret not configured');
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex');

    const providedSignature = signature.replace('sha256=', '');
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(providedSignature, 'hex'),
    );
  }

  /**
   * Process webhook payload
   */
  async processWebhook(payload, headers) {
    try {
      const event = headers['x-github-event'];
      const signature = headers['x-hub-signature-256'];
      const deliveryId = headers['x-github-delivery'];

      // Verify signature
      if (!this.verifyWebhookSignature(JSON.stringify(payload), signature)) {
        throw new Error('Invalid webhook signature');
      }

      this.logger.info('Processing GitHub webhook:', {
        event,
        deliveryId,
        repository: payload.repository?.full_name,
      });

      const result = {
        event,
        deliveryId,
        repository: payload.repository,
        processed: true,
        timestamp: new Date(),
      };

      switch (event) {
        case 'push':
          result.data = await this.processPushEvent(payload);
          break;
        case 'pull_request':
          result.data = await this.processPullRequestEvent(payload);
          break;
        case 'release':
          result.data = await this.processReleaseEvent(payload);
          break;
        default:
          result.processed = false;
          this.logger.info('Unhandled webhook event:', event);
      }

      return result;
    } catch (error) {
      this.logger.error('Failed to process webhook:', error);
      throw error;
    }
  }

  /**
   * Process push event
   */
  async processPushEvent(payload) {
    return {
      type: 'push',
      ref: payload.ref,
      before: payload.before,
      after: payload.after,
      commits: payload.commits.map((commit) => ({
        id: commit.id,
        message: commit.message,
        author: commit.author,
        url: commit.url,
        added: commit.added,
        removed: commit.removed,
        modified: commit.modified,
      })),
      repository: {
        id: payload.repository.id,
        name: payload.repository.name,
        full_name: payload.repository.full_name,
        clone_url: payload.repository.clone_url,
        default_branch: payload.repository.default_branch,
      },
      pusher: payload.pusher,
    };
  }

  /**
   * Process pull request event
   */
  async processPullRequestEvent(payload) {
    return {
      type: 'pull_request',
      action: payload.action,
      number: payload.number,
      pull_request: {
        id: payload.pull_request.id,
        title: payload.pull_request.title,
        body: payload.pull_request.body,
        state: payload.pull_request.state,
        head: {
          ref: payload.pull_request.head.ref,
          sha: payload.pull_request.head.sha,
        },
        base: {
          ref: payload.pull_request.base.ref,
          sha: payload.pull_request.base.sha,
        },
        user: payload.pull_request.user,
      },
      repository: {
        id: payload.repository.id,
        name: payload.repository.name,
        full_name: payload.repository.full_name,
      },
    };
  }

  /**
   * Process release event
   */
  async processReleaseEvent(payload) {
    return {
      type: 'release',
      action: payload.action,
      release: {
        id: payload.release.id,
        tag_name: payload.release.tag_name,
        name: payload.release.name,
        body: payload.release.body,
        draft: payload.release.draft,
        prerelease: payload.release.prerelease,
        created_at: payload.release.created_at,
        published_at: payload.release.published_at,
        assets: payload.release.assets,
      },
      repository: {
        id: payload.repository.id,
        name: payload.repository.name,
        full_name: payload.repository.full_name,
      },
    };
  }

  /**
   * Search repositories
   */
  async searchRepositories(query, options = {}) {
    try {
      const octokit = new Octokit(); // No auth needed for public search

      const {
        sort = 'updated',
        order = 'desc',
        per_page = 30,
        page = 1,
      } = options;

      const { data } = await octokit.rest.search.repos({
        q: query,
        sort,
        order,
        per_page,
        page,
      });

      return {
        total_count: data.total_count,
        items: data.items.map((repo) => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description,
          private: repo.private,
          html_url: repo.html_url,
          clone_url: repo.clone_url,
          language: repo.language,
          topics: repo.topics,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          updated_at: repo.updated_at,
          owner: {
            login: repo.owner.login,
            avatar_url: repo.owner.avatar_url,
          },
        })),
      };
    } catch (error) {
      this.logger.error('Failed to search repositories:', error);
      throw error;
    }
  }

  /**
   * Get rate limit status
   */
  async getRateLimit(accessToken = null) {
    try {
      const octokit = accessToken
        ? this.createUserOctokit(accessToken)
        : new Octokit();
      const { data } = await octokit.rest.rateLimit.get();
      return data;
    } catch (error) {
      this.logger.error('Failed to get rate limit:', error);
      throw error;
    }
  }

  /**
   * Check if repository is a valid template
   */
  async analyzeRepositoryForTemplate(accessToken, owner, repo) {
    try {
      const files = await this.getRepositoryContents(accessToken, owner, repo);
      const languages = await this.getRepositoryLanguages(
        accessToken,
        owner,
        repo,
      );

      // Check for common framework indicators
      const framework = this.detectFramework(files, languages);
      const buildConfig = await this.detectBuildConfiguration(
        accessToken,
        owner,
        repo,
        files,
      );

      return {
        isTemplate: true,
        framework,
        languages,
        buildConfig,
        hasPackageJson: files.some((file) => file.name === 'package.json'),
        hasDockerfile: files.some((file) => file.name === 'Dockerfile'),
        hasReadme: files.some((file) =>
          file.name.toLowerCase().includes('readme'),
        ),
        complexity: this.calculateComplexity(files, languages),
      };
    } catch (error) {
      this.logger.error('Failed to analyze repository for template:', error);
      throw error;
    }
  }

  /**
   * Detect framework from repository files
   */
  detectFramework(files, languages) {
    const fileNames = files.map((f) => f.name.toLowerCase());

    // Check for specific framework files
    if (
      fileNames.includes('next.config.js') ||
      fileNames.includes('next.config.mjs')
    ) {
      return 'nextjs';
    }
    if (
      fileNames.includes('nuxt.config.js') ||
      fileNames.includes('nuxt.config.ts')
    ) {
      return 'nuxt';
    }
    if (fileNames.includes('svelte.config.js')) {
      return 'sveltekit';
    }
    if (fileNames.includes('astro.config.mjs')) {
      return 'astro';
    }
    if (
      fileNames.includes('vite.config.js') ||
      fileNames.includes('vite.config.ts')
    ) {
      return 'vite';
    }
    if (fileNames.includes('angular.json')) {
      return 'angular';
    }
    if (fileNames.includes('vue.config.js')) {
      return 'vue';
    }
    if (fileNames.includes('gatsby-config.js')) {
      return 'gatsby';
    }

    // Check by primary language
    const primaryLanguage = Object.keys(languages)[0]?.toLowerCase();
    if (primaryLanguage === 'javascript' || primaryLanguage === 'typescript') {
      return fileNames.includes('package.json') ? 'node' : 'javascript';
    }
    if (primaryLanguage === 'python') return 'python';
    if (primaryLanguage === 'php') return 'php';
    if (primaryLanguage === 'ruby') return 'ruby';
    if (primaryLanguage === 'go') return 'go';
    if (primaryLanguage === 'rust') return 'rust';

    return 'static';
  }

  /**
   * Detect build configuration
   */
  async detectBuildConfiguration(accessToken, owner, repo, files) {
    const config = {
      buildCommand: null,
      installCommand: null,
      outputDirectory: null,
      devCommand: null,
    };

    // Check for package.json
    const packageJsonFile = files.find((f) => f.name === 'package.json');
    if (packageJsonFile) {
      try {
        const content = await this.getRepositoryContents(
          accessToken,
          owner,
          repo,
          'package.json',
        );
        const packageJson = JSON.parse(
          Buffer.from(content.content, 'base64').toString(),
        );

        if (packageJson.scripts) {
          config.buildCommand = packageJson.scripts.build || 'npm run build';
          config.devCommand =
            packageJson.scripts.dev || packageJson.scripts.start;
          config.installCommand = 'npm install';
        }
      } catch (error) {
        this.logger.warn('Failed to parse package.json:', error);
      }
    }

    // Common output directories
    if (files.some((f) => f.name === 'dist')) config.outputDirectory = 'dist';
    else if (files.some((f) => f.name === 'build'))
      config.outputDirectory = 'build';
    else if (files.some((f) => f.name === 'public'))
      config.outputDirectory = 'public';
    else if (files.some((f) => f.name === '_site'))
      config.outputDirectory = '_site';

    return config;
  }

  /**
   * Calculate repository complexity score
   */
  calculateComplexity(files, languages) {
    const fileCount = files.length;
    const languageCount = Object.keys(languages).length;
    const hasConfig = files.some(
      (f) =>
        f.name.includes('config') ||
        f.name.includes('webpack') ||
        f.name.includes('babel'),
    );

    let score = 0;
    if (fileCount > 100) score += 3;
    else if (fileCount > 50) score += 2;
    else if (fileCount > 20) score += 1;

    if (languageCount > 5) score += 2;
    else if (languageCount > 3) score += 1;

    if (hasConfig) score += 1;

    if (score <= 2) return 'simple';
    if (score <= 4) return 'moderate';
    return 'complex';
  }
}

module.exports = GitHubService;
