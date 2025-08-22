'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.OrderItem, { foreignKey: 'product_id', as: 'order_items' });
      Product.hasMany(models.PurchaseItem, { foreignKey: 'product_id', as: 'purchase_items' });
    }
  }

  Product.init({
    name: DataTypes.STRING,
    batch_number: DataTypes.STRING,
    price: DataTypes.DECIMAL(12, 2),
    stock: DataTypes.INTEGER,
    date_in: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    underscored: true,
    timestamps: true
  });

  return Product;
};