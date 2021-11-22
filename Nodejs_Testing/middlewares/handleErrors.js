const { GeneralError } = require("../utils/errors")

exports.handleError = async (err, req, res, next) => {
    let code = 500;
    if(err instanceof GeneralError) {
        const code = err.getCode();
    }

    const correlationId = req.headers['x-correlation-id'];
    
    return res.status(code).json({
        correlationId: correlationId,
        message: err.message
    })
}