"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn("Ratings", "guestId", {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "Users", // name of the target table
                key: "id", // key in the target table that we're referencing
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn("Ratings", "guestId", {
            type: Sequelize.INTEGER,
            allowNull: true, // You can revert the column's attributes as they were before
        });
    },
};
