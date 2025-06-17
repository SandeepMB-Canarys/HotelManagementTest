/**
 * Base Repository Interface
 * @template T - The entity type
 */
class IRepository {
  /**
   * Create a new document
   * @param {Partial<T>} data
   * @returns {Promise<T>}
   */
  create(data) { throw new Error('Method not implemented.'); }

  /**
   * Find document by ID
   * @param {string} id
   * @returns {Promise<T>}
   */
  findById(id) { throw new Error('Method not implemented.'); }

  /**
   * Find documents by filter
   * @param {Object} filter
   * @returns {Promise<T[]>}
   */
  find(filter) { throw new Error('Method not implemented.'); }

  /**
   * Update document by ID
   * @param {string} id
   * @param {Partial<T>} data
   * @returns {Promise<T>}
   */
  update(id, data) { throw new Error('Method not implemented.'); }

  /**
   * Delete document by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  delete(id) { throw new Error('Method not implemented.'); }
}

module.exports = IRepository;
