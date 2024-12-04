"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add new columns to the 'Resorts' table

        // Update owner to be a foreign key that references the 'Users' table
        await queryInterface.changeColumn("Resorts", "owner", {
            type: Sequelize.INTEGER,
            references: {
                model: "Users", // Name of the target table
                key: "id", // Primary key in the target table
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });

        // Add ENUM column for category
        await queryInterface.changeColumn("Resorts", "category", {
            type: Sequelize.ENUM("beach", "mountain", "urban", "rural"),
            allowNull: false,
            defaultValue: "beach",
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove the added columns

        // Change owner back to string type if rolled back
        await queryInterface.changeColumn("Resorts", "owner", {
            type: Sequelize.INTEGER,
        });

        // Revert the category ENUM column
        await queryInterface.changeColumn("Resorts", "category", {
            type: Sequelize.STRING,
        });
    },
};
