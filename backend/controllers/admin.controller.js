// Admin Controller for dashboard and user management
const AdminService = require('../services/admin.service');

class AdminController {
  async getDashboardStats(req, res) {
    try {
      const stats = await AdminService.getDashboardStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new AdminController();
