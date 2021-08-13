const path = require('path');
const rootPath = require('../util/path');

const express = require('express');
const router = express.Router();

router.get('/', (req, res)=> {
    res.status(200).sendFile(path.join(rootPath, 'views', 'home.html'));
});


module.exports = router;
