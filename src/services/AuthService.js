const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Role = require('../models/role.model');

class AuthService {
  /**
   * Register a new admin user
   * @param {Object} userData
   * @param {string} companyId
   * @returns {Promise<{user: Object, token: string}>}
   */
  async registerAdmin(userData, companyId) {
    // Check if user exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Get admin role
    const adminRole = await Role.findOne({ name: 'Admin' });
    if (!adminRole) {
      throw new Error('Admin role not found');
    }

    // Create user
    const user = await User.create({
      ...userData,
      companyId,
      role: adminRole._id
    });

    // Generate token
    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: 'Admin'
      },
      token
    };
  }

  /**
   * Login user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{user: Object, token: string}>}
   */
  async login(email, password) {
    // Get user
    const user = await User.findOne({ email })
      .select('+password')
      .populate('role');

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('User account is deactivated');
    }

    // Generate token
    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.name
      },
      token
    };
  }

  /**
   * Generate JWT token
   * @param {string} userId
   * @returns {string}
   */
  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }
}

module.exports = new AuthService();
