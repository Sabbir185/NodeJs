// external import
const express = require('express');

// internal export
const { getLogin } = require('../controller/loginController');
const { decorateHtmlResponse } = require('../middlewares/common/decorateHtmlResponse');

const router = express.Router();

// login router
router.get('/', decorateHtmlResponse('Login'), getLogin);

module.exports = router;
