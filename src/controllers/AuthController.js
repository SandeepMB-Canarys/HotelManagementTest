const BaseController = require('./BaseController');
const AuthService = require('../services/AuthService');

class AuthController extends BaseController {
  constructor() {
    super();
    this.registerAdmin = this.registerAdmin.bind(this);
    this.login = this.login.bind(this);
  }

  /**
   * Register admin user
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async registerAdmin(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { user, token } = await AuthService.registerAdmin(req.body, req.body.companyId);

      res.status(201).json({
        success: true,
        token,
        data: { user }
      });
    } catch (error) {
      if (error.message === 'Email already registered') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error registering admin',
        error: error.message
      });
    }
  }

  /**
   * Login user
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);

      res.status(200).json({
        success: true,
        token,
        data: { user }
      });
    } catch (error) {
      if (error.message === 'Invalid credentials' || error.message === 'User account is deactivated') {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error logging in',
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();
