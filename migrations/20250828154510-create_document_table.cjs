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
    await queryInterface.createTable('documents', {
           id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
           username: { type: Sequelize.STRING(100), allowNull: false },
           documentType: { type: Sequelize.STRING(100), allowNull: true },
           documentName: { type: Sequelize.STRING(100), allowNull: false },
           documentSize: { type: Sequelize.INTEGER, allowNull: true },
           filePath: { type: Sequelize.STRING, allowNull: false },
           deposittransactionid: { type: Sequelize.STRING(100), allowNull: true },
           filePath: { type: Sequelize.STRING, allowNull: true },
          
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
