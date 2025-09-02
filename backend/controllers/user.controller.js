// User Controller for user management and approval workflow
const UserService = require('../services/user.service');

class UserController {
  async getAllUsers(req, res) {
    try {
      const filters = req.query;
      const users = await UserService.getAllUsers(filters);
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getUserDetails(req, res) {
    try {
      const { userId } = req.params;
      const user = await UserService.getUserDetails(userId);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateUserStatus(req, res) {
    try {
      const { userId } = req.params;
      const { status } = req.body;
      const result = await UserService.updateUserStatus(userId, status);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new UserController();
