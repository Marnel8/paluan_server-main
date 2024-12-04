const { Tourist, Resort } = require("../models");
const Sequelize = require("sequelize");

const getTotals = async (req, res) => {
    try {
        const totalTourists = await Tourist.count();
        const totalResorts = await Resort.count();
        const totalMaleTourists = await Tourist.count({ where: { gender: "male" } });
        const totalFemaleTourists = await Tourist.count({ where: { gender: "female" } });

        return res.json({
            totalTourists,
            totalResorts,
            totalMaleTourists,
            totalFemaleTourists,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

const getGuestsPerMonth = async (req, res) => {
    try {
        const guestsPerMonth = await Tourist.findAll({
            attributes: [
                [Sequelize.fn("DATE_FORMAT", Sequelize.col("visitDate"), "%Y-%m"), "month"], // MySQL compatible
                [Sequelize.fn("COUNT", Sequelize.col("id")), "totalGuests"],
            ],
            group: ["month"],
            order: [["month", "ASC"]],
        });

        return res.json(guestsPerMonth);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getTotalGuestsPerResort = async (req, res) => {
    try {
        const totalGuestsPerResort = await Tourist.findAll({
            attributes: [
                "resortId",
                [Sequelize.fn("COUNT", Sequelize.col("Tourist.id")), "totalGuests"], // Explicitly reference Tourist.id
            ],
            include: [
                {
                    model: Resort,
                    as: "resort", // Ensure alias matches the association
                    attributes: ["name"], // Include resort's name
                },
            ],
            group: ["resortId", "resort.id"], // Explicitly group by resort.id
            order: [["resortId", "ASC"]],
        });

        return res.json(totalGuestsPerResort);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getGuests = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Defaults to page 1 and limit 10
    const offset = (page - 1) * limit; // Calculate the offset

    try {
        const guests = await Tourist.findAndCountAll({
            include: [
                {
                    model: Resort,
                    as: "resort",
                    attributes: ["name"], // Include only the resort's name
                },
            ],
            limit: parseInt(limit), // Set the limit of rows per page
            offset: parseInt(offset), // Set the offset
            order: [["visitDate", "DESC"]], // Order guests by visit date
        });

        // Send pagination response
        return res.json({
            totalGuests: guests.count, // Total number of guests
            totalPages: Math.ceil(guests.count / limit), // Total number of pages
            currentPage: parseInt(page), // Current page
            guests: guests.rows, // Guests data
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { getTotals, getGuestsPerMonth, getTotalGuestsPerResort, getGuests };
