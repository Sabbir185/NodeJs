const AppError = require('../utilities//appError');


const handleCastErrorDB = err => {
    const message = `Invalid ${err.path} : ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const value = err.keyValue.name;
    const message = `Duplicate field value : ${value}.`;
    return new AppError(message, 400);
}

const handleValidationError = err => {
    const message = err._message;
    return new AppError(message, 400);
}


const handleJsonWebTokenError = () => new AppError('invalid signature, login again', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);


// DEVELOPMENT: send error details as much as possible 
const sendErrorDev = (err, req, res, next) => {
    // api response
        // res.status(err.statusCode).json({
        //     status: err.status,
        //     error: err,
        //     message: err.message,
        //     stack: err.stack
        // });

    console.log('error -> ', err);
    // render page
    res.status(200).render('error', {
        title: 'Something wrong!',
        msg: err.message
    })
};


// PRODUCTION
const sendErrorProd = (err, req, res, next) => {
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
        sendErrorDev(err, req, res, next);
        
    } else if(process.env.NODE_ENV === 'production') {
        let error;
        if(err.name === 'CastError'){ 
            error = handleCastErrorDB(err);
        }
        else if(err.code === 11000){ 
            error = handleDuplicateFieldsDB(err);
        }
        else if(err.name === 'ValidationError'){ 
            error = handleValidationError(err);
        }
        else if(err.name === 'JsonWebTokenError'){ 
            error = handleJsonWebTokenError();
        }
        else if(err.name === 'TokenExpiredError') error = handleJWTExpiredError();
        
        
        error = !error ? err : error;
        sendErrorProd(error, req, res, next);
    }
};