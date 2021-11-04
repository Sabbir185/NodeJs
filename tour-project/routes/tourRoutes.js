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
// const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.route("/top-5-cheap").get(aliasTopTours, getTours);

router.route("/")
      .get(getTours)
      .post(authController.protect, 
        authController.restrictTo('admin', 'lead-guide'), 
        postTour);

router.route("/tour-stats").get(tourStats)

router.route("/busyMonth/:year")
      .get(authController.protect, 
        authController.restrictTo('admin', 'lead-guide', 'guide'), 
        busyMonth)

router.route("/:id")
      .get(getTour)
      .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), updateTour)
      .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), deleteTour);


// nested route -> /tour/:tourId/review, we set a review route into tour route
// router.route('/:tourId/review')
//       .post(authController.protect, 
//             authController.restrictTo('guide'),
//             reviewController.createReview );

router.use('/:tourId/review', reviewRouter);


module.exports = router;
