const express = require('express');

const { getTours, postTour, getTour, updateTour, deleteTour} = require('../controllers/tourControllers');

const router = express.Router();


router.route('/')
    .get(getTours)
    .post(postTour)

router.route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

module.exports = router;