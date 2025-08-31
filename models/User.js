import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fullname: { type: DataTypes.STRING(50), allowNull: false },
    username: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    country: { type: DataTypes.STRING(50), allowNull: false },
    currency: { type: DataTypes.STRING(10), allowNull: false },
    gender: { type: DataTypes.STRING(10), allowNull: false },
    phone_number: { type: DataTypes.STRING(20), allowNull: false },
    referer: { type: DataTypes.STRING(100), allowNull: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    userloginonce: { type: DataTypes.BOOLEAN, defaultValue: false },
    withdrawalOtp: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1234 },
    avatarUrl: { type: DataTypes.STRING(255), allowNull: true },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false }
  // withdrawalotp column was removed from DB migrations; don't select it by default
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'update_at'
  });
};
