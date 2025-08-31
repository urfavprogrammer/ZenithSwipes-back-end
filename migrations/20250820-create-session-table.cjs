module.exports = {
  up: async function (queryInterface, Sequelize) {
    await queryInterface.createTable('session', {
      sid: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      sess: { type: Sequelize.JSONB, allowNull: false },
      expire: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.addIndex('session', ['expire']);
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.dropTable('session');
  }
};
