const BaseController = require('./BaseController');
const UserService = require('../services/UserService');

class UserController extends BaseController {
  /**
   * Get current user profile
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getProfile(req, res) {
    try {
      const user = await UserService.getUser(req.user._id);
      this.sendSuccess(res, user);
    } catch (error) {
      this.handleError(res, error, {
        'User not found': 404
      }, 'Error fetching profile');
    }
  }
  constructor() {
    super();
    this.createStaff = this.createStaff.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.toggleUserStatus = this.toggleUserStatus.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  /**
   * Create staff user
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async createStaff(req, res) {
    try {
      if (this.checkValidationErrors(req, res)) return;

      const user = await UserService.createStaff(req.body, req.user.companyId);
      this.sendSuccess(res, user, 201);
    } catch (error) {
      this.handleError(res, error, {
        'Email already registered': 400
      }, 'Error creating staff user');
    }
  }

  /**
   * Get user by ID
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getUser(req, res) {
    try {
      const user = await UserService.getUser(req.params.id);
      this.sendSuccess(res, user);
    } catch (error) {
      this.handleError(res, error, {
        'User not found': 404
      }, 'Error fetching user');
    }
  }

  /**
   * Get all users for company
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getUsers(req, res) {
    try {
      const users = await UserService.getUsersByCompany(req.user.companyId);
      this.sendSuccess(res, users);
    } catch (error) {
      this.handleError(res, error, {}, 'Error fetching users');
    }
  }

  /**
   * Update user
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async updateUser(req, res) {
    try {
      if (this.checkValidationErrors(req, res)) return;

      const user = await UserService.updateUser(req.params.id, req.body);
      this.sendSuccess(res, user);
    } catch (error) {
      this.handleError(res, error, {
        'User not found': 404,
        'Email already in use': 400
      }, 'Error updating user');
    }
  }

  /**
   * Delete user
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.id);
      this.sendSuccess(res, {});
    } catch (error) {
      this.handleError(res, error, {
        'User not found': 404
      }, 'Error deleting user');
    }
  }

  /**
   * Toggle user active status
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async toggleUserStatus(req, res) {
    try {
      const user = await UserService.toggleUserStatus(req.params.id);
      this.sendSuccess(res, user);
    } catch (error) {
      this.handleError(res, error, {
        'User not found': 404
      }, 'Error toggling user status');
    }
  }
}

module.exports = new UserController();
