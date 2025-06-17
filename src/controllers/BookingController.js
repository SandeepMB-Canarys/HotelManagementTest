const BaseController = require('./BaseController');
const BookingService = require('../services/BookingService');

class BookingController extends BaseController {
  constructor() {
    super();
    this.createBooking = this.createBooking.bind(this);
    this.getBooking = this.getBooking.bind(this);
    this.getBookings = this.getBookings.bind(this);
    this.getBookingsByRoom = this.getBookingsByRoom.bind(this);
    this.getBookingsByGuest = this.getBookingsByGuest.bind(this);
    this.updateBooking = this.updateBooking.bind(this);
    this.updateBookingStatus = this.updateBookingStatus.bind(this);
    this.deleteBooking = this.deleteBooking.bind(this);
  }

  /**
   * Create new booking
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async createBooking(req, res) {
    try {
      if (this.checkValidationErrors(req, res)) return;

      const booking = await BookingService.createBooking(
        req.body,
        req.user.companyId
      );
      this.sendSuccess(res, booking, 201);
    } catch (error) {
      this.handleError(res, error, {
        'Room not found in your company': 404,
        'Room is not available for the selected dates': 400
      }, 'Error creating booking');
    }
  }

  /**
   * Get booking by ID
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getBooking(req, res) {
    try {
      const booking = await BookingService.getBooking(req.params.id);
      this.sendSuccess(res, booking);
    } catch (error) {
      this.handleError(res, error, {
        'Booking not found': 404
      }, 'Error fetching booking');
    }
  }

  /**
   * Get all bookings for company
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getBookings(req, res) {
    try {
      const bookings = await BookingService.getBookingsByCompany(req.user.companyId);
      this.sendSuccess(res, bookings);
    } catch (error) {
      this.handleError(res, error, {}, 'Error fetching bookings');
    }
  }

  /**
   * Get bookings by room
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getBookingsByRoom(req, res) {
    try {
      const bookings = await BookingService.getBookingsByRoom(req.params.roomId);
      this.sendSuccess(res, bookings);
    } catch (error) {
      this.handleError(res, error, {}, 'Error fetching room bookings');
    }
  }

  /**
   * Get bookings by guest
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getBookingsByGuest(req, res) {
    try {
      const bookings = await BookingService.getBookingsByGuest(req.params.guestId);
      this.sendSuccess(res, bookings);
    } catch (error) {
      this.handleError(res, error, {}, 'Error fetching guest bookings');
    }
  }

  /**
   * Update booking
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async updateBooking(req, res) {
    try {
      if (this.checkValidationErrors(req, res)) return;

      const booking = await BookingService.updateBooking(req.params.id, req.body);
      this.sendSuccess(res, booking);
    } catch (error) {
      this.handleError(res, error, {
        'Booking not found': 404,
        'Room is not available for the selected dates': 400
      }, 'Error updating booking');
    }
  }

  /**
   * Update booking status
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async updateBookingStatus(req, res) {
    try {
      if (this.checkValidationErrors(req, res)) return;

      const booking = await BookingService.updateBookingStatus(
        req.params.id,
        req.body.status
      );
      this.sendSuccess(res, booking);
    } catch (error) {
      this.handleError(res, error, {
        'Booking not found': 404,
        'Cannot transition from': 400
      }, 'Error updating booking status');
    }
  }

  /**
   * Delete booking
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async deleteBooking(req, res) {
    try {
      await BookingService.deleteBooking(req.params.id);
      this.sendSuccess(res, {});
    } catch (error) {
      this.handleError(res, error, {
        'Booking not found': 404,
        'Only pending bookings can be deleted': 400
      }, 'Error deleting booking');
    }
  }
}

module.exports = new BookingController();
