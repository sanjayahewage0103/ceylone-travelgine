const GuideAnalyticsService = require('../services/guideAnalytics.service');

// GET /api/guides/:id/analytics
exports.getGuideAnalytics = async (req, res) => {
  try {
    const guideId = req.params.id;
    const analytics = await GuideAnalyticsService.getGuideAnalytics(guideId);
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
