const UserRepository = require('../repositories/UserRepository');
const RoleService = require('./RoleService');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Create new staff user
   * @param {Object} userData
   * @param {string} companyId
   * @returns {Promise<Object>}
   */
  async createStaff(userData, companyId) {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const staffRole = await RoleService.getRoleByName('Staff');
    return this.userRepository.createWithRole({
      ...userData,
      companyId,
      role: staffRole._id,
      isActive: true
    });
  }

  /**
   * Get user by ID
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getUser(userId) {
    const user = await this.userRepository.findByIdWithRole(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Get users by company
   * @param {string} companyId
   * @returns {Promise<Array>}
   */
  async getUsersByCompany(companyId) {
    return this.userRepository.findByCompany(companyId);
  }

  /**
   * Update user
   * @param {string} userId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async updateUser(userId, updateData) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(updateData.email);
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    const updatedUser = await this.userRepository.update(userId, updateData);
    return this.userRepository.findByIdWithRole(updatedUser._id);
  }

  /**
   * Delete user
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async deleteUser(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    await this.userRepository.delete(userId);
  }

  /**
   * Toggle user active status
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async toggleUserStatus(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.userRepository.update(userId, {
      isActive: !user.isActive
    });
    return this.userRepository.findByIdWithRole(updatedUser._id);
  }
}

module.exports = new UserService();
