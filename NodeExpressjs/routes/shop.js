const path = require('path');

const express = require('express');
const router = express.Router();

const rootPath = require('../utilities/path');

router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootPath, 'views', 'shop.html'));
});


module.exports = router;