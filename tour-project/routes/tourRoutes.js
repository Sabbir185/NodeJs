const express = require("express");

const {
  getTours,
  postTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  tourStats,
  busyMonth,
  getToursWithin,
  getDistances
} = require("../controllers/tourControllers");

const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.route("/top-5-cheap").get(aliasTopTours, getTours);

router.get('/tours-within/:distance/center/:latlng/unit/:unit', getToursWithin);

router.get('/distance/:latlng/unit/:unit', getDistances);

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
