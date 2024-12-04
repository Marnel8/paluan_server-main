"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		// First drop the existing foreign key constraint
		await queryInterface.removeConstraint("ratings", "ratings_ibfk_1");

		// Add the new foreign key constraint pointing to users table
		await queryInterface.addConstraint("ratings", {
			fields: ["guestId"],
			type: "foreign key",
			name: "ratings_guest_fk",
			references: {
				table: "users",
				field: "id",
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		});
	},

	async down(queryInterface, Sequelize) {
		// Revert changes if needed
		await queryInterface.removeConstraint("ratings", "ratings_guest_fk");

		await queryInterface.addConstraint("ratings", {
			fields: ["guestId"],
			type: "foreign key",
			name: "ratings_ibfk_1",
			references: {
				table: "users",
				field: "id",
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		});
	},
};
