const { check, validationResult } = require('express-validator');
const createError = require('http-errors');
const path = require('path');
const fs = require('fs');

// import model
const User = require('../../models/People')

const userValidator = [
    check('name')
        .isLength({ min: 3 })
        .withMessage('Name is required')
        .isAlpha('en-US', { ignore: ' -' })
        .withMessage('Name must not container anything other than Alphabet')
        .trim(),
    check('email')
        .isEmail()
        .withMessage('Invalid email address')
        .trim()
        .custom(async (value) => {
            try {
                const user = await User.findOne({ email: value });
                if (user) {
                    throw createError('Email already is used')
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
    check('mobile')
        .isMobilePhone('bn-BD', {
            strictMode: true,
        })
        .withMessage('Invalid Bangladeshi mobile number')
        .custom(async (value) => {
            try {
                const mobile = await User.findOne({ mobile: value });
                if (mobile) {
                    throw createError('Mobile number already is used');
                }
            } catch (err) {
                throw createError(err.message)
            }
        }),
    check('password')
        .isStrongPassword()
        .withMessage('Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'),
];


const userValidatorHelper = (req, res, next)=> {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        // remove uploaded file
        if (req.files.length > 0) {
            const { filename } = req.files[0];
            fs.unlink(path.join(__dirname), `../../public/uploads/avatars/${filename}`, (err) => {
                if (err) {
                    console.log(err)
                }
            })
        }

        res.status(500).json({
            errors: mappedErrors
        })
    }
    /*
        mappedErrors = {
            name: {
                msg: 'Name is required
            },
            email: {
                msg: Invalid email address
            }
        }
    */
}

// module export
module.exports = {
    userValidator,
    userValidatorHelper,
}