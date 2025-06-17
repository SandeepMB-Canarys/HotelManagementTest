const BaseController = require('./BaseController');
const RoleService = require('../services/RoleService');

class RoleController extends BaseController {
  constructor() {
    super();
    this.getRoles = this.getRoles.bind(this);
    this.createRole = this.createRole.bind(this);
  }

  /**
   * Get all roles
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getRoles(req, res) {
    try {
      const roles = await RoleService.getAllRoles();
      
      res.status(200).json({
        success: true,
        data: roles
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching roles',
        error: error.message
      });
    }
  }

  /**
   * Create new role
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async createRole(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const role = await RoleService.createRole(req.body.name);
      
      res.status(201).json({
        success: true,
        data: role
      });
    } catch (error) {
      if (error.message === 'Role already exists') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error creating role',
        error: error.message
      });
    }
  }
}

module.exports = new RoleController();
