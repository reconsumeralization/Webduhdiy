const express = require('express');
const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // TODO: Implement actual authentication
    res.json({
      success: true,
      token: 'dummy-token-for-development',
      user: {
        id: '1',
        email,
        name: 'Demo User',
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // TODO: Implement actual registration
    res.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: '1',
        email,
        name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/profile
router.get('/profile', async (req, res) => {
  try {
    // TODO: Get user from token
    res.json({
      id: '1',
      email: 'demo@webduh.com',
      name: 'Demo User',
      createdAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
