"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Resorts", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
			},
			thumbnail: {
				type: Sequelize.STRING,
			},
			rate: {
				type: Sequelize.FLOAT,
			},
			owner: {
				type: Sequelize.INTEGER,
			},
			address: {
				type: Sequelize.INTEGER,
			},
			address: {
				type: Sequelize.INTEGER,
			},
			permitNo: {
				type: Sequelize.STRING,
			},
			category: {
				type: Sequelize.STRING,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Resorts");
	},
};
