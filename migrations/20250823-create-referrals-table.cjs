module.exports = {
  up: async function (queryInterface, Sequelize) {
    await queryInterface.createTable('referrals', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: Sequelize.STRING(30), allowNull: false },
      fullname: { type: Sequelize.STRING(50), allowNull: false },
      email: { type: Sequelize.STRING(255), allowNull: false },
      phone_number: { type: Sequelize.STRING(20), allowNull: false },
      register_date: { type: Sequelize.STRING(30), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      update_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.dropTable('referrals');
  }
};
