'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    static associate(models) {
      Purchase.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Purchase.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
      Purchase.hasMany(models.PurchaseItem, { foreignKey: 'purchase_id', as: 'items' });
    }
  }

  Purchase.init({
    uder_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'orders', key: 'id' },
      onDelete: 'CASCADE'
    },
    payment_status : { type: DataTypes.ENUM('pending', 'failed', 'paid', 'refunded'), defaultValue: 'pending' },
    total: DataTypes.DECIMAL(12, 2)
  }, {
    sequelize,
    modelName: 'Purchase',
    tableName: 'purchases',
    underscored: true,
    timestamps: true
  });

  return Purchase;
};