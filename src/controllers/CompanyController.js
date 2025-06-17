const BaseController = require('./BaseController');
const CompanyService = require('../services/CompanyService');

class CompanyController extends BaseController {
  constructor() {
    super();
    this.companyService = new CompanyService();
    this.createCompany = this.createCompany.bind(this);
    this.getCompany = this.getCompany.bind(this);
    this.updateCompany = this.updateCompany.bind(this);
    this.deleteCompany = this.deleteCompany.bind(this);
  }

  /**
   * Create company
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async createCompany(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const company = await this.companyService.createCompany(req.body);
      
      res.status(201).json({
        success: true,
        data: company
      });
    } catch (error) {
      if (error.message === 'Company with this name already exists') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error creating company',
        error: error.message
      });
    }
  }

  /**
   * Get company by ID
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getCompany(req, res) {
    try {
      const company = await this.companyService.getCompanyById(req.params.id);
      
      res.status(200).json({
        success: true,
        data: company
      });
    } catch (error) {
      if (error.message === 'Company not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error fetching company',
        error: error.message
      });
    }
  }

  /**
   * Update company
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async updateCompany(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const company = await this.companyService.updateCompany(req.params.id, req.body);
      
      res.status(200).json({
        success: true,
        data: company
      });
    } catch (error) {
      if (error.message === 'Company not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message === 'Company with this name already exists') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error updating company',
        error: error.message
      });
    }
  }

  /**
   * Delete company
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  deleteCompany(req, res) {
    try {
      this.companyService.deleteCompany(req.params.id);
      
      res.status(200).json({
        success: true,
        message: 'Company deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Company not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error deleting company',
        error: error.message
      });
    }
  }
}

module.exports = new CompanyController();
