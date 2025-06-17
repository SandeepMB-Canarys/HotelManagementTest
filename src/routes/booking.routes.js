const express = require('express');
const { body, param } = require('express-validator');
const BookingController = require('../controllers/BookingController');
const { protect, authorize } = require('../middleware/auth.middleware');
const router = express.Router();

/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     summary: Create new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - guestName
 *               - guestEmail
 *               - checkInDate
 *               - checkOutDate
 *               - numberOfGuests
 *             properties:
 *               roomId:
 *                 type: string
 *               guestName:
 *                 type: string
 *               guestEmail:
 *                 type: string
 *               checkInDate:
 *                 type: string
 *                 format: date
 *               checkOutDate:
 *                 type: string
 *                 format: date
 *               numberOfGuests:
 *                 type: number
 *               specialRequests:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
router.post('/', [
  protect,
  authorize('Reception', 'HotelManager'),
  body('roomId').isMongoId().withMessage('Invalid room ID'),
  body('guestName').trim().notEmpty().withMessage('Guest name is required'),
  body('guestEmail').isEmail().withMessage('Valid email is required'),
  body('checkInDate').isISO8601().toDate().withMessage('Valid check-in date is required'),
  body('checkOutDate').isISO8601().toDate().withMessage('Valid check-out date is required'),
  body('numberOfGuests').isInt({ min: 1 }).withMessage('Number of guests must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if room exists and belongs to the company
    const room = await Room.findOne({
      _id: req.body.roomId,
      companyId: req.user.companyId
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if room is available for the given dates
    const conflictingBooking = await Booking.findOne({
      roomId: req.body.roomId,
      status: { $nin: ['CheckedOut', 'Cancelled'] },
      $or: [
        {
          checkInDate: { $lte: req.body.checkOutDate },
          checkOutDate: { $gte: req.body.checkInDate }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Room is not available for the selected dates'
      });
    }

    // Calculate total price
    const nights = Math.ceil(
      (new Date(req.body.checkOutDate) - new Date(req.body.checkInDate)) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = nights * room.pricePerNight;

    const booking = await Booking.create({
      ...req.body,
      companyId: req.user.companyId,
      totalPrice,
      bookedBy: req.user._id
    });

    // Update room status
    await Room.findByIdAndUpdate(req.body.roomId, { status: 'Occupied' });

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get('/', [
  protect,
  authorize('Reception', 'HotelManager', 'Admin')
], async (req, res) => {
  try {
    const filter = { companyId: req.user.companyId };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.startDate && req.query.endDate) {
      filter.checkInDate = { $gte: new Date(req.query.startDate) };
      filter.checkOutDate = { $lte: new Date(req.query.endDate) };
    }

    const bookings = await Booking.find(filter)
      .populate('roomId')
      .populate('bookedBy', 'name email');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/bookings/{id}/status:
 *   patch:
 *     summary: Update booking status (check-in/check-out)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [CheckedIn, CheckedOut]
 */
router.patch('/:id/status', [
  protect,
  authorize('Reception'),
  param('id').isMongoId().withMessage('Invalid booking ID'),
  body('status').isIn(['CheckedIn', 'CheckedOut']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      companyId: req.user.companyId
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = req.body.status;
    await booking.save();

    // Update room status
    const roomStatus = req.body.status === 'CheckedOut' ? 'Cleaning' : 'Occupied';
    await Room.findByIdAndUpdate(booking.roomId, { status: roomStatus });

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
});

module.exports = router;
