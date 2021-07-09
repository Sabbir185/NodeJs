const express = require('express');
const dashboardRouter = express.Router();

dashboardRouter.get('/', (req, res) => {
    res.send('This is dashboard route!')
})


/*
    // receive param form url & set it in req object
    dashboardRouter.param('id', (req, res, next, id) => {
        req.id = id == 1 ? "Admin" : "Anonymous";
        next();
    })
*/


// another for param if we want to send some additional data
dashboardRouter.param((param, option) => (req, res, next, id) => {
    if( id == option) {
        next();
    } else {
        res.sendStatus(403);
    }
})

dashboardRouter.param('id', 121); // pass data for modify param and login route

dashboardRouter.get('/login/:id', (req, res) => {
    // console.log(req.id)
    // res.send('This is login route!')
    res.send('Hello Admin!')
})

module.exports = dashboardRouter;