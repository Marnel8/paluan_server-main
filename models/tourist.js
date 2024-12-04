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
    }
    Tourist.init(
        {
            gender: DataTypes.STRING,
            visitDate: DataTypes.DATE,
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
        },
        {
            sequelize,
            modelName: "Tourist",
        }
    );
    return Tourist;
};
