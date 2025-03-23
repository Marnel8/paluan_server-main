"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		// Check if the column exists first
		const table = await queryInterface.describeTable("Tourists");
		if (!table.outDate) {
			await queryInterface.addColumn("Tourists", "outDate", {
				type: Sequelize.DATE,
				allowNull: true,
				after: "visitDate",
			});
		}
	},

	async down(queryInterface, Sequelize) {
		// Check if the column exists before removing it
		const table = await queryInterface.describeTable("Tourists");
		if (table.outDate) {
			await queryInterface.removeColumn("Tourists", "outDate");
		}
	},
};
