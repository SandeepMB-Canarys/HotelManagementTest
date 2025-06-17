# HotelEase - Hotel Management System

A comprehensive hotel management system built with Node.js, Express, and MongoDB.

## Features

- Company and user management
- Room management
- Booking system
- Amenities management
- Role-based access control
- API documentation with Swagger

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hotelease
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the API documentation:
   - Open http://localhost:3000/api-docs in your browser

## API Documentation

The API documentation is available through Swagger UI at `/api-docs` endpoint when the server is running.

## Testing

Run the test suite:
```bash
npm test
```

## License

MIT