const express = require('express');
const dashboardRouter = require('./dashboard');
const publicRouter = require('./public');

const app = express();


app.use('/public',publicRouter);
app.use('/dashboard',dashboardRouter);


app.get('/', (req, res) => {
    res.send('This is home!')
})


app.listen(3000, () => {
    console.log('Port is listening 3000');
})