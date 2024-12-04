"use strict";

/** @type {import('sequelize-cli').Migration} */
"use strict";

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Update foreign key for 'resortId' in 'Tourists' table
        await queryInterface.changeColumn("Tourists", "resortId", {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "Resorts", // name of the target table
                key: "id", // key in the target table that we're referencing
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });

        // Update foreign key for 'owner' in 'Resorts' table
        await queryInterface.changeColumn("Resorts", "owner", {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "Users", // name of the target table
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });

        // Update foreign key for 'address' in 'Resorts' table
        await queryInterface.changeColumn("Resorts", "address", {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "Addresses", // name of the target table
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert foreign key for 'resortId' in 'Tourists' table
        await queryInterface.changeColumn("Tourists", "resortId", {
            type: Sequelize.INTEGER,
            allowNull: true, // You can revert the column's attributes as they were before
        });

        // Revert foreign key for 'owner' in 'Resorts' table
        await queryInterface.changeColumn("Resorts", "owner", {
            type: Sequelize.STRING, // Assuming it was a string before
            allowNull: true, // Reverting to the previous state
        });

        // Revert foreign key for 'address' in 'Resorts' table
        await queryInterface.changeColumn("Resorts", "address", {
            type: Sequelize.INTEGER,
            allowNull: true, // Revert to its previous state
        });
    },
};
