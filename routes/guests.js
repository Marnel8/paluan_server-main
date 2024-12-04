const express = require("express");
const router = express.Router();
const guestController = require("../controllers/stats");
const touristController = require("../controllers/tourist");
// Get total guests
router.get("/", guestController.getGuests);
router.post("/save-guest", touristController.addTourist);
router.get("/tourist-list", touristController.getTouristList);
router.put("/update-tourist/:id", touristController.updateTourist);
router.delete("/delete-tourist/:id", touristController.deleteTourist);
router.get(
	"/tourist-by-resort/:resortId",
	touristController.getTouristByResortId
);

module.exports = router;
