import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Asset', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING(100), allowNull: false },
    total_balance: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
    profit: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
    trade_bonus: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
    referal_bonus: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
    total_won: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
    total_loss: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
    total_deposit: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    total_withdrawal: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    total_pendingdeposit: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    total_pendingwithdrawal: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    investment_amount: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
    investment_plan: { type: DataTypes.STRING(100), allowNull: true },
    countingDays: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    investment_status: { type: DataTypes.STRING(100), allowNull: true },
    investment_date: { type: DataTypes.STRING(100), allowNull: true }
  }, {
    tableName: 'assets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'update_at'
  });
};
