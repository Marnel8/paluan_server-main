const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const {
	login,
	refreshToken,
	createUser,
	getMe,
	logout,
	fetchUsers,
	deleteUser,
	changePassword,
	updateProfile,
	forgotPassword,
} = require("../controllers/auth");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/login", login);
router.post("/logout", logout);
router.post("/", createUser);

router.get("/refresh-token", refreshToken);
router.get("/me", authenticateToken, getMe);

router.get("/", fetchUsers);
router.put("/change-password", authenticateToken, changePassword);
router.delete("/:id", deleteUser);
router.put("/profile", authenticateToken, updateProfile);
router.post("/forgot-password", forgotPassword);
module.exports = router;
