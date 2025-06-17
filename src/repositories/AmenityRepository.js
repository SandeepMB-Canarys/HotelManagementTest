const BaseRepository = require('./BaseRepository');
const Amenity = require('../models/amenity.model');

class AmenityRepository extends BaseRepository {
  constructor() {
    super(Amenity);
  }

  /**
   * Find amenities by company
   * @param {string} companyId
   * @returns {Promise<Array<import('../models/amenity.model')>>}
   */
  async findByCompany(companyId) {
    return this.model.find({ companyId });
  }

  /**
   * Find amenity by name and company
   * @param {string} name
   * @param {string} companyId
   * @returns {Promise<import('../models/amenity.model')>}
   */
  async findByNameAndCompany(name, companyId) {
    return this.model.findOne({ name, companyId });
  }
}

module.exports = AmenityRepository;
