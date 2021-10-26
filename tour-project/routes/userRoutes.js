const express = require('express');

const userControllers = require('../controllers/userControllers');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateMyPassword', authController.protect, authController.updateMyPassword);

router.patch('/updateMe', authController.protect, userControllers.updateMe);

router.route('/')
    .get(userControllers.getUsers)
    .post(userControllers.createUser)

router.route('/:id')
    .get(userControllers.getUser)
    .patch(userControllers.updateUser)
    .delete(userControllers.deleteUser)


module.exports = router;