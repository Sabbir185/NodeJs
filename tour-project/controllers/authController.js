const User = require('../models/UserModel');
const catchAsync = require('../utilities/catchAsync');
const jwt = require('jsonwebtoken');
const { promisify } = require('util')
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


// route checking -> jwt
exports.protect = catchAsync(async (req, res, next) => {
    // 1. getting token and check if it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(new AppError("You're not logged in, please login", 401));
    }

    // 2. verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3. check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exit!', 401));
    }

    // 4. check if user changed password after the token is issued
    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User changed password, please login!', 401));
    } 

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser
    next();
})