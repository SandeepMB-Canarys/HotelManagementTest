const CompanyRepository = require('../repositories/CompanyRepository');

class CompanyService {
  constructor() {
    this.companyRepository = new CompanyRepository();
  }

  /**
   * Create a new company
   * @param {Object} companyData
   * @returns {Promise<Object>}
   * @throws {Error} If company with same name exists
   */
  async createCompany(companyData) {
    const exists = await this.companyRepository.existsByName(companyData.name);
    if (exists) {
      throw new Error('Company with this name already exists');
    }

    return this.companyRepository.create(companyData);
  }

  /**
   * Get company by ID
   * @param {string} id
   * @returns {Promise<Object>}
   * @throws {Error} If company not found
   */
  async getCompanyById(id) {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new Error('Company not found');
    }
    return company;
  }

  /**
   * Update company
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<Object>}
   * @throws {Error} If company not found
   */
  async updateCompany(id, updateData) {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new Error('Company not found');
    }

    if (updateData.name && updateData.name !== company.name) {
      const exists = await this.companyRepository.existsByName(updateData.name);
      if (exists) {
        throw new Error('Company with this name already exists');
      }
    }

    return this.companyRepository.update(id, updateData);
  }

  /**
   * Delete company
   * @param {string} id
   * @returns {Promise<boolean>}
   * @throws {Error} If company not found
   */
  async deleteCompany(id) {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new Error('Company not found');
    }

    return this.companyRepository.delete(id);
  }
}

module.exports = CompanyService;
