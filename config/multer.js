const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads", // Optional folder name
        allowedFormats: ["jpeg", "png", "jpg"],
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
