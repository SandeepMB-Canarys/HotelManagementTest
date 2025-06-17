const BaseRepository = require('./BaseRepository');
const Booking = require('../models/booking.model');

class BookingRepository extends BaseRepository {
  constructor() {
    super(Booking);
  }

  /**
   * Find bookings by company
   * @param {string} companyId
   * @returns {Promise<Array<import('../models/booking.model')>>}
   */
  async findByCompany(companyId) {
    return this.model.find({ companyId })
      .populate('room')
      .populate('guest', '-password')
      .sort({ createdAt: -1 });
  }

  /**
   * Find bookings by room
   * @param {string} roomId
   * @returns {Promise<Array<import('../models/booking.model')>>}
   */
  async findByRoom(roomId) {
    return this.model.find({ room: roomId })
      .populate('guest', '-password')
      .sort({ startDate: 1 });
  }

  /**
   * Find bookings by guest
   * @param {string} guestId
   * @returns {Promise<Array<import('../models/booking.model')>>}
   */
  async findByGuest(guestId) {
    return this.model.find({ guest: guestId })
      .populate('room')
      .sort({ startDate: 1 });
  }

  /**
   * Find booking by ID with populated fields
   * @param {string} id
   * @returns {Promise<import('../models/booking.model')>}
   */
  async findByIdWithDetails(id) {
    return this.model.findById(id)
      .populate('room')
      .populate('guest', '-password');
  }

  /**
   * Check if room is available for booking
   * @param {string} roomId
   * @param {Date} startDate
   * @param {Date} endDate
   * @param {string} [excludeBookingId] - Booking ID to exclude from check (for updates)
   * @returns {Promise<boolean>}
   */
  async isRoomAvailable(roomId, startDate, endDate, excludeBookingId = null) {
    const query = {
      room: roomId,
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate }
        }
      ],
      status: { $ne: 'Cancelled' }
    };

    if (excludeBookingId) {
      query._id = { $ne: excludeBookingId };
    }

    const conflictingBooking = await this.model.findOne(query);
    return !conflictingBooking;
  }

  /**
   * Update booking status
   * @param {string} bookingId
   * @param {string} status
   * @returns {Promise<import('../models/booking.model')>}
   */
  async updateStatus(bookingId, status) {
    return this.model.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true, runValidators: true }
    ).populate('room').populate('guest', '-password');
  }
}

module.exports = BookingRepository;
