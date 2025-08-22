'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'items' });
      Order.hasOne(models.Purchase, { foreignKey: 'order_id', as: 'purchase' });
    }
  }

  Order.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE'
    },
    status: { type: DataTypes.ENUM('pending', 'cancelled', 'completed'), defaultValue: 'pending' },
    total: DataTypes.DECIMAL(12, 2)
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    underscored: true,
    timestamps: true
  });

  return Order;
};