const { Rating, Resort, User } = require("../models");

// Get ratings and comments for a specific resort with pagination
const getRatingsByResort = async (req, res) => {
	const { resortId } = req.params; // Get the resort ID from the URL parameters
	const { page = 1, pageSize = 10 } = req.query; // Get page and pageSize from query params, defaults to page 1 and pageSize 10

	const limit = parseInt(pageSize); // Number of ratings to display per page
	const offset = (parseInt(page) - 1) * limit; // Calculate offset for pagination

	try {
		// Fetch ratings with pagination and include the guest information
		const ratings = await Rating.findAndCountAll({
			where: { resortId },
			include: [
				{
					model: User,
					as: "guest",
					attributes: ["id", "name", "username"], // Fields you want from the guest
				},
			],
			limit,
			offset,
			order: [["createdAt", "DESC"]], // Order by newest first
		});

		// Total pages based on the number of ratings
		const totalPages = Math.ceil(ratings.count / limit);

		return res.status(200).json({
			message: "Ratings fetched successfully",
			data: ratings.rows, // Actual ratings data
			pagination: {
				totalItems: ratings.count,
				totalPages,
				currentPage: parseInt(page),
				pageSize: limit,
			},
		});
	} catch (error) {
		console.error("Error fetching ratings:", error);
		return res.status(500).json({
			message: "An error occurred while fetching the ratings.",
		});
	}
};

// Create a rating
const createRating = async (req, res) => {
	const { resortId, rating, comment, guestId, guestRatingCode } = req.body;
	try {
		const resort = await Resort.findByPk(resortId);
		if (!resort) {
			return res.status(404).json({ message: "Resort not found" });
		}

		if (resort?.guestRatingCode !== guestRatingCode) {
			return res.status(400).json({ message: "Invalid guest rating code" });
		}

		// Check for existing rating by the same guest for the same resort
		const existingRating = await Rating.findOne({
			where: {
				guestId,
				resortId,
			},
		});

		if (existingRating) {
			return res
				.status(400)
				.json({ message: "You have already rated this resort." });
		}

		const newRating = await Rating.create({
			guestId,
			resortId,
			rating,
			comment,
			guestRatingCode
		});

		return res.status(201).json({
			message: "Rating created successfully",
			data: newRating,
		});
	} catch (error) {
		console.error("Error creating rating:", error);
		return res.status(500).json({
			message: "An error occurred while creating the rating.",
		});
	}
};

// Update a rating
const updateRating = async (req, res) => {
	const { ratingId } = req.params; // Get rating ID from the request parameters
	const { rating, comment } = req.body;

	try {
		const ratingToUpdate = await Rating.findByPk(ratingId);
		if (!ratingToUpdate) {
			return res.status(404).json({ message: "Rating not found" });
		}

		// Check if the user is the owner of the rating
		//    if (ratingToUpdate.guestId !== req.user.id) {
		//        return res.status(403).json({ message: "You do not have permission to update this rating" });
		//    }

		// Update the rating
		await ratingToUpdate.update({ rating, comment });

		return res.status(200).json({
			message: "Rating updated successfully",
			data: ratingToUpdate,
		});
	} catch (error) {
		console.error("Error updating rating:", error);
		return res.status(500).json({
			message: "An error occurred while updating the rating.",
		});
	}
};

// Delete a rating
const deleteRating = async (req, res) => {
	const { ratingId } = req.params; // Get rating ID from the request parameters
	console.log(req.user);
	try {
		const ratingToDelete = await Rating.findByPk(ratingId);
		if (!ratingToDelete) {
			return res.status(404).json({ message: "Rating not found" });
		}

		// Check if the user is the owner of the rating

		// Delete the rating
		await ratingToDelete.destroy();

		return res.status(200).json({
			message: "Rating deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting rating:", error);
		return res.status(500).json({
			message: "An error occurred while deleting the rating.",
		});
	}
};

module.exports = {
	getRatingsByResort,
	createRating,
	updateRating,
	deleteRating,
};
