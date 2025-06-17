const BaseRepository = require('./BaseRepository');
const Room = require('../models/room.model');

class RoomRepository extends BaseRepository {
  constructor() {
    super(Room);
  }

  /**
   * Find rooms by company ID
   * @param {string} companyId
   * @returns {Promise<Array<import('../models/room.model')>>}
   */
  async findByCompany(companyId) {
    return this.model.find({ companyId }).populate('amenities');
  }

  /**
   * Find available rooms
   * @param {string} companyId
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Promise<Array<import('../models/room.model')>>}
   */
  async findAvailableRooms(companyId, startDate, endDate) {
    return this.model.find({
      companyId,
      status: 'Available',
      _id: {
        $nin: await this.model.find({
          'bookings.startDate': { $lte: endDate },
          'bookings.endDate': { $gte: startDate }
        }).distinct('_id')
      }
    }).populate('amenities');
  }

  /**
   * Update room status
   * @param {string} roomId
   * @param {string} status
   * @returns {Promise<import('../models/room.model')>}
   */
  async updateStatus(roomId, status) {
    return this.model.findByIdAndUpdate(
      roomId,
      { status },
      { new: true, runValidators: true }
    );
  }
}

module.exports = RoomRepository;
