"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stakes', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      stakeid: { type: Sequelize.STRING(100), allowNull: false },
      staketoken: { type: Sequelize.STRING(100), allowNull: false },
      amount: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
      est_apy: { type: Sequelize.DECIMAL, allowNull: false },
      stakeduration: { type: Sequelize.INTEGER, allowNull: false },
      username: { type: Sequelize.STRING(100), allowNull: false },
      stakedate: { type: Sequelize.STRING(100), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stakes');
  }
};
