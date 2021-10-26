// external module import
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
require('dotenv').config();

// internal module import
const AppError = require('./utilities/appError');
const globalErrorHandler = require('./middlewares/errorHandler');
const tourRouter = require('./routes/tourRoutes');
const UserRouter = require('./routes/userRoutes');

// app initialization
const app = express();

// middleware
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60*60*1000, // 1hr
    message: "Too many request from this IP, please try again in 1hr!"
})
app.use('/api', limiter);

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
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'failed',
    //     message: `Requested ${req.originalUrl} not found!`
    // });

    // checking global error by through new Error()
    // const err = new Error(`Requested ${req.originalUrl} not found!`);
    // err.statusCode = 400;
    // err.status = 'failed';
    // next(err);

    // CODE OPTIMIZED: error class calling
    next(new AppError(`Requested ${req.originalUrl} not found!`, 404));
});


// global error handling
app.use(globalErrorHandler);


module.exports = app;