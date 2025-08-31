import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define("Signals", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        signaltype: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        signalamount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        signaltrxid: {
            type: DataTypes.STRING(100),
            defaultValue: DataTypes.NOW
        },
        datebought: {
            type: DataTypes.STRING(100),
            defaultValue: DataTypes.NOW
        },
        signalstatus: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "active"
        }
    }, {
        tableName: "signals"
    });
};