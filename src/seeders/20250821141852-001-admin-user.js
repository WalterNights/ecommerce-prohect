'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    const hash = await bcrypt.hash('admin123', 10);
    await queryInterface.bulkInsert('users', [{
      name: 'Admin',
      email: 'admin@exaple.com',
      password: hash,
      role: 'admin',
      created_at: new Date(),
      update_at: new Date()
    }]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('users', {email: 'admin@exaple.com'});
  }
};