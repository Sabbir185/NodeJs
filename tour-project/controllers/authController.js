const User = require('../models/UserModel');
const catchAsync = require('../utilities/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utilities/appError');


// generate token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN
    })
}


// user sign up
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'successful',
        token
    })
});


// user login
exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    // 1. check if email and password exit!
    if(!email || !password) {
        return next(new AppError('Please provide email & password!', 400));
    }

    // 2. check user exit and password correct
    const user = await User.findOne({ email }).select('+password');
    
    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Invalid email or password!', 401));
    }

    // 3. if everything is ok, send token to the client
    const token = signToken(user._id);

    res.status(200).json({
        status: 'successful',
        token
    })
});