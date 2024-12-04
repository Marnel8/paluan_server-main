"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("Users", "userType", {
            type: Sequelize.ENUM("admin", "guest"),
            allowNull: false,
            defaultValue: "admin",
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn("Users", "userType");
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_userType";');
    },
};
