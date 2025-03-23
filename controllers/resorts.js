const {
	User,
	Resort,
	Address,
	Rating,
	sequelize,
	Sequelize,
} = require("../models");
const { generateUsername, generatePassword } = require("../utils/auth");
const transporter = require("../config/nodeMailer");
const { where } = require("sequelize");
var bcrypt = require("bcryptjs");

function generateGuestRatingCode() {
	return `RT${Date.now().toString(36)}${Math.random()
		.toString(36)
		.slice(2, 6)}`.toUpperCase();
}

const addResortAndOwner = async (req, res) => {
	const t = await sequelize.transaction();

	const {
		name,
		address,
		category,
		updateAt,
		permitNo,
		description,
		ownerName,
		barangay,
		street,
		email,
		phone,
		longitude,
		latitude,
	} = req.body;
	try {
		const thumbnail = req.file;

		const username = generateUsername(email);
		const password = generatePassword();

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const user = await User.create(
			{
				name: ownerName,
				username,
				password: hashedPassword,
				email,
				userType: "resortOwner",
				phone,
			},
			{ transaction: t }
		);

		const resortAddress = await Address.create(
			{
				barangay,
				street,
			},
			{ transaction: t }
		);

		const guestRatingCode = generateGuestRatingCode();

		const resort = await Resort.create(
			{
				name,
				thumbnail: thumbnail.path,
				address,
				category,
				updateAt,
				permitNo,
				description,
				owner: user.id,
				address: resortAddress.id,
				guestRatingCode,
				longitude: longitude ? parseFloat(longitude) : null,
				latitude: latitude ? parseFloat(latitude) : null,
			},
			{ transaction: t }
		);

		await t.commit();

		const mailOptions = {
			from: "mathewmendoza0512@gmail.com",
			to: email,
			subject: "Your New Username and Password",
			text: `Hello! Here are your login details:\n\nUsername: ${username}\nPassword: ${password}\n\nPlease keep these credentials safe.\n\nPlease login using this link: https://paluan-tour.vercel.app/sign-in`,
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log("Error:", error);
			}
			console.log("Email sent:", info.response);
		});
		return res.status(201).json({ resort, owner: user });
	} catch (error) {
		await t.rollback();
		console.error("Error creating resort:", error);
		return res
			.status(500)
			.json({ message: "Server error", error: error.message });
	}
};

// Get a resort by ID
const getResortByID = async (req, res) => {
	try {
		const { id } = req.params;

		// Find the resort by primary key and include associated models
		const resort = await Resort.findByPk(id, {
			include: ["User", "Address"], // Include associated models if needed
		});

		if (!resort) {
			return res.status(404).send("Resort not found");
		}

		// Get the average rating for the resort from the Rating table
		const averageRating = await Rating.findOne({
			where: { resortId: id },
			attributes: [[Sequelize.fn("AVG", Sequelize.col("rating")), "avgRating"]],
		});

		// Add the average rating to the resort object
		const result = {
			...resort.toJSON(),
			averageRating: averageRating
				? parseFloat(averageRating.dataValues.avgRating).toFixed(2)
				: null, // Ensure it's a float with 2 decimal places
		};

		// Return the resort data along with the average rating
		res.status(200).json({ result });
	} catch (error) {
		console.error("Error fetching resort:", error);
		res.status(500).send("Server error");
	}
};

// Get a list of resorts
const getResortList = async (req, res) => {
	try {
		// Extract page and limit from query parameters
		const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
		const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 results per page if not provided
		const offset = (page - 1) * limit; // Calculate the offset for pagination

		// Fetch resorts with pagination
		const { count, rows } = await Resort.findAndCountAll({
			limit,
			offset,
			include: ["User", "Address"], // Include associated models if needed
		});

		// Calculate total pages
		const totalPages = Math.ceil(count / limit);

		// Respond with paginated data
		res.json({
			totalItems: count,
			totalPages,
			currentPage: page,
			pageSize: limit,
			resorts: rows,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
};

// Update a resort by ID
const updateResort = async (req, res) => {
	const { id } = req.params;
	const t = await sequelize.transaction();

	try {
		const {
			name,
			category,
			updateAt,
			permitNo,
			description,
			barangay,
			street,
			longitude,
			latitude,
		} = req.body;
		const thumbnail = req.file;

		const resort = await Resort.findByPk(id, {
			include: [{ model: Address }],
			transaction: t,
		});

		if (!resort) {
			await t.rollback();
			return res.status(404).json({ message: "Resort not found" });
		}

		if (resort.Address) {
			await Address.update(
				{
					barangay: barangay || resort.Address.barangay,
					street: street || resort.Address.street,
				},
				{
					where: { id: resort.Address.id },
					transaction: t,
				}
			);
		}

		await resort.update(
			{
				name: name || resort.name,
				thumbnail: thumbnail ? thumbnail.path : resort.thumbnail,
				category: category || resort.category,
				updateAt: updateAt || resort.updateAt,
				permitNo: permitNo || resort.permitNo,
				description: description || resort.description,
				longitude: longitude ? parseFloat(longitude) : resort.longitude,
				latitude: latitude ? parseFloat(latitude) : resort.latitude,
			},
			{ transaction: t }
		);

		await t.commit();
		return res.status(200).json({ resort });
	} catch (err) {
		await t.rollback();
		console.error(err);
		return res
			.status(500)
			.json({ message: "Server error", error: err.message });
	}
};

const getResortByOwner = async (req, res) => {
	try {
		const { ownerId } = req.params;
		const resorts = await Resort.findAll({
			where: { owner: ownerId },
			include: ["User", "Address"],
		});

		if (resorts.length === 0) {
			return res
				.status(404)
				.json({ message: "No resorts found for this owner" });
		}

		console.log(resorts);

		return res.status(200).json({ resorts });
	} catch (error) {
		console.error("Error fetching resorts:", error);
		return res
			.status(500)
			.json({ message: "Server error", error: error.message });
	}
};

// Delete a resort by ID
const deleteResort = async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await Resort.destroy({
			where: { id },
		});
		if (deleted) {
			res.status(204).send(); // No content
		} else {
			res.status(404).send("Resort not found");
		}
	} catch (error) {
		res.status(500).send("Server error");
	}
};

// Rate a resort by ID
const rateResort = async (req, res) => {
	try {
		const { id } = req.params;
		const { rating } = req.body;
		if (rating < 0 || rating > 5) {
			return res
				.status(400)
				.send("Invalid rating. It must be between 0 and 5.");
		}
		const [updated] = await Resort.update(
			{ rate: rating },
			{
				where: { id },
			}
		);
		if (updated) {
			const updatedResort = await Resort.findByPk(id);
			res.json(updatedResort);
		} else {
			res.status(404).send("Resort not found");
		}
	} catch (error) {
		res.status(500).send("Server error");
	}
};

module.exports = {
	addResortAndOwner,
	getResortByID,
	getResortList,
	updateResort,
	deleteResort,
	rateResort,
	getResortByOwner,
};
