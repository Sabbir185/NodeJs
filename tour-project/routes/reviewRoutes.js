const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// POST /tours/:tourId/review
// POST /review

router.route('/')
       .get(reviewController.getAllReviews)
       .post(authController.protect, authController.restrictTo('user', 'guide'), reviewController.createReview)

module.exports = router;