"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Create Address table first since it's referenced by User and Resort
		await queryInterface.createTable("Addresses", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			barangay: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			street: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			region: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			province: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 17,
			},
			municipality: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1751,
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

		// Create Users table
		await queryInterface.createTable("Users", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
			},
			username: {
				type: Sequelize.STRING,
			},
			password: {
				type: Sequelize.STRING,
			},
			email: {
				type: Sequelize.STRING,
			},
			refreshToken: {
				type: Sequelize.STRING,
			},
			address: {
				type: Sequelize.INTEGER,
				references: {
					model: "Addresses",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			userType: {
				type: Sequelize.ENUM("admin", "guest", "resortOwner"),
				allowNull: false,
				defaultValue: "guest",
			},
			phone: {
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

		// Create Resorts table
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
			permitNo: {
				type: Sequelize.STRING,
			},
			description: {
				type: Sequelize.TEXT,
			},
			address: {
				type: Sequelize.INTEGER,
				references: {
					model: "Addresses",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			owner: {
				type: Sequelize.INTEGER,
				references: {
					model: "Users",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			category: {
				type: Sequelize.ENUM("beach", "mountain", "urban", "rural"),
				allowNull: false,
				defaultValue: "beach",
			},
			guestRatingCode: {
				type: Sequelize.STRING,
			},
			longitude: {
				type: Sequelize.FLOAT,
				allowNull: true,
			},
			latitude: {
				type: Sequelize.FLOAT,
				allowNull: true,
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

		// Create Ratings table
		await queryInterface.createTable("Ratings", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			guestId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Users",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			resortId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Resorts",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			comment: {
				type: Sequelize.TEXT,
			},
			rating: {
				type: Sequelize.FLOAT,
				allowNull: false,
			},
			guestRatingCode: {
				type: Sequelize.STRING,
				allowNull: false,
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

		// Create SpotImages table
		await queryInterface.createTable("SpotImages", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			resortId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Resorts",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			imageUrl: {
				type: Sequelize.STRING,
				allowNull: false,
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

		// Create Tourists table
		await queryInterface.createTable("Tourists", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			gender: {
				type: Sequelize.STRING,
			},
			visitDate: {
				type: Sequelize.DATE,
			},
			resortId: {
				type: Sequelize.INTEGER,
				references: {
					model: "Resorts",
					key: "id",
				},
			},
			contactNumber: {
				type: Sequelize.STRING,
			},
			barangay: {
				type: Sequelize.STRING,
			},
			street: {
				type: Sequelize.STRING,
			},
			region: {
				type: Sequelize.STRING,
			},
			province: {
				type: Sequelize.STRING,
			},
			municipality: {
				type: Sequelize.STRING,
			},
			age: {
				type: Sequelize.INTEGER,
			},
			name: {
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
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	},
};
