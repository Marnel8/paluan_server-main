const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating");

// Define a route to create a rating and comment
router.get("/:resortId", ratingController.getRatingsByResort);

router.post("/", ratingController.createRating);

// Define a route to update a rating
router.put("/:ratingId", ratingController.updateRating);

// Define a route to delete a rating
router.delete("/:ratingId", ratingController.deleteRating);

module.exports = router;
