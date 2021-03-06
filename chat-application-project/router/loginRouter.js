// external import
const express = require('express');
const router = express.Router();

// internal import
const { getLogin } = require('../controllers/loginController');
const  decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');

// user login route
router.get('/', decorateHtmlResponse('Login'), getLogin);

// module export
module.exports = router;