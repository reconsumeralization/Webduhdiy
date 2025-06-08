const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const GitHubService = require('../services/GitHubService');
const router = express.Router();

const githubService = new GitHubService();

// Middleware for validation
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

// Middleware to check GitHub access token
const requireGitHubToken = (req, res, next) => {
  const accessToken = req.body.access_token || req.user?.github_access_token;
  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message:
        'GitHub access token is required. Please connect your GitHub account.',
    });
  }
  req.githubToken = accessToken;
  next();
};

// GET /api/github/auth/url - Get GitHub OAuth authorization URL
router.get('/auth/url', async (req, res) => {
  try {
    const redirect_uri =
      req.query.redirect_uri || `${process.env.APP_URL}/auth/github/callback`;
    const scope = req.query.scope || 'user:email,repo';
    const state = Math.random().toString(36).substring(7);

    if (req.session) req.session.githubOAuthState = state;

    const authUrl =
      `https://github.com/login/oauth/authorize?` +
      `client_id=${githubService.clientId}&` +
      `redirect_uri=${encodeURIComponent(redirect_uri)}&` +
      `scope=${encodeURIComponent(scope)}&state=${state}`;

    res.json({
      success: true,
      data: { auth_url: authUrl, state, redirect_uri },
    });
  } catch (error) {
    console.error('Error generating GitHub auth URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate GitHub authorization URL',
    });
  }
});

// POST /api/github/auth/callback - Handle GitHub OAuth callback
router.post(
  '/auth/callback',
  [body('code').isLength({ min: 1 }), body('state').isLength({ min: 1 })],
  validateRequest,
  async (req, res) => {
    try {
      const { code, state } = req.body;

      if (
        req.session?.githubOAuthState &&
        req.session.githubOAuthState !== state
      ) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid state parameter' });
      }

      const tokenData = await githubService.exchangeCodeForToken(code, state);
      const userInfo = await githubService.getUserInfo(tokenData.access_token);

      if (req.user) {
        const { db } = req.app.locals.services;
        await db.query(
          'UPDATE users SET github_access_token = $1, github_username = $2, github_user_id = $3 WHERE id = $4',
          [tokenData.access_token, userInfo.login, userInfo.id, req.user.id],
        );
      }

      res.json({
        success: true,
        data: {
          user: userInfo,
          token: tokenData.access_token,
          scope: tokenData.scope,
        },
      });
    } catch (error) {
      console.error('Error handling GitHub OAuth callback:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to authenticate with GitHub',
      });
    }
  },
);

// GET /api/github/user - Get GitHub user information
router.get('/user', requireGitHubToken, async (req, res) => {
  try {
    const userInfo = await githubService.getUserInfo(req.githubToken);
    res.json({ success: true, data: userInfo });
  } catch (error) {
    console.error('Error fetching GitHub user info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch GitHub user information',
    });
  }
});

// GET /api/github/repositories - List user repositories
router.get('/repositories', requireGitHubToken, async (req, res) => {
  try {
    const options = {
      type: req.query.type || 'all',
      sort: req.query.sort || 'updated',
      direction: req.query.direction || 'desc',
      per_page: parseInt(req.query.per_page) || 30,
      page: parseInt(req.query.page) || 1,
      affiliation: req.query.affiliation || 'owner,collaborator',
    };

    const repositories = await githubService.getUserRepositories(
      req.githubToken,
      options,
    );
    res.json({
      success: true,
      data: {
        repositories,
        pagination: { page: options.page, per_page: options.per_page },
      },
    });
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch GitHub repositories' });
  }
});

