const express = require('express');
const { body, param } = require('express-validator');
const AmenityController = require('../controllers/AmenityController');
const { protect, authorize } = require('../middleware/auth.middleware');
const router = express.Router();

/**
 * @swagger
 * /api/v1/amenities:
 *   post:
 *     summary: Create a new amenity
 *     tags: [Amenities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Amenity created successfully
 */
router.post('/', [
  protect,
  authorize('Admin'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').optional().trim(),
  body('icon').optional().trim()
], AmenityController.createAmenity);

/**
 * @swagger
 * /api/v1/amenities:
 *   get:
 *     summary: Get all amenities
 *     tags: [Amenities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of amenities
 */
router.get('/', protect, AmenityController.getAmenities);

/**
 * @swagger
 * /api/v1/amenities/{id}:
 *   delete:
 *     summary: Delete an amenity
 *     tags: [Amenities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Amenity deleted successfully
 */
router.delete('/:id', [
  protect,
  authorize('Admin'),
  param('id').isMongoId().withMessage('Invalid amenity ID')
], AmenityController.deleteAmenity);

module.exports = router;
