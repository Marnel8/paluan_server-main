"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Tourist extends Model {
		static associate(models) {
			Tourist.belongsTo(models.Resort, {
				foreignKey: "resortId",
				as: "resort",
			});
		}

		// Add a getter for calculating duration in hours
		getDuration() {
			if (!this.visitDate || !this.outDate) return null;
			const start = new Date(this.visitDate);
			const end = new Date(this.outDate);
			const diffTime = Math.abs(end - start);
			const diffHours = Math.round(diffTime / (1000 * 60 * 60));
			return diffHours;
		}
	}
	Tourist.init(
		{
			gender: DataTypes.STRING,
			visitDate: DataTypes.DATE,
			outDate: DataTypes.DATE,
			resortId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Resorts",
					key: "id",
				},
			},
			contactNumber: DataTypes.STRING,
			barangay: DataTypes.STRING,
			street: DataTypes.STRING,
			region: DataTypes.STRING,
			province: DataTypes.STRING,
			municipality: DataTypes.STRING,
			age: DataTypes.INTEGER,
			name: DataTypes.STRING,
			duration: {
				type: DataTypes.VIRTUAL,
				get() {
					return this.getDuration();
				},
			},
		},
		{
			sequelize,
			modelName: "Tourist",
		}
	);
	return Tourist;
};
