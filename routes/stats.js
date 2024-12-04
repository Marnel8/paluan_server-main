const express = require("express");
const router = express.Router();
const statsController = require("../controllers/stats");

// Get total tourists, resorts, male/female tourists
router.get("/totals", statsController.getTotals);

// Get number of guests per month for all resorts
router.get("/guests-per-month", statsController.getGuestsPerMonth);

// Get total number of guests across all resorts
router.get("/total-guests-per-resort", statsController.getTotalGuestsPerResort);

//get guest for reports
router.get("/guests", statsController.getGuests);

module.exports = router;
