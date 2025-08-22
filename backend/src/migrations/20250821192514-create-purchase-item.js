'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchase_items', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      purchase_id: {
        type: Sequelize.INTEGER,
        references: { model: 'purchases', key: 'id' },
        onDelete: 'CASCADE'
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: { model: 'products', key: 'id' }
      },
      quantity: { type: Sequelize.INTEGER, defaultValue: 1 },
      price: { type: Sequelize.DECIMAL(12, 2) },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('purchase_items');
  }
};
