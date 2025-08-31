import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    "Stake",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      stakeid: { type: DataTypes.STRING(100), allowNull: false },
      staketoken: { type: DataTypes.STRING(100), allowNull: false },
      amount: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      est_apy: { type: DataTypes.DECIMAL, allowNull: false },
      stakeduration: { type: DataTypes.INTEGER, allowNull: false },
      username: { type: DataTypes.STRING(100), allowNull: false },
      stakedate: { type: DataTypes.STRING(100), allowNull: false },
      staketoken: { type: DataTypes.STRING(100), allowNull: false },
      stakestatus: { type: DataTypes.STRING(100), allowNull: false, defaultValue: "active" },
    },
    {
      tableName: "stakes",
    }
  );
};
