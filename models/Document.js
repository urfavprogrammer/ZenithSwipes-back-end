import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    "Document",
    {
     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
     username: { type: DataTypes.STRING(100), allowNull: false },
     documentType: { type: DataTypes.STRING(100), allowNull: true },
     documentName: { type: DataTypes.STRING(100), allowNull: false },
     documentSize: { type: DataTypes.INTEGER, allowNull: true },
     filePath: { type: DataTypes.STRING, allowNull: false },
     deposittransactionid: { type: DataTypes.STRING(100), allowNull: true },
     filePath: { type: DataTypes.STRING, allowNull: true },
    },
    {
      tableName: "documents",
      timestamps: false
    }
  );
};
