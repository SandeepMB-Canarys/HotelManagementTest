const BookingRepository = require('../repositories/BookingRepository');
const RoomService = require('./RoomService');

class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  /**
   * Create new booking
   * @param {Object} bookingData
   * @param {string} companyId
   * @returns {Promise<Object>}
   */
  async createBooking(bookingData, companyId) {
    // Check if room exists and belongs to company
    const room = await RoomService.getRoom(bookingData.room);
    if (room.companyId.toString() !== companyId) {
      throw new Error('Room not found in your company');
    }

    // Check room availability
    const isAvailable = await this.bookingRepository.isRoomAvailable(
      bookingData.room,
      new Date(bookingData.startDate),
      new Date(bookingData.endDate)
    );

    if (!isAvailable) {
      throw new Error('Room is not available for the selected dates');
    }

    // Create booking
    const booking = await this.bookingRepository.create({
      ...bookingData,
      companyId,
      status: 'Pending'
    });

    return this.bookingRepository.findByIdWithDetails(booking._id);
  }

  /**
   * Get booking by ID
   * @param {string} bookingId
   * @returns {Promise<Object>}
   */
  async getBooking(bookingId) {
    const booking = await this.bookingRepository.findByIdWithDetails(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  }

  /**
   * Get bookings by company
   * @param {string} companyId
   * @returns {Promise<Array>}
   */
  async getBookingsByCompany(companyId) {
    return this.bookingRepository.findByCompany(companyId);
  }

  /**
   * Get bookings by room
   * @param {string} roomId
   * @returns {Promise<Array>}
   */
  async getBookingsByRoom(roomId) {
    return this.bookingRepository.findByRoom(roomId);
  }

  /**
   * Get bookings by guest
   * @param {string} guestId
   * @returns {Promise<Array>}
   */
  async getBookingsByGuest(guestId) {
    return this.bookingRepository.findByGuest(guestId);
  }

  /**
   * Update booking
   * @param {string} bookingId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async updateBooking(bookingId, updateData) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // If dates are being updated, check availability
    if (updateData.startDate || updateData.endDate) {
      const startDate = new Date(updateData.startDate || booking.startDate);
      const endDate = new Date(updateData.endDate || booking.endDate);

      const isAvailable = await this.bookingRepository.isRoomAvailable(
        booking.room,
        startDate,
        endDate,
        bookingId
      );

      if (!isAvailable) {
        throw new Error('Room is not available for the selected dates');
      }
    }

    const updatedBooking = await this.bookingRepository.update(bookingId, updateData);
    return this.bookingRepository.findByIdWithDetails(updatedBooking._id);
  }

  /**
   * Update booking status
   * @param {string} bookingId
   * @param {string} status
   * @returns {Promise<Object>}
   */
  async updateBookingStatus(bookingId, status) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Add any status transition validation here
    const validTransitions = {
      Pending: ['Confirmed', 'Cancelled'],
      Confirmed: ['CheckedIn', 'Cancelled'],
      CheckedIn: ['CheckedOut', 'Cancelled'],
      CheckedOut: [],
      Cancelled: []
    };

    if (!validTransitions[booking.status].includes(status)) {
      throw new Error(`Cannot transition from ${booking.status} to ${status}`);
    }

    return this.bookingRepository.updateStatus(bookingId, status);
  }

  /**
   * Delete booking
   * @param {string} bookingId
   * @returns {Promise<void>}
   */
  async deleteBooking(bookingId) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status !== 'Pending') {
      throw new Error('Only pending bookings can be deleted');
    }

    await this.bookingRepository.delete(bookingId);
  }
}

module.exports = new BookingService();
