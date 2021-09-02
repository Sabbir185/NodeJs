const express = require('express');

const { getTours, postTour, getTour, updateTour, deleteTour, checkID } = require('../controllers/tourControllers');

const router = express.Router();

router.param('id', checkID);

router.route('/')
    .get(getTours)
    .post(postTour)

router.route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

module.exports = router;