const BaseRepository = require('./BaseRepository');
const Company = require('../models/company.model');

class CompanyRepository extends BaseRepository {
  constructor() {
    super(Company);
  }

  /**
   * Find company by name
   * @param {string} name
   * @returns {Promise<import('../models/company.model')>}
   */
  async findByName(name) {
    return this.model.findOne({ name });
  }

  /**
   * Check if company exists by name
   * @param {string} name
   * @returns {Promise<boolean>}
   */
  async existsByName(name) {
    const count = await this.model.countDocuments({ name });
    return count > 0;
  }
}

module.exports = CompanyRepository;
