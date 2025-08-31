import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    "Payment",
    {
      payment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      btc: { type: DataTypes.STRING(100), allowNull: true },
      eth: { type: DataTypes.STRING(100), allowNull: true },
      usdt: { type: DataTypes.STRING(100), allowNull: true },
      ltc: { type: DataTypes.STRING(100), allowNull: true },
      trx: { type: DataTypes.STRING(100), allowNull: true },
      xrp: { type: DataTypes.STRING(100), allowNull: true },
      doge: { type: DataTypes.STRING(100), allowNull: true },

    },
    {
      tableName: "payment",
      timestamps: false,
      
    }
  );
};