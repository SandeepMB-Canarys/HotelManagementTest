const mongoose = require('mongoose');
const Role = require('../models/role.model');
require('dotenv').config();

const roles = [
  { name: 'Admin' },
  { name: 'HotelManager' },
  { name: 'Reception' },
  { name: 'Housekeeping' },
  { name: 'Guest' }
];

const seedRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing roles
    await Role.deleteMany();
    console.log('Existing roles cleared');

    // Insert new roles
    await Role.insertMany(roles);
    console.log('Roles seeded successfully');

    process.exit();
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  }
};

seedRoles();
