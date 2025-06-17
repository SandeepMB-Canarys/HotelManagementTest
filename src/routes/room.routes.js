const express = require('express');
const { body, param, query } = require('express-validator');
const RoomController = require('../controllers/RoomController');
const { protect, authorize } = require('../middleware/auth.middleware');
const router = express.Router();

/**
 * @swagger
 * /api/v1/rooms:
 *   post:
 *     summary: Create new room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - type
 *               - price
 *               - capacity
 *             properties:
 *               number:
 *                 type: string
 *               type:
 *                 type: string
 *               price:
 *                 type: number
 *               capacity:
 *                 type: integer
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Room created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/', [
  protect,
  authorize('Admin'),
  body('number').trim().notEmpty().withMessage('Room number is required'),
  body('type').trim().notEmpty().withMessage('Room type is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('amenities').optional().isArray().withMessage('Amenities must be an array'),
  body('amenities.*').optional().isMongoId().withMessage('Invalid amenity ID')
], RoomController.createRoom);

/**
 * @swagger
 * /api/v1/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by room status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by room type
 *     responses:
 *       200:
 *         description: List of rooms
 */
router.get('/', [
  protect,
  authorize('Admin', 'Staff'),
  query('status').optional().isIn(['Available', 'Occupied', 'Maintenance', 'Cleaning']).withMessage('Invalid status'),
  query('type').optional().trim()
], RoomController.getRooms);

/**
 * @swagger
 * /api/v1/rooms/{id}/status:
 *   patch:
 *     summary: Update room status
 *     tags: [Rooms]
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
 *                 enum: [Available, Occupied, Maintenance, Cleaning]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Room status updated successfully
 */
router.patch('/:id/status', [
  protect,
  authorize('Admin', 'Staff'),
  param('id').isMongoId().withMessage('Invalid room ID'),
  body('status').isIn(['Available', 'Occupied', 'Maintenance', 'Cleaning']).withMessage('Invalid status'),
  body('notes').optional().trim()
], RoomController.updateRoomStatus);

/**
 * @swagger
 * /api/v1/rooms/{id}/status:
 *   patch:
 *     summary: Update room status
 *     tags: [Rooms]
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
 *                 enum: [Available, Occupied, Maintenance, Cleaning]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Room status updated successfully
 */
// router.patch('/:id/status', [
//   protect,
//   authorize('Admin', 'Staff'),
//   param('id').isMongoId().withMessage('Invalid room ID'),
//   body('status').isIn(['Available', 'Occupied', 'Maintenance', 'Cleaning']).withMessage('Invalid status'),
//   body('notes').optional().trim()
// ], RoomController.updateRoomStatus);

// const room = await Room.findOneAndUpdate(
//   { _id: req.params.id, companyId: req.user.companyId },
//   { status: req.body.status },
//   { new: true }
// );

// if (!room) {
//   return res.status(404).json({
//     success: false,
//     message: 'Room not found'
//   });
// }

// res.status(200).json({
//   success: true,
//   data: room
// });
// } catch (error) {
//   res.status(500).json({
//     success: false,
//     message: 'Error updating room status',
//     error: error.message
//   });
// }
// });

module.exports = router;
