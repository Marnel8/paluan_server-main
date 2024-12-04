const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const {
	getResortByID,
	getResortList,
	updateResort,
	deleteResort,
	rateResort,
	addResortAndOwner,
	getResortByOwner,
} = require("../controllers/resorts");

router.get("/", getResortList);
router.get("/:id", getResortByID);
router.post("/", upload.single("thumbnail"), addResortAndOwner);
router.post(":id/rate", rateResort);
router.put("/:id", upload.single("thumbnail"), updateResort);
router.delete("/:id", deleteResort);
router.get("/owner/:ownerId", getResortByOwner);
module.exports = router;
