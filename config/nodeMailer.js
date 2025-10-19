const nodemailer = require("nodemailer");

// Create a transporter with user and pass
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_USER, // Your Gmail address
        pass: process.env.NODEMAILER_PASS, // Your generated app password
    },
});

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error("Nodemailer configuration error:", error);
    } else {
        console.log("Nodemailer is ready to send emails");
    }
});

module.exports = transporter;
