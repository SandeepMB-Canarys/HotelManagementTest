const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    enum: ['Admin', 'HotelManager', 'Reception', 'Housekeeping', 'Guest'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);
