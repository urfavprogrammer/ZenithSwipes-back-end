import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Admin",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      admin_username: { type: DataTypes.STRING(100), allowNull: false },
      admin_email: { type: DataTypes.STRING(100), allowNull: false },
      admin_password: { type: DataTypes.STRING(100), allowNull: false },
      admin_role: { type: DataTypes.STRING(100), allowNull: false, defaultValue: "admin" },
    },
    {
      tableName: "admin",
      timestamps: false,
    }
  );
};
