const AppError = require('../utilities//appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path} : ${err.value}.`;
    return new AppError(message, 400);
};

// DEVELOPMENT: send error details as much as possible 
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};


// PRODUCTION
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });

    } else {
        // programming or other unknown error: don't leak error to other
        // 1. log error
        console.error('Error : ', err);

        // 2. send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        })
    }
};


// GLOBAL: custom error handling 
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if(process.env.NODE_ENV === 'production') {
        let error;
        if(err.name === 'CastError'){ 
            error = handleCastErrorDB(err);
        }
        
        sendErrorProd(error, res);
    }
};