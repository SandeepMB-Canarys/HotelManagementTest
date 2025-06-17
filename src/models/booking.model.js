const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room ID is required']
  },
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required']
  },
  guestName: {
    type: String,
    required: [true, 'Guest name is required'],
    trim: true
  },
  guestEmail: {
    type: String,
    required: [true, 'Guest email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  checkInDate: {
    type: Date,
    required: [true, 'Check-in date is required']
  },
  checkOutDate: {
    type: Date,
    required: [true, 'Check-out date is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled'],
    default: 'Confirmed'
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booked by user ID is required']
  },
  specialRequests: {
    type: String,
    trim: true
  },
  numberOfGuests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: [1, 'Number of guests must be at least 1']
  }
}, {
  timestamps: true
});

// Create indexes for common queries
bookingSchema.index({ roomId: 1, checkInDate: 1, checkOutDate: 1 });
bookingSchema.index({ companyId: 1, status: 1 });
bookingSchema.index({ guestEmail: 1 });

// Validate that check-out date is after check-in date
bookingSchema.pre('save', function(next) {
  if (this.checkOutDate <= this.checkInDate) {
    next(new Error('Check-out date must be after check-in date'));
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
