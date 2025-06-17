const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HotelEase API Documentation',
      version: '1.0.0',
      description: 'API documentation for HotelEase Hotel Management System',
      contact: {
        name: 'API Support',
        email: 'support@hotelease.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Companies', description: 'Company management' },
      { name: 'Users', description: 'User management' },
      { name: 'Rooms', description: 'Room management' },
      { name: 'Bookings', description: 'Booking management' },
      { name: 'Amenities', description: 'Amenity management' }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/models/*.js',
    './src/swagger/*.js'
  ]
};

module.exports = swaggerJsdoc(options);
