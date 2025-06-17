const AmenityRepository = require('../repositories/AmenityRepository');
const RoomService = require('./RoomService');

class AmenityService {
  constructor() {
    this.amenityRepository = new AmenityRepository();
  }

  /**
   * Create new amenity
   * @param {Object} amenityData
   * @param {string} companyId
   * @returns {Promise<Object>}
   */
  async createAmenity(amenityData, companyId) {
    // Check if amenity with same name exists for company
    const existingAmenity = await this.amenityRepository.findOne({
      name: amenityData.name,
      companyId
    });

    if (existingAmenity) {
      throw new Error('Amenity already exists');
    }

    // Create amenity
    const amenity = await this.amenityRepository.create({
      ...amenityData,
      companyId
    });

    return amenity;
  }

  /**
   * Get amenities by company
   * @param {string} companyId
   * @returns {Promise<Array>}
   */
  async getAmenitiesByCompany(companyId) {
    return this.amenityRepository.find({ companyId });
  }

  /**
   * Delete amenity
   * @param {string} amenityId
   * @param {string} companyId
   * @returns {Promise<void>}
   */
  async deleteAmenity(amenityId, companyId) {
    // Check if amenity exists and belongs to company
    const amenity = await this.amenityRepository.findOne({
      _id: amenityId,
      companyId
    });

    if (!amenity) {
      throw new Error('Amenity not found');
    }

    // Check if amenity is used in any rooms
    const rooms = await RoomService.getRoomsByAmenity(amenityId);
    if (rooms.length > 0) {
      throw new Error('Cannot delete amenity in use');
    }

    await this.amenityRepository.delete(amenityId);
  }
}

module.exports = new AmenityService();
