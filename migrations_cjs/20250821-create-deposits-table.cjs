"use strict";

/**
 * Migration: create deposits table (copy)
 */
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('deposits', {
			id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
			username: { type: Sequelize.STRING(100), allowNull: false },
			amount: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
			depositmethod: { type: Sequelize.STRING(100), allowNull: false },
			depositdate: { type: Sequelize.STRING(100), allowNull: false },
			depositstatus: { type: Sequelize.STRING(100), allowNull: false, defaultValue: 'pending' },
			deposittransactionid: { type: Sequelize.STRING(100), allowNull: false },
			createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
			updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('deposits');
	}
};