// GET /api/github/repositories/:owner/:repo - Get repository details
router.get(
  '/repositories/:owner/:repo',
  [param('owner').isLength({ min: 1 }), param('repo').isLength({ min: 1 })],
  validateRequest,
  requireGitHubToken,
  async (req, res) => {
    try {
      const { owner, repo } = req.params;

      const contents = await githubService.getRepositoryContents(
        req.githubToken,
        owner,
        repo,
      );
      const languages = await githubService.getRepositoryLanguages(
        req.githubToken,
        owner,
        repo,
      );
      const branches = await githubService.getRepositoryBranches(
        req.githubToken,
        owner,
        repo,
      );
      const analysis = await githubService.analyzeRepositoryForTemplate(
        req.githubToken,
        owner,
        repo,
      );

      res.json({
        success: true,
        data: {
          owner,
          repo,
          contents: contents.slice(0, 20),
          languages,
          branches,
          analysis,
        },
      });
    } catch (error) {
      console.error('Error fetching repository details:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch repository details',
      });
    }
  },
);

// GET /api/github/repositories/:owner/:repo/contents - Get repository file contents
router.get(
  '/repositories/:owner/:repo/contents',
  [
    param('owner').isLength({ min: 1 }),
    param('repo').isLength({ min: 1 }),
    query('path').optional().isString(),
    query('ref').optional().isString(),
  ],
  validateRequest,
  requireGitHubToken,
  async (req, res) => {
    try {
      const { owner, repo } = req.params;
      const { path = '', ref } = req.query;

      const contents = await githubService.getRepositoryContents(
        req.githubToken,
        owner,
        repo,
        path,
        ref,
      );

      res.json({
        success: true,
        data: {
          contents,
          path,
          ref,
        },
      });
    } catch (error) {
      console.error('Error fetching repository contents:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch repository contents',
      });
    }
  },
);

// POST /api/github/repositories/:owner/:repo/download - Download repository as ZIP
router.post(
  '/repositories/:owner/:repo/download',
  [param('owner').isLength({ min: 1 }), param('repo').isLength({ min: 1 })],
  validateRequest,
  requireGitHubToken,
  async (req, res) => {
    try {
      const { owner, repo } = req.params;
      const ref = req.body.ref || 'main';

      const zipBuffer = await githubService.downloadRepositoryZip(
        req.githubToken,
        owner,
        repo,
        ref,
      );
      const files = await githubService.extractRepositoryFiles(zipBuffer);

      res.json({
        success: true,
        data: {
          files: files.slice(0, 100),
          total_files: files.length,
          repository: `${owner}/${repo}`,
          ref,
        },
      });
    } catch (error) {
      console.error('Error downloading repository:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to download repository' });
    }
  },
);

// POST /api/github/repositories/:owner/:repo/analyze - Analyze repository for template creation
router.post(
  '/repositories/:owner/:repo/analyze',
  [param('owner').isLength({ min: 1 }), param('repo').isLength({ min: 1 })],
  validateRequest,
  requireGitHubToken,
  async (req, res) => {
    try {
      const { owner, repo } = req.params;

      const analysis = await githubService.analyzeRepositoryForTemplate(
        req.githubToken,
        owner,
        repo,
      );

      res.json({
        success: true,
        data: {
          repository: `${owner}/${repo}`,
          analysis,
          template_ready: analysis.isTemplate,
          recommendations: {
            category: analysis.framework
              ? githubService.mapFrameworkToCategory?.(analysis.framework)
              : 'frontend',
            suggested_name: `${owner}/${repo} Template`,
            complexity_level: analysis.complexity,
          },
        },
      });
    } catch (error) {
      console.error('Error analyzing repository:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to analyze repository',
      });
    }
  },
);

// POST /api/github/repositories/:owner/:repo/webhooks - Create webhook for repository
router.post(
  '/repositories/:owner/:repo/webhooks',
  [
    param('owner').isLength({ min: 1 }),
    param('repo').isLength({ min: 1 }),
    body('webhook_url').isURL().withMessage('Valid webhook URL is required'),
    body('events').optional().isArray(),
  ],
  validateRequest,
  requireGitHubToken,
  async (req, res) => {
    try {
      const { owner, repo } = req.params;
      const { webhook_url, events = ['push', 'pull_request'] } = req.body;

      const webhook = await githubService.createWebhook(
        req.githubToken,
        owner,
        repo,
        webhook_url,
        events,
      );

      // Store webhook information in database
      const { db } = req.app.locals.services;
      await db.query(
        `
      INSERT INTO git_integrations (
        project_id, provider, repository_id, repository_name, 
        access_token_encrypted, webhook_id, auto_deploy
      ) VALUES ($1, 'github', $2, $3, $4, $5, true)
    `,
        [
          req.body.project_id,
          `${owner}/${repo}`,
          `${owner}/${repo}`,
          req.githubToken, // Should be encrypted in production
          webhook.id,
        ],
      );

      res.status(201).json({
        success: true,
        data: webhook,
      });
    } catch (error) {
      console.error('Error creating webhook:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create webhook',
      });
    }
  },
);

