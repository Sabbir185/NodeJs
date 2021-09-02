// external module import
const express = require('express');
require('dotenv').config();

// internal module import
const tourRouter = require('./routes/tourRoutes');
const UserRouter = require('./routes/userRoutes');

// app initialization
const app = express();

// middleware
app.use(express.json())
app.use(express.static(`${__dirname}/public/`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', UserRouter);


module.exports = app;