"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Rating extends Model {
		static associate(models) {
			Rating.belongsTo(models.User, {
				foreignKey: "guestId",
				as: "guest",
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			});
			Rating.belongsTo(models.Resort, {
				foreignKey: "resortId",
				as: "resort",
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
					model: "Users",
					key: "id",
				},
			},
			resortId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Resorts",
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
			guestRatingCode: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Rating",
		}
	);

	return Rating;
};
