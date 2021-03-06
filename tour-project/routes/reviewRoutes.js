const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// POST /tours/:tourId/review
// POST /review

router.route('/')
       .get(reviewController.getAllReviews)
       .post(authController.protect, 
              authController.restrictTo('user'), 
              reviewController.addTourAndUserId, 
              reviewController.createReview )


router.get('/:id', reviewController.getReview);

router.delete('/:id', 
              authController.protect, 
              authController.restrictTo('user', 'admin'), 
              reviewController.deleteReview);

router.patch('/:id', 
              authController.protect, 
              authController.restrictTo('user', 'admin'), 
              reviewController.updateReview);

module.exports = router;