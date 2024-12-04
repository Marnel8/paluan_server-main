"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Rating extends Model {
		static associate(models) {
			// Ensure that models.Guest and models.Resort are defined correctly
			Rating.belongsTo(models.User, {
				// Updated to reference User
				foreignKey: "guestId",
				as: "guest", // Alias for easier access
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			});
			Rating.belongsTo(models.Resort, {
				foreignKey: "resortId",
				as: "resort", // Alias for easier access
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			});
		}
	}

	Rating.init(
		{
			guestId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "User",
					key: "id",
				},
			},
			resortId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Resorts", // The correct table name for resorts
					key: "id",
				},
			},
			comment: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			rating: {
				type: DataTypes.FLOAT,
				allowNull: false,
				validate: {
					min: 1,
					max: 5,
				},
			},
		},
		{
			sequelize,
			modelName: "Rating",
		}
	);

	return Rating;
};
