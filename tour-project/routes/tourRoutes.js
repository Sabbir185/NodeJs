const express = require("express");

const {
  getTours,
  postTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  tourStats,
  busyMonth
} = require("../controllers/tourControllers");
const authController = require('../controllers/authController');

const router = express.Router();

router.route("/top-5-cheap").get(aliasTopTours, getTours);

router.route("/").get(authController.protect, getTours).post(postTour);

router.route("/tour-stats").get(tourStats)

router.route("/busyMonth/:year").get(busyMonth)

router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
