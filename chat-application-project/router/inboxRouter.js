// external import
const express = require('express');

// internal export
const { getInbox } = require('../controller/inboxController');
const { decorateHtmlResponse } = require('../middlewares/common/decorateHtmlResponse');

const router = express.Router();

// login router
router.get('/', decorateHtmlResponse('Inbox'), getInbox);

module.exports = router;
