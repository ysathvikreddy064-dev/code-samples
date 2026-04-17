// routes/trades.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const TradeController = require('../controllers/TradeController');

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}

router.get('/backdated', authenticateToken, async (req, res) => {
  try {
    const { facilityId, fromDate, toDate } = req.query;
    const trades = await TradeController.getBackdatedTrades({ facilityId, fromDate, toDate });
    res.status(200).json({ success: true, data: trades });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
