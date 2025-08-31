import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    "Withdraw",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(100), allowNull: false },
      amount: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      withdrawaltype: { type: DataTypes.STRING(100), allowNull: false },
      withdrawalmethod: { type: DataTypes.STRING(100), allowNull: false },
      walletaddress: { type: DataTypes.STRING(100), allowNull: true },
      withdrawaldate: { type: DataTypes.STRING(100), allowNull: false },
      withdrawalstatus: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "pending",
      },
      withdrawaltransactionid: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      withdrawaltype: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      bankname: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      accountname: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      accountnumber: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      routingnumber: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      swiftcode: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      paypaladdress: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
       skrilladdress: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },

    {
      tableName: "withdrawals",
    }
  );
};