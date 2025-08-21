'use strict';

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../../backend/src/models');
const { default: isEmail } = require('validator/lib/isEmail');
const { underscoredIf } = require('sequelize/lib/utils');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNuLL: false,
    },
    email: {
      type: DataTypes.STRING, 
      allowNuLL: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNuLL: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'client'),
      allowNuLL: false,
      defaultValue: 'client'
    }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  });

  User.prototype.validatePassword = function (plain) {
    return bcrypt.compare(plain, this.password);
  };

  User.associate = (models) => {
    User.hasMany(models.Order, 
      {
      foreignKey: 'user_id',
      as: 'orders'
    });
  };

  return User;
}