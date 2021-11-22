const { BadRequest } = require('../utils/errors')

exports.handleValidation = (validate) => {
    return (req, res, next) => {
        const result = validate(req.body);
        const isValid = result.error == null;

        if(isValid) {
            return next();
        }

        const { details } = result.error;
        const { message } = details.find(e => e.message);
        throw new BadRequest(message);
    }
}