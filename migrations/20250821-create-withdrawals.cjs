"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('withdrawals', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: Sequelize.STRING(100), allowNull: false },
      amount: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
      withdrawaltype: { type: Sequelize.STRING(100), allowNull: false },
      withdrawalmethod: { type: Sequelize.STRING(100), allowNull: false },
      walletaddress: { type: Sequelize.STRING(100), allowNull: true },
      withdrawaldate: { type: Sequelize.STRING(100), allowNull: false },
      withdrawalstatus: { type: Sequelize.STRING(100), allowNull: false, defaultValue: 'pending' },
      withdrawaltransactionid: { type: Sequelize.STRING(100), allowNull: false },
      withdrawaltype: { type: Sequelize.STRING(100), allowNull: true },
      bankname: { type: Sequelize.STRING(100), allowNull: true },
      accountname: { type: Sequelize.STRING(100), allowNull: true },
      accountnumber: { type: Sequelize.DECIMAL, allowNull: true },
      routingnumber: { type: Sequelize.DECIMAL, allowNull: true },
      swiftcode: { type: Sequelize.STRING(100), allowNull: true },
      paypaladdress: { type: Sequelize.STRING(100), allowNull: true },
      skrilladdress: { type: Sequelize.STRING(100), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('withdrawals');
  }
};
