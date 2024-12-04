"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Ratings", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            guestId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Guests", // Make sure this matches the table name in the database
                    key: "id",
                },
            },
            resortId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Resorts", // Make sure this matches the table name in the database
                    key: "id",
                },
            },
            comment: {
                type: Sequelize.TEXT,
            },
            rating: {
                type: Sequelize.FLOAT,
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
        await queryInterface.dropTable("Ratings");
    },
};
