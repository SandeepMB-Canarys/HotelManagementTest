const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required']
  },
  name: {
    type: String,
    required: [true, 'Amenity name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create compound index for company and amenity name
amenitySchema.index({ companyId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Amenity', amenitySchema);
