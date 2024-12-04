// authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to verify JWT and protect routes
const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

	if (!token) {
		return res.status(401).json({ message: "No token provided" });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ message: "Invalid token" });
		}
		req.user = user; // This sets the user info in the request
		next();
	});
};

module.exports = authenticateToken;
