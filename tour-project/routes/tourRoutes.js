const express = require("express");

const {
  getTours,
  postTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  tourStats
} = require("../controllers/tourControllers");

const router = express.Router();

router.route("/top-5-cheap").get(aliasTopTours, getTours);

router.route("/").get(getTours).post(postTour);

router.route("/tour-stats").get(tourStats)

router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
