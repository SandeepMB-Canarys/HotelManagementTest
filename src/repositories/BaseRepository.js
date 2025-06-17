const IRepository = require('../interfaces/IRepository');

/**
 * Base Repository Implementation
 * @template T - The entity type
 * @implements {IRepository<T>}
 */
class BaseRepository extends IRepository {
  /**
   * @param {import('mongoose').Model} model - Mongoose model
   */
  constructor(model) {
    super();
    this.model = model;
  }

  /**
   * Create a new document
   * @param {Partial<T>} data
   * @returns {Promise<T>}
   */
  async create(data) {
    return this.model.create(data);
  }

  /**
   * Find document by ID
   * @param {string} id
   * @returns {Promise<T>}
   */
  async findById(id) {
    return this.model.findById(id);
  }

  /**
   * Find documents by filter
   * @param {Object} filter
   * @returns {Promise<T[]>}
   */
  async find(filter) {
    return this.model.find(filter);
  }

  /**
   * Update document by ID
   * @param {string} id
   * @param {Partial<T>} data
   * @returns {Promise<T>}
   */
  async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  /**
   * Delete document by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}

module.exports = BaseRepository;
