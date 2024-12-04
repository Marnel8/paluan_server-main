"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.changeColumn("Resorts", "address", {
            type: Sequelize.INTEGER,
            references: {
                model: "Addresses", // Name of the target table
                key: "id", // Primary key in the target table
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        // Revert the category ENUM column
        await queryInterface.changeColumn("Resorts", "address", {
            type: Sequelize.STRING,
        });
    },
};
