const path = require('path');

const express = require('express');
const router = express.Router();

const rootPath = require('../utilities/path');

router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(rootPath, 'views', 'add-product.html'));
});

router.get('/product', (req, res, next) => {
    console.log(req.body)
    res.redirect('/');
});


module.exports = router;