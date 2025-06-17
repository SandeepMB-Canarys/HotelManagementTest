const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required']
  },
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    trim: true
  },
  roomType: {
    type: String,
    required: [true, 'Room type is required'],
    enum: ['Single', 'Double', 'Suite', 'Deluxe'],
    trim: true
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Price per night is required'],
    min: [0, 'Price cannot be negative']
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Cleaning', 'Maintenance'],
    default: 'Available'
  },
  amenities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Amenity'
  }],
  description: {
    type: String,
    trim: true
  },
  floor: {
    type: Number,
    required: [true, 'Floor number is required']
  },
  maxOccupancy: {
    type: Number,
    required: [true, 'Maximum occupancy is required'],
    min: [1, 'Maximum occupancy must be at least 1']
  }
}, {
  timestamps: true
});

// Create compound index for company and room number
roomSchema.index({ companyId: 1, roomNumber: 1 }, { unique: true });
roomSchema.index({ status: 1 });

module.exports = mongoose.model('Room', roomSchema);
