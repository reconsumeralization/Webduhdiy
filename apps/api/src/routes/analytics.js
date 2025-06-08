const express = require('express');
const router = express.Router();

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalProjects: 12,
    totalDeployments: 45,
    successfulDeployments: 42,
    activeProjects: 8,
    totalTraffic: 125000,
    avgDeploymentTime: 145, // seconds
  },
  deployments: {
    today: 5,
    thisWeek: 18,
    thisMonth: 45,
    trend: '+12%',
  },
  performance: {
    avgResponseTime: 89, // ms
    uptime: 99.9,
    errorRate: 0.1,
  },
  usage: [
    { date: '2024-01-01', deployments: 3, traffic: 1200 },
    { date: '2024-01-02', deployments: 5, traffic: 1800 },
    { date: '2024-01-03', deployments: 2, traffic: 1000 },
    { date: '2024-01-04', deployments: 8, traffic: 2200 },
    { date: '2024-01-05', deployments: 4, traffic: 1600 },
    { date: '2024-01-06', deployments: 6, traffic: 1900 },
    { date: '2024-01-07', deployments: 7, traffic: 2100 },
  ],
};

// GET /api/analytics/overview
router.get('/overview', async (req, res) => {
  try {
    res.json(mockAnalytics.overview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/deployments
router.get('/deployments', async (req, res) => {
  try {
    const { period = '7d' } = req.query;

    // Return deployment analytics based on period
    res.json({
      ...mockAnalytics.deployments,
      period,
      chartData: mockAnalytics.usage.map((u) => ({
        date: u.date,
        value: u.deployments,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/traffic
router.get('/traffic', async (req, res) => {
  try {
    const { period = '7d' } = req.query;

    res.json({
      total: mockAnalytics.overview.totalTraffic,
      period,
      chartData: mockAnalytics.usage.map((u) => ({
        date: u.date,
        value: u.traffic,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/performance
router.get('/performance', async (req, res) => {
  try {
    res.json(mockAnalytics.performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/projects/:id
router.get('/projects/:id', async (req, res) => {
  try {
    const projectId = req.params.id;

    // Mock project-specific analytics
    res.json({
      projectId,
      deployments: 8,
      lastDeployment: new Date(),
      avgDeploymentTime: 120,
      traffic: {
        total: 15000,
        unique: 8500,
        trend: '+5%',
      },
      performance: {
        avgResponseTime: 75,
        uptime: 99.8,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
