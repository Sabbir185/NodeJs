const express = require('express');
const router = express.Router();

const viewController = require('../controllers/viewController')
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');


router.get('/', bookingController.createBookingCheckout, authController.isLogin, viewController.getOverview);

router.get('/tour/:slug', authController.isLogin, viewController.getTour);

router.get('/login', authController.isLogin, viewController.login);

router.get('/me', authController.protect, viewController.account);

router.get('/my-booking', authController.protect, viewController.myBookingTour);

router.post('/submit-user-data', authController.protect, viewController.updateUserData);


module.exports = router;