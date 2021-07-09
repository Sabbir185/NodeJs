const express = require('express');
const publicRouter = express.Router();

publicRouter.get('/', (req, res) => {
    res.send('This is public route!')
})

publicRouter.get('/img', (req, res) => {
    res.send('This is image showcase route!')
})

module.exports = publicRouter;