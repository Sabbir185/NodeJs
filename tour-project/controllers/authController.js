const User = require('../models/UserModel');
const catchAsync = require('../utilities/catchAsync');
const jwt = require('jsonwebtoken');
const { promisify } = require('util')
const AppError = require('../utilities/appError');
const sendEmail = require('../utilities/email');


// generate token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN
    })
}


// user sign up
exports.signup = catchAsync(async (req, res, next) => {
    console.log(req.body)
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
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


// authorization
exports.restrictTo = ( ...roles ) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new AppError("You're not permitted for this action", 403));
        }

        next();
    }
}


// forgot password
exports.forgotPassword = catchAsync(async(req, res, next) => {
    // 1. get posted email
    const user = await User.findOne({email: req.body.email});
    if(!user) {
        return next(new AppError('There is no user with this email', 404));
    };

    // 2. generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3. send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to : ${resetURL}.\nif you didn't forget your password, please ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token <valid for 10 min>',
            message
        })
    
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        })

    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email, please try again!', 500));
    };
});

// reset password
exports.resetPassword = (req, res, next) => {};