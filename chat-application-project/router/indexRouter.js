// external import
const express = require('express');
const router = express.Router();

// internal import
const { getIndex } = require('../controllers/indexController');
const  decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');

// user login route
router.get('/', decorateHtmlResponse('Users'), getIndex);

// module export
module.exports = router;