// POST /api/github/webhooks - Handle GitHub webhooks
router.post('/webhooks', async (req, res) => {
  try {
    const signature = req.headers['x-hub-signature-256'];
    const event = req.headers['x-github-event'];
    const deliveryId = req.headers['x-github-delivery'];

    if (!signature || !event) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required webhook headers' });
    }

    const isValid = githubService.verifyWebhookSignature(
      JSON.stringify(req.body),
      signature,
    );
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid webhook signature' });
    }

    const result = await githubService.processWebhook(req.body, req.headers);

    // Store webhook delivery
    const { db } = req.app.locals.services;
    await db.query(
      'INSERT INTO webhook_deliveries (webhook_id, event_type, payload, delivered_at) VALUES ($1, $2, $3, NOW())',
      [deliveryId, event, JSON.stringify(req.body)],
    );

    res.json({
      success: true,
      data: { event, delivery_id: deliveryId, processed: result.processed },
    });
  } catch (error) {
    console.error('Error handling GitHub webhook:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to process webhook' });
  }
});

// GET /api/github/search/repositories - Search GitHub repositories
router.get(
  '/search/repositories',
  [query('q').isLength({ min: 1 })],
  validateRequest,
  async (req, res) => {
    try {
      const {
        q,
        sort = 'updated',
        order = 'desc',
        per_page = 30,
        page = 1,
      } = req.query;

      const searchResults = await githubService.searchRepositories(q, {
        sort,
        order,
        per_page: parseInt(per_page),
        page: parseInt(page),
      });

      res.json({ success: true, data: searchResults });
    } catch (error) {
      console.error('Error searching GitHub repositories:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to search repositories' });
    }
  },
);

// GET /api/github/rate-limit - Get rate limit status
router.get('/rate-limit', async (req, res) => {
  try {
    const accessToken = req.githubToken || req.user?.github_access_token;
    const rateLimit = await githubService.getRateLimit(accessToken);

    res.json({
      success: true,
      data: rateLimit,
    });
  } catch (error) {
    console.error('Error fetching rate limit:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rate limit information',
    });
  }
});

// DELETE /api/github/auth/disconnect - Disconnect GitHub account
router.delete('/auth/disconnect', async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: 'Authentication required' });
    }

    const { db } = req.app.locals.services;
    await db.query(
      'UPDATE users SET github_access_token = NULL, github_username = NULL, github_user_id = NULL WHERE id = $1',
      [req.user.id],
    );

    res.json({
      success: true,
      message: 'GitHub account disconnected successfully',
    });
  } catch (error) {
    console.error('Error disconnecting GitHub account:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to disconnect GitHub account' });
  }
});

// GET /api/github/integration/status - Get GitHub integration status
router.get('/integration/status', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { db } = req.app.locals.services;
    const result = await db.query(
      `
      SELECT github_username, github_user_id, 
             CASE WHEN github_access_token IS NOT NULL THEN true ELSE false END as connected
      FROM users 
      WHERE id = $1
    `,
      [req.user.id],
    );

    const integration = result.rows[0] || { connected: false };

    if (integration.connected && req.user.github_access_token) {
      try {
        const rateLimit = await githubService.getRateLimit(
          req.user.github_access_token,
        );
        integration.rate_limit = rateLimit;
      } catch (error) {
        // Token might be invalid
        integration.token_valid = false;
      }
    }

    res.json({
      success: true,
      data: integration,
    });
  } catch (error) {
    console.error('Error checking GitHub integration status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check GitHub integration status',
    });
  }
});

module.exports = router;
