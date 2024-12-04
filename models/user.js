"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			User.belongsTo(models.Address, {
				foreignKey: "address",
				onDelete: "SET NULL",
				onUpdate: "CASCADE",
			});
		}
	}
	User.init(
		{
			name: DataTypes.STRING,
			username: DataTypes.STRING,
			password: DataTypes.STRING,
			email: DataTypes.STRING,
			refreshToken: DataTypes.STRING,
			address: {
				type: DataTypes.INTEGER,
				references: {
					model: "Addresses",
					key: "id",
				},
			},
			userType: {
				type: DataTypes.ENUM("admin", "guest", "resortOwner"),
				allowNull: false,
				defaultValue: "guest",
			},
			phone: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "User",
			timestamps: true,
		}
	);
	return User;
};
