"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("Tourists", "contactNumber", {
            type: Sequelize.STRING,
            allowNull: true, // or false based on your requirements
        });
        await queryInterface.addColumn("Tourists", "barangay", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn("Tourists", "street", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn("Tourists", "region", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn("Tourists", "province", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn("Tourists", "municipality", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn("Tourists", "age", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addColumn("Tourists", "name", {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn("Tourists", "contactNumber");
        await queryInterface.removeColumn("Tourists", "barangay");
        await queryInterface.removeColumn("Tourists", "street");
        await queryInterface.removeColumn("Tourists", "region");
        await queryInterface.removeColumn("Tourists", "province");
        await queryInterface.removeColumn("Tourists", "municipality");
        await queryInterface.removeColumn("Tourists", "age");
        await queryInterface.removeColumn("Tourists", "name");
    },
};
