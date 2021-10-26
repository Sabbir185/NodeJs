// external module import
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
require('dotenv').config();

// internal module import
const AppError = require('./utilities/appError');
const globalErrorHandler = require('./middlewares/errorHandler');
const tourRouter = require('./routes/tourRoutes');
const UserRouter = require('./routes/userRoutes');

// app initialization
const app = express();

// middleware ::
// set security http headers
app.use(helmet());

// Development logging
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// limit request from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60*60*1000, // 1hr
    message: "Too many request from this IP, please try again in 1hr!"
})
app.use('/api', limiter);

// body parser, reading data from body into req.body
app.use(express.json({ limit: '50kb' })); // limit just optional

// Data sanitize against NoSQL query injection
app.use(mongoSanitize());

// Data sanitize against XSS
app.use(xss());

// preventing parameter pollution
app.use(hpp({
    whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'price', 'maxGroupSize', 'difficulty']
}))

// Serving static files
app.use(express.static(`${__dirname}/public/`));

// Test middleware
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