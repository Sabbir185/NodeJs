const express = require('express');
const router = express.Router();

// internal import
const { getUser, addUser, removeUser } = require('../controllers/usersController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');
const avatarUpload = require('../middlewares/users/avatarUpload');
const { userValidator, userValidatorHelper } = require('../middlewares/users/userValidators')

// user login route
router.get('/', decorateHtmlResponse('Users'), getUser);

// user post
router.post('/', avatarUpload, userValidator, userValidatorHelper, addUser);

// remove user
router.delete('/:id', removeUser);

// module export
module.exports = router;