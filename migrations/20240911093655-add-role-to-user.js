"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add the 'role' field to the 'Users' table
        await queryInterface.addColumn("Users", "role", {
            type: Sequelize.ENUM("admin", "resortOwner"),
            allowNull: false,
            defaultValue: "admin",
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove the 'role' field from the 'Users' table
        await queryInterface.removeColumn("Users", "role");
    },
};
