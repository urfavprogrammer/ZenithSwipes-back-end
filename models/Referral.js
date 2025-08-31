import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    "Referral",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(30), allowNull: false },
      fullname: { type: DataTypes.STRING(50), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false },
      phone_number: { type: DataTypes.STRING(20), allowNull: false },
      register_date: { type: DataTypes.STRING(30), allowNull: false },
    },
    {
      tableName: "referrals",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "update_at",
    }
  );
};