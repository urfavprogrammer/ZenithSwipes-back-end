// Migration to drop proofFile BLOB and add filePath STRING in deposits table

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove old proofFile column
    await queryInterface.removeColumn('deposits', 'proofFile');
    // Add new filePath column as STRING
    await queryInterface.addColumn('deposits', 'filePath', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove filePath column
    await queryInterface.removeColumn('deposits', 'filePath');
    // Re-add proofFile as BLOB
    await queryInterface.addColumn('deposits', 'proofFile', {
      type: Sequelize.BLOB('long'),
      allowNull: true,
    });
  }
};
