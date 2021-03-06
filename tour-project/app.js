// external module import
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors')
require('dotenv').config();

// internal module import
const AppError = require('./utilities/appError');
const globalErrorHandler = require('./middlewares/errorHandler');
const tourRouter = require('./routes/tourRoutes');
const UserRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRouters');

// app initialization
const app = express();

app.enable('trust proxy');


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// middleware ::

app.use(cors());
// Access-Control-Allow-Origin *
// app.use(cors({
//   origin: 'https://www.fromFrontendHost.com'
// }))
app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

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
app.use(express.urlencoded({ extended: true, limit: '10kb'}));
app.use(cookieParser());

// Data sanitize against NoSQL query injection
app.use(mongoSanitize());

// Data sanitize against XSS
app.use(xss());

// preventing parameter pollution
app.use(hpp({
    whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'price', 'maxGroupSize', 'difficulty']
}))


app.use(compression())

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})


// routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);


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