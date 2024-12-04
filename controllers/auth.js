const { User } = require("../models");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");

const { generateAccessToken, generateRefreshToken } = require("../utils/auth");
const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({
			where: {
				username,
			},
		});

		if (!user)
			return res.status(401).send({
				message: "Incorrect credentials",
			});

		//password checking
		const isPasswordMatch = bcrypt.compareSync(password, user.password);
		if (!isPasswordMatch)
			return res.status(401).send({
				message: "Incorrect credentials",
			});

		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);

		user.refreshToken = refreshToken;
		await user.save();

		// Send refresh token as HTTP-only cookie
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true, // Cookie is not accessible by JavaScript
			secure: process.env.NODE_ENV === "production", // Use secure cookies in production
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			sameSite: "strict",
		});

		// Return JWT in the response
		return res.json({ accessToken, user });
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
};

const logout = async (req, res) => {
	try {
		// Get refresh token from cookies instead of relying only on user object
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(200).json({ message: "Already logged out" });
		}

		// Find user by refresh token if user object is not in request
		const currentUser = req.user
			? await User.findByPk(req.user.id)
			: await User.findOne({ where: { refreshToken } });

		if (currentUser) {
			currentUser.refreshToken = null;
			await currentUser.save();
			console.log("User logged out successfully");
		}

		res.clearCookie("refreshToken");
		return res.sendStatus(200);
	} catch (err) {
		console.error("Error during logout:", err);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Controller for creating a new user
const createUser = async (req, res) => {
	const { name, email, password, username, userType } = req.body;

	// Define the allowed user types
	const allowedUserTypes = ["admin", "resortOwner", "guest"];

	try {
		// Check if the user already exists
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Validate user type
		if (userType && !allowedUserTypes.includes(userType)) {
			return res.status(400).json({
				message: `Invalid user type. Allowed types: ${allowedUserTypes.join(
					", "
				)}`,
			});
		}

		// Hash the password
		const saltRounds = 10; // Adjust the number of rounds as per your requirements
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Create a new user with the provided or default userType
		const newUser = await User.create({
			name,
			email,
			password: hashedPassword,
			username,
			userType: userType || "guest", // Default to 'guest' if no userType is provided
		});

		// Respond with the created user (excluding password)
		return res.status(201).json({
			id: newUser.id,
			name: newUser.name,
			email: newUser.email,
			userType: newUser.userType, // Include userType in the response
		});
	} catch (error) {
		console.error("Error creating user:", error);
		return res.status(500).json({ message: "Server error" });
	}
};

const refreshToken = (req, res) => {
	const refreshToken = req.cookies.refreshToken; // Access the refresh token from the cookie

	// If no refresh token is found, send unauthorized response
	if (!refreshToken) {
		return res.status(401).json({ message: "Refresh token not provided" });
	}

	// Verify the refresh token
	jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ message: "Invalid refresh token" }); // Forbidden if invalid
		}

		// If refresh token is valid, generate a new access token
		const newAccessToken = generateAccessToken(user);

		// Send the new access token in response
		return res.json({ accessToken: newAccessToken });
	});
};

const getMe = async (req, res) => {
	const { user } = req;

	const currentUser = await User.findByPk(user?.id);

	return res.json(currentUser);
};

const fetchUsers = async (req, res) => {
	const users = await User.findAll({});

	res.status(200).json(users);
};

const deleteUser = async (req, res) => {
	const { id } = req.params;
	await User.destroy({
		where: {
			id,
		},
	});

	return res.status(200).json({ message: "User deleted successfully" });
};

const changePassword = async (req, res) => {
	console.log("Auth debug:", {
		user: req.user,
		headers: req.headers.authorization,
	});

	// Check if user exists in request
	if (!req.user) {
		return res.status(401).json({ message: "User not authenticated" });
	}

	const { oldPassword, newPassword } = req.body;
	const { id: userId } = req.user;

	try {
		const currentUser = await User.findByPk(userId);

		if (!currentUser) {
			return res.status(404).json({ message: "User not found" });
		}

		const isPasswordMatch = bcrypt.compareSync(
			oldPassword,
			currentUser.password
		);

		if (!isPasswordMatch) {
			return res.status(401).json({ message: "Incorrect password" });
		}

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

		currentUser.password = hashedPassword;
		await currentUser.save();

		return res.status(200).json({ message: "Password changed successfully" });
	} catch (error) {
		console.error("Error changing password:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const updateProfile = async (req, res) => {
	const { name, email, phone, username } = req.body;
	const { user } = req;

	const currentUser = await User.findByPk(user.id);

	currentUser.name = name;
	currentUser.email = email;
	currentUser.phone = phone;
	currentUser.username = username;
	await currentUser.save();

	return res.status(200).json({ message: "Profile updated successfully" });
};

module.exports = {
	login,
	createUser,
	refreshToken,
	getMe,
	logout,
	fetchUsers,
	deleteUser,
	changePassword,
	updateProfile,
};
