"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('signals', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: Sequelize.STRING(100), allowNull: false },
      signaltype: { type: Sequelize.STRING(100), allowNull: false },
      signalamount: { type: Sequelize.INTEGER, allowNull: false },
      signaltrxid: { type: Sequelize.STRING(100), defaultValue: Sequelize.literal('NOW()') },
      datebought: { type: Sequelize.STRING(100), defaultValue: Sequelize.literal('NOW()') },
      signalstatus: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'active' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('signals');
  }
};
