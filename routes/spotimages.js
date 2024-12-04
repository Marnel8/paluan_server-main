const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const {
	getSpotImages,
	addSpotImage,
	deleteSpotImage,
	updateSpotImage,
} = require("../controllers/spotimages");

router.get("/:resortId", getSpotImages);
router.post("/", upload.single("image"), addSpotImage);
router.delete("/:id", deleteSpotImage);
router.put("/:id", upload.single("image"), updateSpotImage);

module.exports = router;
