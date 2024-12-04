const nodemailer = require("nodemailer");

// Create a transporter with user and pass
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_USER, // Your Gmail address
        pass: process.env.NODEMAILER_PASS, // Your generated app password
    },
});

module.exports = transporter;
