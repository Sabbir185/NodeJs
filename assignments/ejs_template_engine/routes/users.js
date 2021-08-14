const express = require('express');
const router = express.Router();

const userEntry = [];

router.post('/add-user', (req, res, next) => {
    console.log(req.body.name);
    userEntry.push(req.body.name);
    res.render('users', {
        title: 'User page',
        users: [...userEntry],
    });
});


module.exports = router;