// external packages
const express = require('express');

// internal packages
const { getUsers } = require('../controller/usersController');
const { decorateHtmlResponse } = require('../middlewares/common/decorateHtmlResponse');

const router = express.Router();

// get Users
router.get('/', decorateHtmlResponse('Users'), getUsers);

module.exports = router;