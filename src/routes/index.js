const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const companyRoutes = require('./company.routes');
const roomRoutes = require('./room.routes');
const bookingRoutes = require('./booking.routes');
const amenityRoutes = require('./amenity.routes');
const roleRoutes = require('./role.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/rooms', roomRoutes);
router.use('/bookings', bookingRoutes);
router.use('/amenities', amenityRoutes);
router.use('/roles', roleRoutes);

module.exports = router;
