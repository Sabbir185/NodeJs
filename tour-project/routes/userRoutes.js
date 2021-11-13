const express = require('express');

const userControllers = require('../controllers/userControllers');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/loggedOut', authController.loggedOut);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// protect all below routers
router.use(authController.protect);

router.get('/me', userControllers.getMe, userControllers.getUser);

router.patch('/updateMyPassword', authController.updateMyPassword);

router.patch('/updateMe', userControllers.uploadUserPhoto, userControllers.resizeUserPhoto, userControllers.updateMe);

router.delete('/deleteMe', userControllers.deleteMe);


// restricted role below routers
router.use(authController.restrictTo('admin'));

router.route('/')
    .get(userControllers.getUsers)
    .post(userControllers.createUser)

router.route('/:id')
    .get(userControllers.getUser)
    .patch(userControllers.updateUser)
    .delete(userControllers.deleteUser)


module.exports = router;