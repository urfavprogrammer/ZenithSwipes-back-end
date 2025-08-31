import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    "Deposit",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(100), allowNull: false },
      amount: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      depositmethod: { type: DataTypes.STRING(100), allowNull: false },
      depositdate: { type: DataTypes.STRING(100), allowNull: false },
      depositstatus: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "pending",
      },
      deposittransactionid: { type: DataTypes.STRING(100), allowNull: false },
  filePath: { type: DataTypes.STRING, allowNull: true },
    },
    {
      tableName: "deposits",   
    }
  );
};
