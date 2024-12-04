"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class SpotImages extends Model {
		static associate(models) {
			// Changed from hasOne to belongsTo since images belong to a resort
			SpotImages.belongsTo(models.Resort, {
				foreignKey: "resortId",
				as: "resort",
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			});
		}
	}

	SpotImages.init(
		{
			resortId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Resorts", // The correct table name for resorts
					key: "id",
				},
			},
			imageUrl: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "SpotImages",
		}
	);

	return SpotImages;
};
