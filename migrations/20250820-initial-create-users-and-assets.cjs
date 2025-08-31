module.exports = {
	up: async function (queryInterface, Sequelize) {
		await queryInterface.createTable('users', {
			id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
			fullname: { type: Sequelize.STRING(50), allowNull: false },
			username: { type: Sequelize.STRING(30), allowNull: false, unique: true },
			email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
			country: { type: Sequelize.STRING(50), allowNull: false },
			currency: { type: Sequelize.STRING(10), allowNull: false },
			gender: { type: Sequelize.STRING(10), allowNull: false },
			phone_number: { type: Sequelize.STRING(20), allowNull: false },
			referer: { type: Sequelize.STRING(100), allowNull: true },
			password: { type: Sequelize.STRING(255), allowNull: false },
			created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
			update_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
		});

		await queryInterface.createTable('assets', {
			id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
			username: { type: Sequelize.STRING(100), allowNull: false },
			total_balance: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
			profit: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
			trade_bonus: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
			referal_bonus: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
			total_won: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
			total_loss: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
			created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
			update_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
		});
	},

	down: async function (queryInterface, Sequelize) {
		await queryInterface.dropTable('assets');
		await queryInterface.dropTable('users');
	}
};
