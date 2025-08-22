'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('products', [
      {
        batch_number: 'L-1001',
        name: 'Teclado Mecánico',
        price: 150.00,
        stock: 20,
        date_in: '2025-08-01',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        batch_number: 'L-1002',
        name: 'Mouse Inalámbrico',
        price: 40.00,
        stock: 50,
        date_in: '2025-08-10',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {})
  }
};