const BaseRepository = require('./BaseRepository');
const User = require('../models/user.model');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Find user by email
   * @param {string} email
   * @returns {Promise<import('../models/user.model')>}
   */
  async findByEmail(email) {
    return this.model.findOne({ email }).populate('role');
  }

  /**
   * Find users by company
   * @param {string} companyId
   * @returns {Promise<Array<import('../models/user.model')>>}
   */
  async findByCompany(companyId) {
    return this.model.find({ companyId }).populate('role').select('-password');
  }

  /**
   * Find user by ID with role
   * @param {string} id
   * @returns {Promise<import('../models/user.model')>}
   */
  async findByIdWithRole(id) {
    return this.model.findById(id).populate('role').select('-password');
  }

  /**
   * Create user with role
   * @param {Object} userData
   * @returns {Promise<import('../models/user.model')>}
   */
  async createWithRole(userData) {
    const user = await this.model.create(userData);
    return this.findByIdWithRole(user._id);
  }
}

module.exports = UserRepository;
