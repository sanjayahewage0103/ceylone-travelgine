const express = require('express');
const router = express.Router();

// Demo payment gateway endpoint
router.post('/pay', async (req, res) => {
  // Simulate payment processing delay
  setTimeout(() => {
    // Randomly succeed or fail for demo
    const success = Math.random() > 0.1; // 90% success rate
    if (success) {
      res.json({ status: 'success', transactionId: 'DEMO-' + Date.now() });
    } else {
      res.status(402).json({ status: 'failed', error: 'Demo payment failed. Try again.' });
    }
  }, 1200);
});

module.exports = router;
