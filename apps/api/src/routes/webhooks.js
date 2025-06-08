const express = require('express');
const router = express.Router();

// POST /api/webhooks/github
router.post('/github', async (req, res) => {
  try {
    const signature = req.headers['x-hub-signature-256'];
    const event = req.headers['x-github-event'];

    console.log(`Received GitHub webhook: ${event}`);

    // Handle different GitHub events
    switch (event) {
      case 'push':
        console.log('Push event received, triggering deployment...');
        // TODO: Trigger deployment for the project
        break;
      case 'pull_request':
        console.log('Pull request event received');
        // TODO: Handle PR events
        break;
      default:
        console.log(`Unhandled event: ${event}`);
    }

    res.status(200).json({ message: 'Webhook received' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/webhooks/gitlab
router.post('/gitlab', async (req, res) => {
  try {
    const event = req.headers['x-gitlab-event'];
    console.log(`Received GitLab webhook: ${event}`);

    res.status(200).json({ message: 'GitLab webhook received' });
  } catch (error) {
    console.error('GitLab webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/webhooks/deploy
router.post('/deploy', async (req, res) => {
  try {
    const { projectId, branch = 'main' } = req.body;

    console.log(`Deploy webhook for project ${projectId}, branch ${branch}`);

    // TODO: Trigger deployment
    res.status(200).json({
      message: 'Deployment triggered',
      projectId,
      branch,
    });
  } catch (error) {
    console.error('Deploy webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
