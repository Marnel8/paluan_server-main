const jwt = require("jsonwebtoken");
const { generateFromEmail } = require("unique-username-generator");
var generator = require("generate-password");

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, {
        expiresIn: "1hr",
    });
};

// Function to generate refresh token
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, {
        expiresIn: "12hr",
    });
};

const generateUsername = (email) => {
    return generateFromEmail(email, 3);
};

const generatePassword = () => {
    return generator.generate({
        length: 8,
        numbers: true,
    });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateUsername,
    generatePassword,
};
