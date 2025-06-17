const BaseRepository = require('./BaseRepository');
const Role = require('../models/role.model');

class RoleRepository extends BaseRepository {
  constructor() {
    super(Role);
  }

  /**
   * Find role by name
   * @param {string} name
   * @returns {Promise<import('../models/role.model')>}
   */
  async findByName(name) {
    return this.model.findOne({ name });
  }

  /**
   * Get all available roles
   * @returns {Promise<Array<import('../models/role.model')>>}
   */
  async getAllRoles() {
    return this.model.find({});
  }
}

module.exports = RoleRepository;
