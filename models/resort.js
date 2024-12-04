"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Resort extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Resort.belongsTo(models.User, {
				foreignKey: "owner",
				onDelete: "SET NULL",
				onUpdate: "CASCADE",
			});

			Resort.belongsTo(models.Address, {
				foreignKey: "address",
				onDelete: "SET NULL",
				onUpdate: "CASCADE",
			});

			// A resort has many tourists
			Resort.hasMany(models.Tourist, {
				foreignKey: "resortId",
				as: "tourists",
			});

			Resort.hasMany(models.Rating, {
				foreignKey: "resortId",
				as: "ratings",
			});
		}
	}
	Resort.init(
		{
			name: DataTypes.STRING,
			thumbnail: DataTypes.STRING,
			rate: DataTypes.FLOAT,
			owner: DataTypes.STRING,
			permitNo: DataTypes.STRING,
			description: DataTypes.TEXT,
			address: {
				type: DataTypes.INTEGER,
				references: {
					model: "Addresses",
					key: "id",
				},
			},
			owner: {
				type: DataTypes.INTEGER,
				references: {
					model: "Users",
					key: "id",
				},
			},
			category: {
				type: DataTypes.ENUM("beach", "mountain", "urban", "rural"), // ENUM type
				allowNull: false,
				defaultValue: "beach",
			},
			guestRatingCode: DataTypes.STRING, // code for rating the resort
		},
		{
			sequelize,
			modelName: "Resort",
			timestamps: true,
		}
	);
	return Resort;
};
