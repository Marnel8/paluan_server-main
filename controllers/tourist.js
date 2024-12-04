// controllers/touristController.js
const { Tourist, Resort } = require("../models");

const addTourist = async (req, res) => {
	try {
		const {
			name,
			age,
			gender,
			region,
			province,
			municipality,
			barangay,
			contactNumber,
			visitDate,
			resortId,
		} = req.body;

		// Create the tourist
		const tourist = await Tourist.create({
			name,
			age,
			gender,
			contactNumber,
			visitDate,
			resortId,
			barangay,
			region,
			province,
			municipality,
		});

		return res.status(201).json({
			message: "Tourist added successfully!",
			tourist,
		});
	} catch (error) {
		console.error("Error adding tourist:", error);
		return res.status(500).json({
			message: "Error adding tourist",
			error: error.message,
		});
	}
};

const getTouristList = async (req, res) => {
	try {
		const tourists = await Tourist.findAll({
			include: [
				{
					model: Resort,
					as: "resort",
					attributes: ["id", "name"],
				},
			],
		});
		return res.status(200).json({
			message: "Tourists fetched successfully!",
			tourists,
		});
	} catch (error) {
		console.error("Error fetching tourists:", error);
		return res.status(500).json({
			message: "Error fetching tourists",
			error: error.message,
		});
	}
};

const getTouristByResortId = async (req, res) => {
	try {
		const { resortId } = req.params;
		const tourists = await Tourist.findAll({ where: { resortId } });
		return res.status(200).json({
			message: "Tourists fetched successfully!",
			tourists,
		});
	} catch (error) {
		console.error("Error fetching tourists:", error);
		return res.status(500).json({
			message: "Error fetching tourists",
			error: error.message,
		});
	}
};

const updateTourist = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			name,
			age,
			gender,
			region,
			province,
			municipality,
			barangay,
			contactNumber,
			visitDate,
			resortId,
		} = req.body;

		const tourist = await Tourist.findByPk(id);
		if (!tourist) {
			return res.status(404).json({
				message: "Tourist not found",
			});
		}

		await tourist.update({
			name,
			age,
			gender,
			region,
			province,
			municipality,
			barangay,
			contactNumber,
			visitDate,
			resortId,
		});

		return res.status(200).json({
			message: "Tourist updated successfully!",
			tourist,
		});
	} catch (error) {
		console.error("Error updating tourist:", error);
		return res.status(500).json({
			message: "Error updating tourist",
			error: error.message,
		});
	}
};

const deleteTourist = async (req, res) => {
	try {
		const { id } = req.params;

		const tourist = await Tourist.findByPk(id);
		if (!tourist) {
			return res.status(404).json({
				message: "Tourist not found",
			});
		}

		await tourist.destroy();

		return res.status(200).json({
			message: "Tourist deleted successfully!",
		});
	} catch (error) {
		console.error("Error deleting tourist:", error);
		return res.status(500).json({
			message: "Error deleting tourist",
			error: error.message,
		});
	}
};

module.exports = {
	addTourist,
	getTouristList,
	getTouristByResortId,
	updateTourist,
	deleteTourist,
};
