/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - name
 *         - address
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *           description: Company name
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             zipCode:
 *               type: string
 *             country:
 *               type: string
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [Admin, HotelManager, Reception, Housekeeping, Guest]
 *     Room:
 *       type: object
 *       required:
 *         - roomNumber
 *         - roomType
 *         - pricePerNight
 *         - floor
 *         - maxOccupancy
 *       properties:
 *         id:
 *           type: string
 *         roomNumber:
 *           type: string
 *         roomType:
 *           type: string
 *           enum: [Single, Double, Suite, Deluxe]
 *         pricePerNight:
 *           type: number
 *         status:
 *           type: string
 *           enum: [Available, Occupied, Cleaning, Maintenance]
 *         floor:
 *           type: number
 *         maxOccupancy:
 *           type: number
 *     Booking:
 *       type: object
 *       required:
 *         - roomId
 *         - guestName
 *         - guestEmail
 *         - checkInDate
 *         - checkOutDate
 *         - numberOfGuests
 *       properties:
 *         id:
 *           type: string
 *         roomId:
 *           type: string
 *         guestName:
 *           type: string
 *         guestEmail:
 *           type: string
 *           format: email
 *         checkInDate:
 *           type: string
 *           format: date-time
 *         checkOutDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [Pending, Confirmed, CheckedIn, CheckedOut, Cancelled]
 *         totalPrice:
 *           type: number
 *         numberOfGuests:
 *           type: number
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *     ForbiddenError:
 *       description: User does not have required permissions
 *     NotFoundError:
 *       description: Requested resource was not found
 *     ValidationError:
 *       description: Invalid input data
 */
