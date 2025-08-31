'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('assets', 'investment_amount', {
      type: Sequelize.DECIMAL,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('assets', 'investment_plan', {
      type: Sequelize.STRING(100),
      allowNull: true
    });
    await queryInterface.addColumn('assets', 'countingDays', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('assets', 'investment_status', {
      type: Sequelize.STRING(100),
      allowNull: true
    });
    await queryInterface.addColumn('assets', 'investment_date', {
      type: Sequelize.STRING(100),
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
