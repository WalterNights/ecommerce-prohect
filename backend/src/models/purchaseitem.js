'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PurchaseItem extends Model {
    static associate(models) {
      PurchaseItem.belongsTo(models.Purchase, { foreignKey: 'purchase_id', as: 'purchase' });
      PurchaseItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product'});
    }
  }

  PurchaseItem.init({
    purchase_id: {
      type: DataTypes.INTEGER,
      references: { model: 'purchases', key: 'id' },
      onDelete: 'CASCADE'
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: { model: 'products', key: 'id' }
    },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    price: { type: DataTypes.DECIMAL(12, 2) }
  }, {
    sequelize,
    modelName: 'PurchaseItem',
    tableName: 'purchases_items',
    underscored: true,
    timestamps: true
  });

  return PurchaseItem;
};