module.exports = {
  up: async function (queryInterface, Sequelize) {
    // Add created_at and update_at if they don't exist
    await queryInterface.addColumn('assets', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }).catch(() => {});

    await queryInterface.addColumn('assets', 'update_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }).catch(() => {});
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.removeColumn('assets', 'update_at').catch(() => {});
    await queryInterface.removeColumn('assets', 'created_at').catch(() => {});
  }
};
