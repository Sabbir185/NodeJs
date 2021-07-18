// http-error package
const createError = require('http-errors');

// page not found error
function notFoundError(req, res, next) {
    next(createError(404, 'Your requested content was not found!'))
}

// default error
function errorHandler(err, req, res, next) {
    res.locals.error = process.env.NODE_ENV === 'development' ? err : { message: err.message };

    res.status(err.status || 500);

    if (!res.locals.html) {
        // html response
        res.render('error', {
            title: 'Error Page!',
        });
    } else {
        // json response
        res.json(res.locals.error);
    }
}

// module export
module.exports = {
    notFoundError,
    errorHandler,
}