// Migration to drop and re-add proofFile column as BLOB in deposits table

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove old proofFile column
    await queryInterface.removeColumn('deposits', 'proofFile');
    // Add new proofFile column as BLOB
    await queryInterface.addColumn('deposits', 'proofFile', {
      type: Sequelize.BLOB('long'),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove BLOB proofFile column
    await queryInterface.removeColumn('deposits', 'proofFile');
    // Re-add as STRING (if needed)
    await queryInterface.addColumn('deposits', 'proofFile', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
