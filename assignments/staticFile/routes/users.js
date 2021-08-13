const express = require('express');
const router = express.Router();

const path = require('path');
const rootPath = require('../util/path');


router.get('/', (req, res)=> {
    res.status(200).sendFile(path.join(rootPath, 'views', 'users.html'));
});


module.exports = router;
