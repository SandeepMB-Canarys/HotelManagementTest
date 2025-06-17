const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    unique: true,
    minlength: [2, 'Company name must be at least 2 characters long'],
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
      trim: true,
      match: [/^[0-9]{5,6}$/, 'Please enter a valid zip code']
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index on name field
companySchema.index({ name: 1 });

module.exports = mongoose.model('Company', companySchema);
