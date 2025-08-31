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

    await queryInterface.addColumn('assets', 'total_deposit', {
      type: Sequelize.DECIMAL,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('assets', 'total_withdrawal', {
      type: Sequelize.DECIMAL,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('assets', 'total_pendingdeposit', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('assets', 'total_pendingwithdrawal', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
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
