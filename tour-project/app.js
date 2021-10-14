// external module import
const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

// internal module import
const tourRouter = require('./routes/tourRoutes');
const UserRouter = require('./routes/userRoutes');

// app initialization
const app = express();

// middleware
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json())
app.use(express.static(`${__dirname}/public/`));


app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})


// routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', UserRouter);


// handle unwanted routes
app.use('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'failed',
    //     message: `Requested ${req.originalUrl} not found!`
    // });

    // checking global error by through new Error()
    const err = new Error(`Requested ${req.originalUrl} not found!`);
    err.statusCode = 400;
    err.status = 'failed';
    next(err);
});


// global error handling
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});


module.exports = app;