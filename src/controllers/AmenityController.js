const BaseController = require('./BaseController');
const AmenityService = require('../services/AmenityService');

class AmenityController extends BaseController {
  constructor() {
    super();
    this.createAmenity = this.createAmenity.bind(this);
    this.getAmenities = this.getAmenities.bind(this);
    this.deleteAmenity = this.deleteAmenity.bind(this);
  }

  /**
   * Create new amenity
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async createAmenity(req, res) {
    try {
      if (this.checkValidationErrors(req, res)) return;

      const amenity = await AmenityService.createAmenity(req.body, req.user.companyId);
      this.sendSuccess(res, amenity, 201);
    } catch (error) {
      this.handleError(res, error, {
        'Amenity already exists': 400
      }, 'Error creating amenity');
    }
  }

  /**
   * Get all amenities for company
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getAmenities(req, res) {
    try {
      const amenities = await AmenityService.getAmenitiesByCompany(req.user.companyId);
      this.sendSuccess(res, amenities);
    } catch (error) {
      this.handleError(res, error, {}, 'Error fetching amenities');
    }
  }

  /**
   * Delete amenity
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async deleteAmenity(req, res) {
    try {
      if (this.checkValidationErrors(req, res)) return;

      await AmenityService.deleteAmenity(req.params.id, req.user.companyId);
      this.sendSuccess(res, {}, 200, 'Amenity deleted successfully');
    } catch (error) {
      this.handleError(res, error, {
        'Amenity not found': 404,
        'Cannot delete amenity in use': 400
      }, 'Error deleting amenity');
    }
  }
}

module.exports = new AmenityController();
